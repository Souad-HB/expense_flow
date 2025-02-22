import {
  createLinkToken,
  exchangePublicToken,
  getAccountBalance,
} from "../../controllers/plaid-controller.js";

import express from "express";

const router = express.Router();

router.post("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.get("/accounts/balance/get", getAccountBalance)

export { router as plaidRouter };
