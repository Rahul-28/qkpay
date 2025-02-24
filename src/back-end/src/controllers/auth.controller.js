import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Account from "../models/account.model.js";
import { JWT_ACCESS_TOKEN } from "../config/env.js";
import mongoose from "mongoose";

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdAccount = await Account.create({
      name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign({ id: createdAccount._id }, JWT_ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { token: accessToken, loggedAccount: createdAccount },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const account = await Account.findOne({ email: email });

    if (!account) {
      const error = new Error("Account not found", 404);
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials", 404);
      throw error;
    }

    const payload = { id: account._id };
    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Account loggedIn successfully",
      data: { token: accessToken, loggedAccount: account },
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
};
