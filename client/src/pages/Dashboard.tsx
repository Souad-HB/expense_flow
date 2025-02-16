import { usePlaidLink } from "react-plaid-link";
import { fetchLinkToken } from "../api/plaidAPI";

export const Dashboard = () => {
  const { open, ready } = usePlaidLink({
    token: fetchLinkToken(),
    onSuccess: (publicToken, metadata) => {
      // send public token to server
    },
  });
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={() => open()}
      disabled={!ready}
    >
      Connect a bank account
    </button>
  );
};
