import Auth from "../utils/auth";

export const fetchCategories = async (dateRange: {
  startDate: string;
  endDate: string;
}) => {
  try {
    const url = `/api/categories/categories-per-date?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
    console.log(
      "start date for the api call is",
      dateRange.startDate,
      "and end date for the api call is: ",
      dateRange.endDate
    );
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${Auth.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Invalid API response, check network tab!");
    }
    const allCategories = await response.json();
    if (!allCategories.length) {
      console.log("No transactions found within the given date range");
    }
    console.log("all categories from db are: ", allCategories);
    return allCategories;
  } catch (error) {
    console.log("Error fetching categories", error);
    return [];
  }
};
