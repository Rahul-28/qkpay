import Account from "../models/account.model.js";

export const getAllAccounts = async (req, res, next) => {
  try {
    const allAccounts = await Account.find({});
    res.status(200).json(allAccounts);
  } catch (err) {
    next(err);
  }
};

export const getAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundAccount = await Account.findById(id);
    if (!foundAccount) {
      return res.status(404).json({ message: "Account not found" });
    }
    res.status(200).json(foundAccount);
  } catch (err) {
    next(err);
  }
};

export const deleteAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      return res.status(404).json({ message: "Account does not exist" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateAccountById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await Account.findByIdAndUpdate(id, req.body, {
      new: false,
    });
    if (!account) {
      return res.status(404).json({ message: "Account does not exist" });
    }
    res.status(200).json(account);
  } catch (err) {
    next(err);
  }
};
