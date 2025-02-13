import { useNavigate } from "react-router-dom";
import { SignUpFormState } from "../interfaces/SignUpForm.js";
import { useState } from "react";
import { signup } from "../api/authAPI.js";

export const Signup = () => {
  // create a formData variable to keep track of the user's data being entered
  const [formData, setFormData] = useState<SignUpFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  // create a handleChange that will keep track of the data passed into the input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // get the name and value of the input being used from the event target.
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // create a handleSignup that will submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    // assign the entered data to a new user
    const newUser: SignUpFormState = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };
    // send the data to the database through the api
    try {
      await signup(newUser);
      console.log("User signed up successfully");
      navigate("/login");
    } catch (error: any) {
      console.error("Signup failed", error);
      setError(
        error.response?.data?.message || "Failed to sign up, please try again."
      );
    }
  };

  return (
    <div className="max-w-full w-md m-auto flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-5 bg-zinc-50">
      <div className="w-full text-center text-2xl font-bold pb-10">
        Expense Flow
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            name="firstName"
            type="text"
            placeholder="FirstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-black-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            placeholder="**************"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p className="text-red-500 text-xs italic">{error}.</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign Up
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs pt-2">
        &copy;2025 Souad Hassen-Bouzouita. All rights reserved.
      </p>
    </div>

    // <div className="w-full max-w-xs">
    //   <form onSubmit={handleSubmit}>
    //     <label htmlFor="Name">
    //       Enter your full legal name:
    //       <input
    //         id="Name"
    //         type="text"
    //         name="firstName"
    //         placeholder="First Name"
    //         value={formData.firstName}
    //         onChange={handleChange}
    //         required
    //       />
    //       <input
    //         id="Name"
    //         type="text"
    //         name="lastName"
    //         placeholder="Last Name"
    //         value={formData.lastName}
    //         onChange={handleChange}
    //         required
    //       />
    //     </label>
    //     <label htmlFor="email">
    //       Enter your Email Address:
    //       <input
    //         id="email"
    //         type="email"
    //         name="email"
    //         placeholder="Email Address"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //       />
    //     </label>
    //     <label htmlFor="password">
    //       Enter your Password:
    //       <input
    //         id="password"
    //         type="password"
    //         name="password"
    //         placeholder="Password"
    //         value={formData.password}
    //         onChange={handleChange}
    //         required
    //       />
    //     </label>
    //     {error && <p>{error}</p>}
    //     <button className="btn" type="submit">
    //       {loading ? "Submitting" : "Signup"}
    //     </button>
    //   </form>
    // </div>
  );
};
