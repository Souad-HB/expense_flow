import { useState } from "react";
import { LoginFormData } from "../interfaces/LoginForm.js";
import { login } from "../api/authAPI.js";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user: LoginFormData = {
        email: formData.email,
        password: formData.password,
      };
      await login(user);
      console.log("User logged in successfully");
      navigate("/onboard");
    } catch (error) {
      console.error("Login failed", error);
      setError("Error logging in, please try again.");
    }
  };

  return (
    <div
      className="relative min-h-screen bg-top bg-cover overflow-hidden top"
      style={{ backgroundImage: "url('/assets/expenseflowimg1.png')" }}
    >
      <div className="max-w-full w-md m-auto flex flex-col shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-5 bg-gray-100">
        <div className="w-full text-center text-2xl font-bold pb-10">
          Expense Flow
        </div>
        <form onSubmit={handleSubmit}>
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
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="pt-2 flex flex-row justify-center text-sm">
          New to Expense Flow?
          <button
            onClick={() => {
              navigate("/signup");
            }}
            className="underline pl-1 cursor-pointer"
          >
            Sign up
          </button>
        </div>
        <p className="text-center text-gray-500 text-xs pt-4">
          &copy;2025 Souad Hassen-Bouzouita. All rights reserved.
        </p>
      </div>
    </div>
  );
};
