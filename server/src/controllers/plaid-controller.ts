import { Request, Response } from "express";
import { plaidClient } from "../server.js";
import { Products, CountryCode } from "plaid";
import { prettyPrintResponse } from "../server.js";
import {
  PlaidAccount,
  Account,
  Transaction,
  RecurringTransactions,
} from "../models/index.js";
import { ITransaction } from "../interfaces/Transaction.js";

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
    res.status(404).json({ message: "user not found" });
  }
  const configs = {
    user: {
      client_user_id: userId,
    },
    client_name: "Expense Flow App",
    products: PLAID_PRODUCTS,
    transactions: {
      days_requested: 180,
    },
    country_codes: PLAID_COUNTRY_CODES,
    language: "en",
  };
  console.log(configs);
  try {
    // call plaid API to create link token
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    // print the response
    prettyPrintResponse(createTokenResponse);
    res.json(createTokenResponse.data.link_token);
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
    const publicTokenResponse =
      await plaidClient.itemPublicTokenExchange(PUBLIC_TOKEN);
    // prettyPrintResponse(publicTokenResponse);
    console.log(
      "public response data from exchange api is:",
      publicTokenResponse.data
    );
    ACCESS_TOKEN = publicTokenResponse.data.access_token;
    console.log(ACCESS_TOKEN);
    ITEM_ID = publicTokenResponse.data.item_id;

    // Save or update to the database
    const [plaidAccount, created] = await PlaidAccount.findOrCreate({
      where: { userId },
      defaults: {
        accessToken: ACCESS_TOKEN,
        itemId: ITEM_ID,
        transactionCursor: "",
        userId,
      },
    });
    // if there is already an access token just update the plaid account.
    if (!created) {
      await plaidAccount.update({ accessToken: ACCESS_TOKEN, itemId: ITEM_ID });
    }
    res.status(200).json({
      message: "Access token has been saved",
      data: publicTokenResponse.data,
    });
  } catch (error: any) {
    console.error("Error exchanging public token", error);
    res.status(500).json({ message: error.message });
  }
};

// get the account information and update the db
export const getAccountBalance = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    console.log("user not found, cannot generate account balance");
    res.status(404).json("User not found");
  }
  try {
    console.log(
      "user Id that is trying to log their account is number: ",
      userId
    );
    const accessToken = await PlaidAccount.findOne({
      where: {
        userId: userId,
      },
    });
    if (!accessToken) {
      res.status(404).json({ message: "Access token not found" });
      return;
    }
    const response = await plaidClient.accountsBalanceGet({
      access_token: accessToken.accessToken,
    });
    const plaidAccounts = response.data.accounts;
    console.log("plaidAccounts from the api response are: ", plaidAccounts);
    // iterate through each account
    for (const account of plaidAccounts) {
      //  either update existing data or insert new data into the table based on accountId
      const possibleAccount = await Account.findOne({
        where: {
          plaidAccountId: account.account_id,
        },
      });
      console.log("possible account is: ", possibleAccount);
      // if the account already exists just update the balance
      if (possibleAccount) {
        await Account.update(
          {
            balanceCurrent: account.balances.current,
            balanceAvailable: account.balances.available,
          },
          {
            where: {
              plaidAccountId: possibleAccount.id,
            },
          }
        );
      }
      // if the account doesn't exist then create it in the db
      else {
        await Account.create({
          plaidAccountId: account.account_id,
          accountName: account.name,
          balanceCurrent: account.balances.current,
          balanceAvailable: account.balances.available,
          type: account.type,
          subtype: account.subtype,
          userId: req.user?.id,
        });
      }
    }
    prettyPrintResponse(response);
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get bank logos to be rendered in the frontend on the onboarding page
export const getInstitutionsLogos = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const response = await plaidClient.institutionsGet({
      client_id: process.env.PLAID_CLIENT_ID || "",
      secret: process.env.PLAID_SECRET || "",
      count: 20,
      offset: 0,
      country_codes: [CountryCode.Us],
      options: { include_optional_metadata: true },
    });
    const institutions = response.data;
    if (institutions) {
      return res.status(200).json(institutions);
    } else {
      console.log("No institutions were retrieved");
    }
  } catch (error) {
    console.log("Logos cannot be retrieved from the server");
    res.status(500).json(error);
    return;
  }
};

export const hasAccessToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("checking if user has access token, testing API route");
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(404).json("User cannot be found");
    }
    const accessTokenAvailable = await PlaidAccount.findOne({
      where: {
        userId: userId,
      },
    });
    if (accessTokenAvailable) {
      console.log(
        "User has access token, they will be directed to the Home page"
      );
      res.status(200).json(true);
    } else {
      console.log(
        "User does not have access token, they will be directed to Onboarding"
      );
      res.status(200).json(false);
    }
  } catch (error: any) {
    res.status(500).json("Internal server error");
  }
};
// get transactions
export const getTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
  // debug the request
  console.log(`🔍 API Route Called: ${req.method} ${req.originalUrl}`);
  console.log("Request Body:", req.body);

  // new transaction updates since "cursor"
  let added: ITransaction[] | null = [];
  let modified: ITransaction[] | null = [];
  // removed transaction ids
  let removed: (string | ITransaction)[] | null = [];
  let hasMore = true;

  // iterate through each oage of new transaction updates for item

  const userId = req.user?.id;
  try {
    if (!userId) {
      return res
        .status(404)
        .json(
          "user not found, Item Id cannot be extracted therefore no cursor available"
        );
    }
    const dbRecord = await PlaidAccount.findOne({
      where: { userId: userId },
    });
    if (!dbRecord) {
      return res.status(404).json("No item Id available for that user");
    }
    // get the cursor data from the db, and while you're at it get the access token too. we need both to be passed to the API request

    const access_token: string | undefined = dbRecord?.accessToken;
    let cursor: string | null = dbRecord?.transactionCursor;
    // check if the access token doesnt exist
    if (!access_token) {
      return res.status(404).json("Access token not found");
    }

    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: access_token,
        cursor: cursor,
      });
      const data = response.data;
      console.log("data from the transactionresponse is: ", data);

      // append new transactions
      added = [
        ...(added || []),
        ...(Array.isArray(data.added) ? data.added : []),
      ];
      modified = [...(modified || []), ...(data.modified || [])];
      removed = [
        ...(removed || []),
        ...data.removed.map((t) => t.transaction_id),
      ];

      // Update cursor to the next cursor
      cursor = data.next_cursor;
      hasMore = data.has_more;
    }
    // update the cursor in the database
    await PlaidAccount.update(
      { transactionCursor: cursor },
      {
        where: { userId: userId },
      }
    );
    // create all the new transactions in the database
    for (const transaction of added) {
      // first get the accountId
      const accountDBRecord = await Account.findOne({
        where: { plaidAccountId: transaction.account_id },
      });
      if (!accountDBRecord) {
        console.log("Account not found for transaction", transaction);
        continue;
      }
      const account = accountDBRecord?.id;
      // create the transaction in the database
      await Transaction.create({
        amount: transaction.amount,
        transactionDate: transaction.date,
        userId: userId,
        accountId: account,
        category: transaction.personal_finance_category?.primary,
        categoryIcon: transaction.personal_finance_category_icon_url,
        merchant: transaction.merchant_name,
      });
    }
    return res.status(200).json({
      added,
      modified,
      removed,
    });
  } catch (error) {
    console.log("Error getting transactions", error);
    return res.status(500).json({ message: "Failed to get transactions" });
  }
};

// get recurring transactions from plaid
export const getRecurringTransactions = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  try {
    const dbRecord = await PlaidAccount.findOne({
      where: { userId: userId },
    });
    const access_token = dbRecord?.accessToken;
    if (!access_token || typeof access_token != "string") {
      res
        .status(400)
        .json({ message: "access token cant be retrieved from the database" });
      return;
    }
    // at this point, I could also retrieve the accountIds, but it's optional, and if an accountId doesnt exist if will throw an error.
    // I prefer having plaid retrieve all active accounts on the found item
    const configs = {
      access_token: access_token as string,
    };
    const response = await plaidClient.transactionsRecurringGet(configs);
    let inflowStreams = response.data.inflow_streams;
    let outflowStreams = response.data.outflow_streams;
    let updatedDateTime = response.data.updated_datetime;
    let requestId = response.data.request_id;
    if (response.data) {
    }
    // store the data in the database model RecuuringTransactions
    const allStreams = [...inflowStreams, ...outflowStreams]; // combining the individual inflowStreams and outflowStreams arrays into a single new array. REMEMBER! spread operator creates a copy of the array, This avoid modifying the original

    for (const stream of allStreams) {
      await RecurringTransactions.upsert({
        userId: userId,
        streamId: stream.stream_id,
        accountId: stream.account_id,
        merchantName: stream.merchant_name || null,
        description: stream.description,
        // ?? is a nullish coelescing operator, it's a default when the amount on the right ends up being null or undefind
        amount: stream.last_amount.amount ?? 0, // Last transaction amount
        averageAmount: stream.average_amount.amount ?? 0,
        frequency: stream.frequency,
        firstDate: stream.first_date,
        lastDate: stream.last_date,
        predictedNextDate: stream.predicted_next_date,
        status: stream.status,
        transactionId: stream.transaction_ids,
        // the array.some method tests whether at least one element in the array passes the test implementation provided by the function
        type: inflowStreams.some((s) => s.stream_id === stream.stream_id)
          ? "inflow"
          : "outflow",
        isActive: stream.is_active,
      });
    }
    // response status
    res.status(200).json({
      message:
        "Recurring transactions retrieved successfully and stored in the database",
      inflowStreams,
      outflowStreams,
      updatedDateTime,
      requestId,
    });
    return;
  } catch (error) {
    console.log(
      "error retrieving the recurring transactions from the API or storing data in the database",
      error
    );
    res.status(500).json({
      message:
        "error retrieving recurring transactions from the plaid API or storing data in the database",
      error,
    });
    return;
  }
};



