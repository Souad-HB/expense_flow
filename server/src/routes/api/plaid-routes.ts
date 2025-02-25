import {
  createLinkToken,
  exchangePublicToken,
  getAccountBalance,
  getInstitutionsLogos,
} from "../../controllers/plaid-controller.js";

import express from "express";

const router = express.Router();

router.post("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.get("/accounts/balance/get", getAccountBalance);
router.get("/institutions/get", getInstitutionsLogos);


export { router as plaidRouter };

