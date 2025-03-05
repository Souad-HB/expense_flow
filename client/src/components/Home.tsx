import React from "react";
import { useEffect, useState } from "react";
import { fetchAccountBalance } from "../api/plaidAPI";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export const Home = () => {
  // define the account interface
  interface Account {
    name: string;
    balances: {
      available: number;
      current: number;
    };
    subtype: string;
    type: string;
  }

  const [accounts, setAccounts] = useState<Account[]>([]);
  useEffect(() => {
    const getAccountBalance = async () => {
      try {
        const data = await fetchAccountBalance();
        console.log(data);

        setAccounts(data.accounts);
      } catch (error) {
        console.log("Could not fetch account balance");
      }
    };
    getAccountBalance();
  }, []);
  console.log("accounts on home are:", accounts);

  const Icon = ({ subtype }: { subtype: string }) => {
    if (subtype === "checking") {
      return <AccountBalanceIcon className="text-red-700 text-3xl" />;
    }
    if (subtype === "savings") {
      return <SavingsIcon className="text-red-700 text-3xl" />;
    }
    if (subtype === "credit card") {
      return <CreditCardIcon className="text-red-700 text-3xl" />;
    } else {
      return <MonetizationOnIcon className="text-red-700 text-3xl" />;
    }
  };
  return (
    <Box sx={{ flexGrow: 1 }} className="p-6">
      <h2 className="text-3xl mt-5 mb-10 font-extrabold tracking-wider text-gray-800">
        Overview
      </h2>

      {/* Grid layout for account display */}
      <div
        className={`grid grid-cols-1 md:grid-rows-${accounts.length} gap-y-10 gap-x-6 w-full max-w-3xl`}
      >
        {accounts.map((account, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-rose-50 hover:bg-rose-100 py-4 px-6 rounded-lg shadow-md"
          >
            {/* Icon for account type */}
            <Icon subtype={account.subtype} />

            {/* Account Name */}
            <span className="text-xl font-semibold text-gray-800 flex-1 ml-4">
              {account.name}
            </span>

            {/* Account Balance */}
            <span className="text-xl font-bold text-gray-800">
              ${account.balances.current.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </Box>
  );
};
