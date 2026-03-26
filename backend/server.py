from fastapi import FastAPI, APIRouter, Request, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
import stripe


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Setup logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Stripe configuration
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
stripe.api_key = STRIPE_API_KEY

# Pricing packages from environment variables
STRIPE_PRICES = {
    "pro_monthly": {
        "price_id": os.environ.get('STRIPE_PRO_MONTHLY_PRICE_ID', 'price_1TFBEUG9itmP4q8VQtGCfAf9'),
        "name": "Threshold Pro Monthly",
        "amount": 14.99,
        "currency": "gbp",
        "tier": "pro"
    },
    "pro_annual": {
        "price_id": os.environ.get('STRIPE_PRO_ANNUAL_PRICE_ID', 'price_1TFBGqG9itmP4q8VKYOJkAHb'),
        "name": "Threshold Pro Annual",
        "amount": 119.00,
        "currency": "gbp",
        "tier": "pro"
    },
    "complete_monthly": {
        "price_id": os.environ.get('STRIPE_COMPLETE_PRICE_ID', 'price_1TFBHYG9itmP4q8V1E3tzRoz'),
        "name": "Threshold Complete",
        "amount": 297.00,
        "currency": "gbp",
        "tier": "complete"
    }
}

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Stripe checkout request models
class CreateCheckoutRequest(BaseModel):
    package_id: str  # "pro_monthly", "pro_annual", or "complete_monthly"
    origin_url: str
    user_id: Optional[str] = None
    user_email: Optional[str] = None

class CheckoutStatusRequest(BaseModel):
    session_id: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks


# ============ STRIPE CHECKOUT ENDPOINTS ============

@api_router.post("/stripe/checkout")
async def create_checkout_session(request: Request, checkout_request: CreateCheckoutRequest):
    """Create a Stripe checkout session for subscription"""
    
    # Validate package
    if checkout_request.package_id not in STRIPE_PRICES:
        raise HTTPException(status_code=400, detail="Invalid package selected")
    
    package = STRIPE_PRICES[checkout_request.package_id]
    
    # Build URLs from frontend origin
    success_url = f"{checkout_request.origin_url}/upgrade?session_id={{CHECKOUT_SESSION_ID}}&status=success"
    cancel_url = f"{checkout_request.origin_url}/upgrade?status=cancelled"
    
    try:
        # Create Stripe checkout session for subscription
        session = stripe.checkout.Session.create(
            mode='subscription',
            line_items=[{
                'price': package["price_id"],
                'quantity': 1,
            }],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                "package_id": checkout_request.package_id,
                "tier": package["tier"],
                "user_id": checkout_request.user_id or "",
                "user_email": checkout_request.user_email or "",
            }
        )
        
        # Store transaction in database
        transaction = {
            "id": str(uuid.uuid4()),
            "session_id": session.id,
            "package_id": checkout_request.package_id,
            "package_name": package["name"],
            "tier": package["tier"],
            "amount": package["amount"],
            "currency": package["currency"],
            "user_id": checkout_request.user_id,
            "user_email": checkout_request.user_email,
            "payment_status": "pending",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.payment_transactions.insert_one(transaction)
        
        return {
            "url": session.url,
            "session_id": session.id
        }
    except stripe.error.StripeError as e:
        logger.error(f"Stripe checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout session: {str(e)}")
    except Exception as e:
        logger.error(f"Checkout error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create checkout session: {str(e)}")


@api_router.get("/stripe/checkout/status/{session_id}")
async def get_checkout_status(session_id: str):
    """Get the status of a checkout session"""
    
    try:
        # Retrieve session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        
        # Update transaction in database if payment completed
        if session.payment_status == "paid":
            # Check if already processed
            existing = await db.payment_transactions.find_one({"session_id": session_id})
            if existing and existing.get("payment_status") != "paid":
                await db.payment_transactions.update_one(
                    {"session_id": session_id},
                    {"$set": {
                        "payment_status": "paid",
                        "status": session.status,
                        "subscription_id": session.subscription,
                        "customer_id": session.customer,
                        "paid_at": datetime.now(timezone.utc).isoformat()
                    }}
                )
        
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "amount_total": session.amount_total,
            "currency": session.currency,
            "metadata": dict(session.metadata) if session.metadata else {}
        }
    except stripe.error.StripeError as e:
        logger.error(f"Stripe status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to check payment status: {str(e)}")


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhook events"""
    try:
        body = await request.body()
        event = stripe.Event.construct_from(
            stripe.util.json.loads(body), stripe.api_key
        )
        
        # Handle the event
        if event.type == 'checkout.session.completed':
            session = event.data.object
            
            await db.payment_transactions.update_one(
                {"session_id": session.id},
                {"$set": {
                    "payment_status": "paid",
                    "event_type": event.type,
                    "subscription_id": session.subscription,
                    "customer_id": session.customer,
                    "paid_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        elif event.type == 'customer.subscription.deleted':
            subscription = event.data.object
            await db.payment_transactions.update_one(
                {"subscription_id": subscription.id},
                {"$set": {
                    "subscription_status": "cancelled",
                    "cancelled_at": datetime.now(timezone.utc).isoformat()
                }}
            )
        
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        return {"status": "error", "message": str(e)}


@api_router.get("/stripe/prices")
async def get_prices():
    """Get available subscription prices"""
    return STRIPE_PRICES

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()