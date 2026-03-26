// Stripe client for THRESHOLD
// Uses backend API for checkout sessions

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export const PRICES = {
  pro_monthly: 'price_1TFBEUG9itmP4q8VQtGCfAf9',
  pro_annual: 'price_1TFBGqG9itmP4q8VKYOJkAHb',
  complete_monthly: 'price_1TFBHYG9itmP4q8V1E3tzRoz',
};

export const TIER_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Full 16-question assessment',
      'Personalised results profile',
      'Cost calculator',
      'Week 1 plan',
      '3 daily check-ins',
    ]
  },
  pro: {
    name: 'Threshold Pro',
    monthlyPrice: 14.99,
    annualPrice: 119,
    annualMonthly: 9.92,
    features: [
      'Complete 30-day programme',
      'Unlimited daily check-ins',
      'Full progress dashboard',
      'Savings tracker',
      'Private journaling',
      'Resource library',
      'Partner access',
      'Milestone notifications',
    ]
  },
  complete: {
    name: 'Threshold Complete',
    monthlyPrice: 297,
    features: [
      'Everything in Pro',
      'Fortnightly 1:1 coaching sessions',
      'Direct booking in-app',
      'Pre & post session notes',
      'Private community access',
      'SMS check-in reminders',
      'Partner communication guide',
      '90-day extended programme',
      'WhatsApp support (Mon-Fri)',
    ]
  }
};

// Create checkout session and redirect to Stripe
export const createCheckoutSession = async (packageId, userId = null, userEmail = null) => {
  try {
    const response = await fetch(`${API_URL}/api/stripe/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        package_id: packageId,
        origin_url: window.location.origin,
        user_id: userId,
        user_email: userEmail,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create checkout session');
    }

    const data = await response.json();
    
    // Redirect to Stripe Checkout
    if (data.url) {
      window.location.href = data.url;
    }
    
    return data;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

// Check payment status
export const checkPaymentStatus = async (sessionId) => {
  try {
    const response = await fetch(`${API_URL}/api/stripe/checkout/status/${sessionId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Status check error:', error);
    throw error;
  }
};

// Poll for payment status (call this on success page)
export const pollPaymentStatus = async (sessionId, onSuccess, onError, maxAttempts = 5) => {
  let attempts = 0;
  const pollInterval = 2000; // 2 seconds

  const poll = async () => {
    if (attempts >= maxAttempts) {
      onError?.('Payment status check timed out');
      return;
    }

    try {
      const status = await checkPaymentStatus(sessionId);
      
      if (status.payment_status === 'paid') {
        onSuccess?.(status);
        return;
      } else if (status.status === 'expired') {
        onError?.('Payment session expired');
        return;
      }
      
      // Continue polling
      attempts++;
      setTimeout(poll, pollInterval);
    } catch (error) {
      onError?.(error.message);
    }
  };

  poll();
};

// Mock function to upgrade tier locally (for demo/testing)
export const mockUpgradeTier = (newTier) => {
  const data = JSON.parse(localStorage.getItem('threshold_data') || '{}');
  const auth = JSON.parse(localStorage.getItem('threshold_auth') || '{}');
  
  if (auth?.user?.id && data.profiles?.[auth.user.id]) {
    data.profiles[auth.user.id].tier = newTier;
    localStorage.setItem('threshold_data', JSON.stringify(data));
    return true;
  }
  return false;
};
