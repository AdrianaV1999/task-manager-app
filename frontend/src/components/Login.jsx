import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BUTTON_CLASSES, INPUTWRAPPER } from "../assets/dummy";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const INITIAL_FORM = { email: "", password: "" };

const FIELDS = [
  {
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    icon: Mail,
  },
  {
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    icon: Lock,
    isPassword: true,
  },
];

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });
            toast.success("Session restored. Redirecting...");
            navigate("/");
          } else {
            localStorage.clear();
          }
        } catch (err) {
          localStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    console.log("Remember me checked:", rememberMe);

    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login');
      return;
    }

    setLoading(true);
    try {
      console.log("Sending login request...");
      const { data } = await axios.post(`${url}/api/user/login`, formData);
      console.log("Response data:", data);

      if (!data.token) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);

      onSubmit?.({
        token: data.token,
        userId: data.user.id,
        ...data.user,
      });

      toast.success("Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-sky-100 rounded-xl p-8">
      <div>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar
        />
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-300 via-sky-500 to-indigo-400 rounded-full mx-auto flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-white mr-2" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">
            Sign in to continue to TaskFlow
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {FIELDS.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
            <div key={name} className={INPUTWRAPPER}>
              <Icon className="text-sky-500 w-5 h-5 mr-2" />
              <input
                type={isPassword && showPassword ? "text" : type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) =>
                  setFormData({ ...formData, [name]: e.target.value })
                }
                className="w-full focus:outline-none text-sm text-gray-700"
                required
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-gray-500 hover:text-sky-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          ))}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-sky-500 focus:ring-sky-400 border-gray-300 rounded"
              required
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember Me
            </label>
          </div>
          <button type="submit" className={BUTTON_CLASSES} disabled={loading}>
            {loading ? (
              "Logging in..."
            ) : (
              <>
                <LogIn className="w-4 h-4 inline-block mr-1" />
                Login
              </>
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-sky-600 hover:text-sky-700 hover:underline font-medium transition-colors"
            onClick={handleSwitchMode}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
