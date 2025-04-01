// Removed unused React import
import { useEffect, useState } from "react";
import { fetchAccountBalance } from "../api/plaidAPI";
import Box from "@mui/material/Box";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Account } from "../interfaces/Account";
// imports for mui table for the transactions
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { fetchCategories } from "../api/categoryAPI";
import { Category } from "../interfaces/Category";
import { DateRangePickerComponent } from "./DateRangePickerComponent";

export const Home = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: new Date().getMonth().toString(),
    endDate: new Date().toDateString(),
  });

  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate: startDate, endDate: endDate });
  };
  const fetchFilteredData = async (dateRange: {
    startDate: string;
    endDate: string;
  }) => {
    // retrieve an overview of the categories to be displayed on the home page per month
    try {
      const data = await fetchCategories({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      setCategories(data || []);
    } catch (error) {
      console.log("Error fetching filtered transactions per category", error);
    }
  };
  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) fetchFilteredData(dateRange);
  }, [dateRange]);

  useEffect(() => {
    // fetch account data
    const getAccountBalance = async () => {
      try {
        const data = await fetchAccountBalance();
        if (data && data.accounts) {
          setAccounts(data.accounts);
        } else {
          console.error("No accounts data received");
        }
      } catch (error) {
        console.log("Could not fetch account balance");
      }
    };

    getAccountBalance();
  }, []);

  console.log("accounts on home are:", accounts);
  console.log("transactions on home are:", categories);

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
              {account.accountName}
            </span>

            {/* Account Balance */}
            <span className="text-xl font-bold text-gray-800">
              ${account.balanceCurrent.toFixed(2) || "0.00"}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-row ">
        {/* Activity layout to display latest transactions per category */}
        <h2 className="text-3xl mt-15 mb-10 font-extrabold tracking-wider text-gray-800 ">
          Activity
        </h2>
        {/*datetime picker */}
        <div className="content-center mt-6 pl-4">
          <DateRangePickerComponent onDateChange={handleDateChange} />
        </div>
      </div>
      <div>
        {/* transactions table:  */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">Category</StyledTableCell>
                <StyledTableCell align="left">Amount&nbsp;($)</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {categories.map((category, index) => (
                <StyledTableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell align="left">
                    {category.totalAmount.toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <div className="flex items-center">
                      <img
                        src={category.categoryIcon}
                        alt="Category icon"
                        className="w-10 mr-2"
                      />
                      {category.category}
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>{" "}
    </Box>
  );
};
