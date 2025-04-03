import {
  updateAccountBalance,
  deleteAccount,
  createAccount,
  getAccountBalanceFromDB,
} from "../../controllers/account-controller.js";

import express from "express";

const router = express.Router();
// get accounts from database
router.get("/", getAccountBalanceFromDB)

// PUT update Account balance
router.put("/:id/balance", updateAccountBalance);

// POST create account
router.post("/", createAccount);

// DELETE an account
router.delete("/:id", deleteAccount);

export { router as accountRouter };
