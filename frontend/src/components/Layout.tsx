import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="bg-black border-b-2 border-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to="/"
              className="flex items-center space-x-3 text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-300 group"
            >
              <div>
                <img src="/logo.png" className="h-12 w-12"></img>
              </div>
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                MutualTracker
              </span>
            </Link>

            <div className="flex items-center space-x-8">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                      isActive("/")
                        ? "bg-white/10 text-white border-white/30 shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </Link>
                  <Link
                    to="/saved"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                      isActive("/saved")
                        ? "bg-white/10 text-white border-white/30 shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Saved</span>
                  </Link>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-300 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 px-3 py-2 hover:bg-white/5 rounded-xl border border-white/10 hover:border-white/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/20 hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-white to-blue-400 hover:from-white/90 hover:to-blue-500 text-black font-bold border-white px-6 py-2 rounded-xl text-sm transition-all duration-300 border shadow-lg hover:shadow-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
