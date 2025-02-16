import { LoginFormData } from "../interfaces/LoginForm.js";
import { SignUpFormState } from "../interfaces/SignUpForm.js";

const signup = async (newUser: SignUpFormState) => {
  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error Signing Up");
    }

    return data;
  } catch (error: any) {
    console.log("Error signing up", error);
    return Promise.reject("Could not Sign up");
  }
};

const login = async (user: LoginFormData) => {
  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    if (!response) {
      throw new Error("Error logging in.");
    }
    return data;
  } catch (error) {
    console.error("Error logging in", error);
    return Promise.reject("Could not Sign up");
  }
};
export { signup, login };
