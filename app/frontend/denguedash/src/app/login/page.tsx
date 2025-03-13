"use client";
import { useContext, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { UserLoggedIn } from "@interfaces/auth/user-auth.interface";
import GuestHeader from "@components/guest/GuestHeader";
import authService from "@services/auth.service";
import { UserContext } from "@/contexts/UserContext";
import { MyUserInterface } from "@/interfaces/account/user-interface";

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // useContext takes time to update, so we need to use useEffect to check if the user is saved to context
    if (user?.role === "Admin") {
      router.push("/user/admin/accounts/manage");
    } else if (user?.role === "Encoder") {
      router.push("/user/encoder/analytics/dashboard");
    }
  }, [user, router]);

  const loginUser = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const loginResponse: UserLoggedIn = await authService.login(
        email,
        password
      );
      if (loginResponse.success) {
        const userDetails: MyUserInterface = loginResponse.user_data;

        setUser(userDetails);
        console.log(user);
      } else {
        setErrorMessage(loginResponse.message);
      }
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
                className="w-full px-4 py-2 border border-gray rounded-md text-black placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-green-400"
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
                  className="w-full px-4 py-2 border border-gray rounded-md text-black placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-green-400"
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
