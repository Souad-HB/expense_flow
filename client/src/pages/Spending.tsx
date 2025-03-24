import { useEffect } from "react";
import { fetchTransactions } from "../api/transactionAPI";
import Sidebar from "../components/Sidebar";
import { Activities } from "../components/Activities";

export const Spending = () => {
  useEffect(() => {
    const transactions = fetchTransactions();
    console.log(transactions);
  }, []);
  return (
    <>
      <Sidebar pageContent= {<Activities />} />
    </>
  );
};
