import {
  getAllRecurringTransactionsNext7Days,
  getAllRecurringTransactions,
  getAllRecurringTransactionsOfTheMonth,
  createTransaction,
  getAllTransactions,
} from "../../controllers/transaction-controller.js";

import express from "express";

const router = express.Router();
// GET all transactions
// /transactions
router.get("/", getAllTransactions);
// GET all recurring transactions
// /transactions/recurring
router.get("/recurring", getAllRecurringTransactions);

// GET recurring transactions of the next 7 days to come
// transactions/recurring/next7days
router.get("/recurring/next7days", getAllRecurringTransactionsNext7Days);

// GET recurring transactions of the month
// transactions/recurring/month
router.get("/recurring/month", getAllRecurringTransactionsOfTheMonth);

// POST create a new transaction
// transactions/
router.post("/", createTransaction);

export { router as transactionRouter };
