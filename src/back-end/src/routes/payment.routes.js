import { Router } from "express";
import {
  createPayment,
  deletePaymentById,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
} from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.get("/", getAllPayments);
paymentRouter.get("/:id", getPaymentById);
paymentRouter.post("/", createPayment);
paymentRouter.delete("/:id", deletePaymentById);
paymentRouter.put("/:id", updatePaymentById);

export default paymentRouter;
