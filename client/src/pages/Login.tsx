import { useState } from "react";
import { LoginFormData } from "../interfaces/LoginForm.js";
import { login } from "../api/authAPI.js";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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
        {/* Right Column - Login Form */}
        <div className="flex flex-col items-center justify-center p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-zinc-800 text-xl font-bold mb-2"
              >
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-zinc-800 text-xl font-bold mb-2"
              >
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="**************"
                value={formData.password}
                onChange={handleChange}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
              {error && <p className="text-red-500 text-sm italic">{error}</p>}
            </div>

            <div className="flex items-center justify-center">
              <Button
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
                Sign in
              </Button>
            </div>
          </form>
          <div className="pt-4 flex items-center justify-center text-sm">
            <span className="text-gray-700">New to Expense Flow?</span>
            <Button
              onClick={() => navigate("/signup")}
              className="underline pl-1 cursor-pointer"
              sx={{ color: "#9a3c38" }}
            >
              Sign Up
            </Button>
          </div>
          <p className="text-center text-gray-500 text-xs pt-4">
            &copy;2025 Souad Hassen-Bouzouita. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};
