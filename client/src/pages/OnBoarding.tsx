import {
  PlaidLinkError,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
  PlaidLinkStableEvent,
  usePlaidLink,
} from "react-plaid-link";
import {
  exchangePublicForAccessToken,
  fetchLinkToken,
  fetchLogos,
} from "../api/plaidAPI";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

export const OnBoarding = () => {
  // create a state variable token to store the fetched token
  const [token, setToken] = useState<string | null>(null);
  const [logos, setLogos] = useState<Array<string> | undefined>([]);
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
    onEvent: (
      eventName: PlaidLinkStableEvent | string,
      metadata: PlaidLinkOnEventMetadata
    ) => {
      console.log("event from onEvent", eventName);
      console.log("metadata from onEvent: ", metadata);
    },

    token: token,
  };

  const { open, ready } = usePlaidLink(config);

  // get the logos
  useEffect(() => {
    const fetchedLogos = async () => {
      const data = await fetchLogos();
      console.log(data);

      const institutionsArr = data.institutions;
      console.log(institutionsArr);
      const logosArr = [];
      const formattedLogosArr = [];
      let filteredFormattedLogosArr;
      for (let i = 0; i < institutionsArr.length; i++) {
        const array = institutionsArr[i];
        console.log(array);

        logosArr.push(array.logo);
        for (let j = 0; j < institutionsArr.length; j++) {
          const formattedLogo = `data:image/png;base64,${logosArr[j]}`;
          formattedLogosArr.push(formattedLogo);
        }
      }
      filteredFormattedLogosArr = formattedLogosArr.filter((element) => {
        return (
          element !== "data:image/png;base64,undefined" &&
          element !== "data:image/png;base64,null"
        );
      });
      console.log("logos array is", filteredFormattedLogosArr);

      setLogos(filteredFormattedLogosArr);
    };
    fetchedLogos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      {/* Headline */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
        Link Your Bank Account
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
        Connect your bank securely to automatically track your expenses and gain
        insights into your spending habits.
      </p>
      {/* Bank logos carousel / grid */}
      <div className="flex justify-center gap-4 mb-8">
        {logos?.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Bank ${index}`}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      {/* Link Account Button */}
      <Button
        variant="contained"
        sx={{
          borderRadius: 50,
          backgroundColor: "#9a3c38",
          borderColor: "#9a3c38",
          color: "white",
          fontSize: "17px",
        }}
        // open PLAID Link on click
        onClick={() => open()}
        disabled={!ready}
      >
        Link your accounts
      </Button>
    </div>
  );
};
