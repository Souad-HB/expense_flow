import React from "react";
import { useEffect, useState } from "react";
import { fetchAccountBalance } from "../api/plaidAPI";
import Box from "@mui/material/Box";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { fetchTransactions } from "../api/transactionAPI";
import { Account } from "../interfaces/Account";
import { Transaction } from "../interfaces/Transaction";
// imports for mui table for the transactions
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const Home = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    // fetch account data
    const getAccountBalance = async () => {
      try {
        const data = await fetchAccountBalance();
        console.log(data);

        setAccounts(data.accounts);
      } catch (error) {
        console.log("Could not fetch account balance");
      }
    };
    // retrieve transactions to be displayed on the home page. we can limit this to the last 10 transactions
    const getTransactions = async () => {
      const transactionsArray = await fetchTransactions();
      setTransactions(transactionsArray);
    };
    getTransactions();

    getAccountBalance();
  }, []);
  
  console.log("accounts on home are:", accounts);
  console.log("transactions on home are:", transactions);

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
  // style the table cell
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#aa2e25",
      color: theme.palette.common.white,
      fontWeight: "bold",
      fontSize: 17,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));
  // style the table row, odd/even:
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));
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
            className="flex items-center justify-between  py-4 px-6 rounded-lg shadow-md"
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

      {/* Activity layout to display latest transactions */}
      <h2 className="text-3xl mt-15 mb-10 font-extrabold tracking-wider text-gray-800">
        Activity
      </h2>
      <div>
        {/* transactions table:  */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Transaction Date</StyledTableCell>
                <StyledTableCell align="left">Merchant</StyledTableCell>
                <StyledTableCell align="left">Amount&nbsp;($)</StyledTableCell>
                <StyledTableCell align="left">Category</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <StyledTableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {transaction.transactionDate}
                  </StyledTableCell>
                  {/* if the merchant is null then just show NA */}
                  {transaction.merchant ? (
                    <StyledTableCell align="left">
                      {transaction.merchant}
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="left">N/A</StyledTableCell>
                  )}
                  <StyledTableCell align="left">
                    {transaction.amount}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <div className="flex items-center">
                      <img
                        src={transaction.categoryIcon}
                        alt="Category icon"
                        className="w-10 mr-2"
                      />
                      {transaction.category}
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};
