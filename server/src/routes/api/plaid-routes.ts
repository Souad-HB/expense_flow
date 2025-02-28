import {
  createLinkToken,
  exchangePublicToken,
  getAccountBalance,
  getInstitutionsLogos,
  hasAccessToken,
} from "../../controllers/plaid-controller.js";

import express from "express";

const router = express.Router();

router.post("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);
router.get("/accounts/balance/get", getAccountBalance);
router.get("/institutions/get", getInstitutionsLogos);
router.get('/hasaccess', hasAccessToken)


export { router as plaidRouter };

