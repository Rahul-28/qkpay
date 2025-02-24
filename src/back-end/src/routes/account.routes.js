import { Router } from "express";
import {
  deleteAccountById,
  getAccountById,
  getAllAccounts,
  updateAccountById,
} from "../controllers/account.controller.js";

const accountRouter = Router();

accountRouter.get("/", getAllAccounts);
accountRouter.get("/:id", getAccountById);
accountRouter.delete("/:id", deleteAccountById);
accountRouter.put("/:id", updateAccountById);

export default accountRouter;
