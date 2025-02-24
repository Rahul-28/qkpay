import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;
