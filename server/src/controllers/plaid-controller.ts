import { Request, Response } from "express";
import { plaidClient } from "../server.js";
import { Products, CountryCode } from "plaid";
import { prettyPrintResponse } from "../server.js";
import { PlaidAccount } from "../models/plaidAccount.js";

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(",") as Products[];
const PLAID_COUNTRY_CODES: CountryCode[] = (
  process.env.PLAID_COUNTRY_CODES || "US"
).split(",") as CountryCode[];

// initializing the tokens
let ITEM_ID = null;
let PUBLIC_TOKEN = null;
let ACCESS_TOKEN = null;

// step1: api/create_link_token
export const createLinkToken = async (req: Request, res: Response) => {
  const userId = req.user?.id?.toString() || "default_user_id";
  if (!userId) {
    res.status(404).json({ message: "user not found"})
  }
  const configs = {
    user: {
      client_user_id: userId,
    },
    client_name: "Expense Flow App",
    products: PLAID_PRODUCTS,
    country_codes: PLAID_COUNTRY_CODES,
    language: "en",
  };
  console.log(configs)
  try {
    // call plaid API to create link token
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    // print the response
    prettyPrintResponse(createTokenResponse);
    res.json(createTokenResponse.data);
  } catch (error) {
    console.error("Error creating link token", error);
    res.status(500).json({ message: "Failed to create link token" });
  }
};

// step2: exchange the LINK public token with an API access token
export const exchangePublicToken = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  try {
    PUBLIC_TOKEN = req.body;
    const publicTokenResponse = await plaidClient.itemPublicTokenExchange(
      PUBLIC_TOKEN
    );
    prettyPrintResponse(publicTokenResponse);
    ACCESS_TOKEN = publicTokenResponse.data.access_token;
    ITEM_ID = publicTokenResponse.data.item_id;

    // Save or update to the database
    const [plaidAccount, created] = await PlaidAccount.findOrCreate({
      where: { userId },
      defaults: {
        accessToken: ACCESS_TOKEN,
        itemId: ITEM_ID,
        userId,
      },
    });
    // if there is already an access token just update the plaid account.
    if (!created) {
      await plaidAccount.update({ accessToken: ACCESS_TOKEN, itemId: ITEM_ID });
    }
    res.status(200).json({ message: "Access token has been saved" });
  } catch (error: any) {
    console.error("Error exchanging public token", error);
    res.status(500).json({ message: error.message });
  }
};
