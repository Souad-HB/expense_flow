import {
  updateAccountBalance,
  deleteAccount,
  createAccount,
} from "../../controllers/account-controller.js";

import express from "express";

const router = express.Router();

// PUT update Account balance
router.put("/:id/balance", updateAccountBalance);

// POST create account
router.post("/", createAccount);

// DELETE an account
router.delete("/:id", deleteAccount);

export { router as accountRouter };
