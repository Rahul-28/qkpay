import Payment from "../models/payment.model.js";

export const getAllPayments = async (req, res, next) => {
  try {
    const allPayments = await Payment.find({});
    res.status(200).json(allPayments);
  } catch (err) {
    next(err);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundPayment = await Payment.findById(id);
    if (!foundPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(foundPayment);
  } catch (err) {
    next(err);
  }
};

export const deletePaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment does not exist" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const createPayment = async (req, res, next) => {
  try {
    const createdPayment = await Payment.create(req.body);
    res.status(201).json(createdPayment);
  } catch (err) {
    next(err);
  }
};

export const updatePaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findOneAndUpdate({ id: id }, req.body, {
      new: false,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment does not exist" });
    }
    res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
};
