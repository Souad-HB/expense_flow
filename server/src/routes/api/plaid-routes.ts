import {
  createLinkToken,
  exchangePublicToken,
  getAccountBalance,
  getInstitutionsLogos,
  getRecurringTransactions,
  getTransactions,
  hasAccessToken,
} from "../../controllers/plaid-controller.js";

import express from "express";

const router = express.Router();
router.post("*", (req, _res, next) => {
  console.log(`🔍 API Route Called: ${req.method} ${req.originalUrl}`);
  next();
});
router.post("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.get("/accounts/balance/get", getAccountBalance);
router.get("/institutions/get", getInstitutionsLogos);
router.get("/hasaccess", hasAccessToken);
router.post("/transactions/sync", getTransactions);
router.post("/transactions/recurring/get", getRecurringTransactions);

export { router as plaidRouter };