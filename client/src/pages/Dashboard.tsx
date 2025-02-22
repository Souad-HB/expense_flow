import {
  PlaidLinkError,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
  PlaidLinkStableEvent,
  usePlaidLink,
} from "react-plaid-link";
import { exchangePublicForAccessToken, fetchLinkToken } from "../api/plaidAPI";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  // create a state variable token to store the fetched token
  const [token, setToken] = useState<string | null>(null);
  // fetch the token when the component mounts
  useEffect(() => {
    const getLinkToken = async () => {
      const fetchedLinkToken = await fetchLinkToken();
      setToken(fetchedLinkToken);
    };
    getLinkToken();
  }, []);

  const config: PlaidLinkOptions = {
    // onSuccess callback is called when a user successfully links an items. it takes two args: the public_token and metadata object
    onSuccess: (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      exchangePublicForAccessToken(public_token);
      console.log("metadata from onSuccess: ", metadata);
    },

    // onExit is called when a user exits without successfully linking an item or an error occurs during link initialization
    onExit: (
      error: PlaidLinkError | null,
      metadata: PlaidLinkOnExitMetadata
    ) => {
      if (error != null && error.error_code === "INVALID_LINK_TOKEN") {
        fetchLinkToken();
      }
      console.log("metadata from onExit: ", metadata);
    },

    // The onEvent callback is called at certain points in the Link flow.
    onEvent: (eventName: PlaidLinkStableEvent | string, metadata: PlaidLinkOnEventMetadata) => {
      console.log("event from onEvent", eventName);
      console.log("metadata from onEvent: ", metadata);
    },

    token: token,
  };

  const { open, exit, ready } = usePlaidLink(config);
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      // open Link on click
      onClick={() => open()}
      disabled={!ready}

    >
      Connect a bank account
    </button>
  );
};
