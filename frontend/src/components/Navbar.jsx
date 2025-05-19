import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, Zap } from "lucide-react";

const Navbar = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };
  console.log("USER:", user);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-5  mx-auto">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          {/* icon */}
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-sky-500 to-indigo-400 shadow-lg group-hover:shadow-sky-300/50 group-hover:scale-105 transition-all duration-300">
            <Zap className="w-6 h-6 text-white" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-white rounded-full shadow-md animate-ping" />
          </div>

          {/* text logo */}
          <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-400 bg-clip-text text-transparent tracking-wide">
            TaskFlow
          </span>
        </div>
        {/* right */}
        <div className="flex items-center gap-4 ml-2">
          <button
            className="p-2 text-gray-600 hover:text-sky-500 transition-colors duration-300 hover:bg-sky-50 rounded-full"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* user dropdown */}
          <div ref={menuref} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-sky-50 transition-colors duration-300 border border-transparent hover:border-sky-200"
            >
              <div className="relative">
                {user && user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-cyan-600 text-white font-semibold shadow-md"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-sky-600 text-white font-semibold shadow-md">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs font-normal text-gray-500">
                  {user?.email}
                </p>
              </div>{" "}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {menuOpen && (
              <ul className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-sky-100 z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-sky-50 text-sm text-gray-700 transition-colors flex items-center gap-2 group"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-gray-700" />
                    Profile Setting
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
