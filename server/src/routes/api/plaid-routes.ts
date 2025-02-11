import {
  createLinkToken,
  exchangePublicToken,
} from "../../controllers/plaid-controller.js";

import express from "express";

const router = express.Router();

router.post("/create-link-token", createLinkToken);
router.post("/exchange-public-token", exchangePublicToken);

export { router as plaidRouter };
