import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  creator: {
    email: { type: String, required: true },
    name: { type: String, required: true },
  },
  invoice: {
    phone: { type: Number, required: true },
    amount: { type: Number, required: true },
    invoice_month: { type: String, required: true },
    address_line1: { type: String, required: true },
    address_line2: { type: String, required: false },
    zip_code: { type: String, required: true },
  },
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
