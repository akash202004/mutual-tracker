import { Mail } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  //   const { login, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border-2 border-white/20 backdrop-blur-sm"></div>
            <div className="flex items-center space-x-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                MutualTracker
              </h1>
            </div>
          </div>
          <h2 className="text-xl text-gray-300 font-light">
            Sign in to your account
          </h2>
        </div>

        <div className="bg-black border-2 border-white/20 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
          <form className="space-y-6">
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-3"
              >
                Password
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-black border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 roundex-xl p-4 backdrop-blur-sm">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-white to-gray-500 hover:from-white/90 hover:to-gray-600 text-white py-4 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 border border-white shadow-lg hover:shadow-xl"
            ></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
