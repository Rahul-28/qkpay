import Stripe from "stripe";
import { STRIPE_SECRET } from "../config/env.js";
const stripe = new Stripe(STRIPE_SECRET);

export const createPayment = async (req, res, next) => {
  console.log("Creating payment intent");
  try {
    const { amount, customer } = req.body;
    const { email } = customer;
    if (!amount || isNaN(amount)) {
      return res.status(400).send({ error: "Invalid amount" });
    }
    if (!customer || email === null) {
      return res.status(400).send({ error: "No account details" });
    }
    const intent = await stripe.paymentIntents.create({
      amount: parseInt(amount, 10),
      currency: "usd",
      payment_method_types: ["card"],
      receipt_email: email,
    });
    res.send({ paymentIntent: intent });
  } catch (err) {
    next(err);
  }
};
