import { useNavigate } from "react-router-dom";
import { SignUpFormState } from "../interfaces/SignUpForm.js";
import { useState } from "react";
import { signup } from "../api/authAPI.js";
import { Button } from "@mui/material";

export const Signup = () => {
  // create a formData variable to keep track of the user's data being entered
  const [formData, setFormData] = useState<SignUpFormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full bg-gray-100 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 lg:w-[90%] lg:h-[90vh]">
        {/* Left Column - Image */}
        <div className="flex items-center justify-center">
          <img
            alt="landing img"
            src="../public/assets/ex8.png"
            className="w-full h-full object-cover rounded-l-2xl"
          />
        </div>
        {/* Right Column - Sign up Form */}
        <div className="flex flex-col items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-6">
              <label
                className="block text-zinc-800 text-xl font-bold mb-2"
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
                className="block text-zinc-800 text-xl font-bold mb-2"
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
                className="block text-zinc-800 text-xl font-bold mb-2"
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
                className="block text-zinc-800 text-xl font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                name="password"
                placeholder="**************"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button
                className="bg-blue-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline  w-full max-w-md"
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: 50,
                  backgroundColor: "#9a3c38",
                  borderColor: "#9a3c38",
                  color: "white",
                  fontSize: "17px",
                }}
              >
                Sign Up
              </Button>
            </div>
          </form>
          <div className="pt-2 flex flex-row justify-center">
            Already have an account?
            <button
              onClick={() => {
                navigate("/login");
              }}
              className="underline pl-1 cursor-pointer"
            >
              Log in
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs pt-4">
            &copy;2025 Souad Hassen-Bouzouita. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
