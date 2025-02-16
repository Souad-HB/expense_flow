// import Auth from "../utils/auth.js";




export const fetchLinkToken = async () => {
  try {
    const response = await fetch("/api/plaid/create-link-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Invalid API Response");
    }
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.log("error retrieving data", error);
    return;
  }
};
