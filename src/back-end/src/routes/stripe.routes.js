import { Router } from "express";
import { createPayment } from "../controllers/stripe.controller.js";

const stripeRouter = Router();

stripeRouter.post("/create", createPayment);

export default stripeRouter;
