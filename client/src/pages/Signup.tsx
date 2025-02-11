import { Form, useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);

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
      setError("Failed to sign up, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <label>
          Enter your full legal name:
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Enter your Email Address:
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Enter your Password:
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p>{error}</p>}
        <button type="submit">{loading ? "Submitting" : "Signup"}</button>
      </Form>
    </div>
  );
};
