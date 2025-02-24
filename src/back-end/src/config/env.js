import { config } from "dotenv";

config({ path: ".env.development" });

export const { PORT, MONGODB_URI, NODE_ENV, JWT_ACCESS_TOKEN, STRIPE_SECRET } =
  process.env;
