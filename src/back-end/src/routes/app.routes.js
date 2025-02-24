import { Router } from "express";
import authRouter from "./auth.routes.js";
import accountRouter from "./account.routes.js";
import paymentRouter from "./payment.routes.js";
import stripeRouter from "./stripe.routes.js";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/accounts", accountRouter);
appRouter.use("/payments", paymentRouter);
appRouter.use("/stripe", stripeRouter);

export default appRouter;
