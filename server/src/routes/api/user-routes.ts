import {
  getUsersAccounts,
  createUser,
  updateUserPassword,
  getUsersTransactions,
} from "../../controllers/user-controller.js";

import express from "express";

const router = express.Router();

// GET user's accounts
router.get("/:id/accounts", getUsersAccounts);

// POST create user
router.post("/", createUser);

//PUT update user's password
router.put("/:id/password", updateUserPassword);

// GET user's transactions
router.get("/:id/transactions", getUsersTransactions);

export { router as userRouter };
