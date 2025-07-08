export const stripePrices = {
  pro: {
    priceId: 'price_xxx', // replace with real Stripe price ID
    label: 'Pixora Pro',
    amount: 499,
  },
};

export const handleCheckout = async () => {
  console.log('Stripe Checkout triggered.');
};
