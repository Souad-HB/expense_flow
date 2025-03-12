import Auth from "../utils/auth";

export const fetchTransactions = async () => {
  try {
    const response = await fetch("/api/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to retrieve transactions");
    }
    const data = await response.json();
    console.log(data);
    // only extract the transactions
    const transactionsData = data.Transaction;
    console.log("transaction data is: ",transactionsData);
    return transactionsData
  } catch (error) {
    console.log("Error retrieving transactions", error);
  }
};
