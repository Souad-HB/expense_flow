import { useEffect } from "react"
import { fetchTransactions } from "../api/transactionAPI";

export const Spending = () => {

  useEffect(() => {
    const transactions = fetchTransactions();
    console.log(transactions);
  }
  , []);
  return (
    <div>Spending</div>
  )
}