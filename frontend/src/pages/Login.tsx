import { Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/LoadingSpinner";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      showToast("error", "Please enter your email address");
      return;
    }

    if (!password.trim()) {
      showToast("error", "Please enter your password");
      return;
    }

    if (password.length < 6) {
      showToast("error", "Password must be at least 6 characters long");
      return;
    }

    try {
      await login(email, password);
      showToast("success", "Login successful! Welcome back!");
      navigate("/");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";

      // Show specific toast messages based on error
      if (errorMessage.includes("Invalid credentials")) {
        showToast("error", "Invalid email or password. Please try again.");
      } else if (errorMessage.includes("User not found")) {
        showToast("error", "No account found with this email address.");
      } else if (
        errorMessage.includes("network") ||
        errorMessage.includes("fetch")
      ) {
        showToast(
          "error",
          "Network error. Please check your connection and try again."
        );
      } else {
        showToast("error", errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div>
              <img src="/logo.png" className="h-12 w-12" alt="Logo" />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                MutualTracker
              </h1>
            </div>
          </div>
          <h2 className="text-xl text-gray-300 font-light">
            Sign in to your account
          </h2>
        </div>

        <div className="bg-black border-2 border-white/20 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-3"
              >
                Email address
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-3"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-white to-blue-400 hover:from-white/90 hover:to-blue-500 text-black font-bold py-4 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 border border-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size="sm" /> : <span>Sign In</span>}
            </button>

            <div className="mt-8 text-center">
              <div className="border border-white/10 bg-white/5 rounded-xl p-2">
                <p className="text-gray-400 text-sm font-medium">
                  Demo credentials: demo@example.com / password
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-300 font-bold hover:text-blue-400 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
