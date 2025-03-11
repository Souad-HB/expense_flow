import { useEffect } from "react"
import { fetchTransactions } from "../api/transactionAPI";
import Sidebar from "../components/Sidebar";

export const Spending = () => {


  useEffect(() => {
    const transactions = fetchTransactions();
    console.log(transactions);
  }
  , []);
  return (
    <>
      {" "}
      <Sidebar />
      <div>Spending</div>
    </>
  );
}