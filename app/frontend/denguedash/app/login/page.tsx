"use client";
import { useState } from "react";
import { Icon } from "@iconify/react";
import authService from "@services/auth.service";
import { BaseLoginReponse, UserLoggedIn } from "@interfaces/auth/user_auth";
import GuestHeader from "@components/GuestHeader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loginUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response: BaseLoginReponse | UserLoggedIn = await authService.login(
        email,
        password
      );
      if (response.success == true) {
        console.log(response);
      } else {
        setErrorMessage(response.message);
      }
      console.log(response);
      const res = await authService.getUserData();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <GuestHeader />
      <div className="mt-10 flex items-center justify-center">
        <div className="p-8 border border-gray-200 rounded-lg w-full max-w-md">
          <div className="text-center">
            <div className="text-3xl font-semibold text-black">
              Welcome back!
            </div>
          </div>

          <form onSubmit={loginUser} className="mt-6 space-y-7">
            <div>
              <label className="block text-black text-sm mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-black text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Enter your password"
                />
                <button
                  title="showPassword"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-gray-400"
                >
                  {showPassword ? (
                    <Icon icon="mdi:eye" />
                  ) : (
                    <Icon icon="mdi:eye-off" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox text-green-400 rounded focus:ring-green-400"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-green-400 hover:underline">
                Forgot password?
              </a>
            </div>

            {errorMessage && (
              <div className="bg-red-500 text-white py-4 rounded-md">
                <div className="flex flex-row ml-2 items-center">
                  <Icon icon="ph:info-fill" className="text-3xl mr-3" />
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
