import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <nav className="bg-black border-b-2 border-white/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-bold text-white hover:text-blue-400 transition-colors duration-300 group"
              onClick={() => setMenuOpen(false)}
            >
              <img src="/logo.png" className="h-12 w-12 flex-shrink-0" />
              <span className="bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                MutualTracker
              </span>
            </Link>

            {/* Mobile Hamburger */}
            <div className="lg:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white focus:outline-none"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {user ? (
                <>
                  <Link
                    to="/saved"
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border-2 ${
                      isActive("/saved")
                        ? "bg-white/10 text-white border-white/30 shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Saved</span>
                  </Link>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 px-3 py-2 hover:bg-white/5 rounded-xl border border-white/10 hover:border-white/20"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/20 hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-white to-blue-400 hover:from-white/90 hover:to-blue-500 text-black font-bold px-6 py-2 rounded-xl text-sm transition-all duration-300 border border-white shadow-lg hover:shadow-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Dropdown */}
          {menuOpen && (
            <div className="lg:hidden pt-4 space-y-4 pb-4 border-t border-white/10">
              {user ? (
                <>
                  <Link
                    to="/saved"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    <Heart className="inline w-4 h-4 mr-2" />
                    Saved
                  </Link>
                  <div className="px-4 py-2 text-sm text-gray-300 flex items-center gap-2 bg-white/5 rounded-xl border border-white/10">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl border border-white/10 hover:border-white/20 mt-2"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-xl"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm bg-gradient-to-r from-white to-blue-400 hover:from-white/90 hover:to-blue-500 text-black font-bold rounded-xl"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
