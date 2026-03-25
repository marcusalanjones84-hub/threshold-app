// Mock Stripe client for THRESHOLD
// Replace with real Stripe when credentials are provided

export const getStripe = () => {
  // Mock Stripe object
  return Promise.resolve({
    redirectToCheckout: async ({ sessionId }) => {
      console.log('Mock Stripe: Would redirect to checkout with session:', sessionId);
      // Simulate successful checkout
      return { error: null };
    }
  });
};

export const PRICES = {
  pro_monthly: 'price_mock_pro_monthly',
  pro_annual: 'price_mock_pro_annual',
  complete_monthly: 'price_mock_complete',
};

export const TIER_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Full 15-question assessment',
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

// Mock checkout function
export const createCheckoutSession = async (priceId, userId) => {
  console.log('Mock Stripe: Creating checkout session for price:', priceId, 'user:', userId);
  
  // Simulate successful upgrade
  return {
    sessionId: 'mock_session_' + Date.now(),
    url: null // No redirect in mock mode
  };
};

// Mock function to upgrade tier (for demo purposes)
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
