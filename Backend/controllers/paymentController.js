import Stripe from 'stripe';


export const createPaymentIntent = async (req, res) => {
  
    console.log("Checking Key:", process.env.STRIPE_SECRET_KEY); 
  
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;

    console.log("Stripe call start ho rahi hai..."); // Debugging

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });

    console.log("Stripe response mil gaya!"); // Debugging

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("Error details:", error); // Terminal mein error dekho
    res.status(500).json({ message: error.message });
  }
};