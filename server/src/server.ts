import sequelize from "./config/connection.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import bodyParser from "body-parser";
dotenv.config();
import util from "util";
// const forceDatabaseRefresh = false;
// recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ------------------------Plaid initialization/configuration start --------------
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";

// intialize the plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});
const plaidClient = new PlaidApi(configuration);

export const prettyPrintResponse = (response: any) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};
// ------------------------Plaid initialization/configuration end --------------

// serve static files before routes and middleware
const buildPath = path.join(__dirname, "../..", "client", "dist");
app.use(express.static(buildPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// register the api routes
app.use(routes);

try {
  await sequelize.authenticate();
  
    console.log("🟢 Connected to the expenses_db");
    app.listen(PORT, () => {
      console.log(`🎉 Server is listening on port ${PORT}`);
    });
  // });
} catch (error) {
  console.error("🔴 Unable to connect to the database:", error);
}

export { plaidClient };
