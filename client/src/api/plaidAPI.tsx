import Auth from "../utils/auth.js";

// FETCH LINK TOKEN GENRATED FROM THE BACKEND
export const fetchLinkToken = async () => {
  try {
    const response = await fetch("/api/plaid/create-link-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Invalid API Response");
    }
    const data = await response.json();
    console.log("data from fetchLinkToken", data);
    return data;
  } catch (error) {
    console.log("error retrieving data", error);
    return;
  }
};

// call the backend to exchange the public token generated on the client side by an access token
export const exchangePublicForAccessToken = async (public_token: string) => {
  try {
    const response = await fetch("/api/plaid/exchange-public-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
      body: JSON.stringify({
        public_token,
      }),
    });
    if (!response.ok) {
      throw new Error("Invalid API response");
    }
    const data = await response.json();
    console.log("Public token has been exchanged for an access token");
    return data;
  } catch (error) {
    console.log("error retrieving data", error);
    return;
  }
};

// get account balance
export const fetchAccountBalance = async () => {
  try {
    const response = await fetch("api/plaid/accounts/balance/get", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Could not fetch accounts from the server");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error retrieving data", error);
    return;
  }
};
