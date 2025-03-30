import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:5001/user/signup", newUser, {
            headers: { "Content-Type": "application/json"}
        })
        alert(response.data.message)
        navigate("/");
    } catch (error) {
        alert(error.response.data.message)
    }
  };
  return (
    <div className="w-screen h-screen bg-gray-950 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl flex flex-col gap-6 w-80 border border-gray-700/50"
      >
        <h2 className="text-white text-3xl font-bold text-center tracking-wide">
          Welcome Back
        </h2>

        <input
          type="text"
          name="fullName"
          onChange={handleChange}
          className="text-lg outline-none py-3 px-4 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-300"
          placeholder="Bhanu Sharma"
          required
        />

        <input
          type="email"
          name="email"
          onChange={handleChange}
          className="text-lg outline-none py-3 px-4 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-300"
          placeholder="bhanu@gmail.com"
          required
        />

        <input
          type="password"
          name="password"
          onChange={handleChange}
          className="text-lg outline-none py-3 px-4 rounded-lg bg-gray-900/80 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition duration-300"
          placeholder="••••••"
          required
        />

        <button
          onChange={handleChange}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold text-lg shadow-md hover:shadow-xl transition duration-300"
        >
          SignUp
        </button>

        <p className="text-gray-400 text-center text-sm">
          Don't have an account?{" "}
          <Link to={"/login"} className="text-blue-400 cursor-pointer hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
