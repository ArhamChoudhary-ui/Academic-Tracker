import React, { useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import {
  authenticate,
  setupPassword,
  isAuthenticated,
  getAuthMetadata,
} from "../utils/authManager";

/**
 * UnlockScreen Component
 * Displays password entry screen for authentication
 * Shown on app startup before data access is allowed
 */
export default function UnlockScreen({ onAuthenticated, onSetupComplete }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [passwordSet, setPasswordSet] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  React.useEffect(() => {
    // Check if this is first time setup
    const authMetadata = getAuthMetadata();
    setIsFirstTime(!authMetadata);
  }, []);

  // Calculate password strength
  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
    setError("");
  };

  const handleSetupPassword = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!password) {
        throw new Error("Please enter a password");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      await setupPassword(password);
      setPassword("");
      setConfirmPassword("");
      setPasswordSet(true);

      // Auto-authenticate after setup
      setTimeout(() => {
        handleAuthenticate(password);
      }, 500);
    } catch (err) {
      setError(err.message || "Error setting up password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticate = async (pwd = null) => {
    setError("");
    setIsLoading(true);

    try {
      const authPassword = pwd || password;
      if (!authPassword) {
        throw new Error("Please enter your password");
      }

      const result = await authenticate(authPassword);
      if (result.success) {
        setPassword("");
        setConfirmPassword("");
        onAuthenticated();
      }
    } catch (err) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFirstTime && !passwordSet) {
      handleSetupPassword(e);
    } else {
      handleAuthenticate();
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 4) return "Fair";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
              <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isFirstTime && !passwordSet ?
                "Secure Your Data"
              : "Unlock Your Data"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-center mt-2 text-sm">
              {isFirstTime && !passwordSet ?
                "Create a password to encrypt and protect your data"
              : "Enter your password to access your encrypted data"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isFirstTime && !passwordSet ? "Create Password" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  disabled={isLoading}
                >
                  {showPassword ?
                    <EyeOff className="w-5 h-5" />
                  : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength (only show on setup) */}
              {isFirstTime && !passwordSet && password && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getPasswordStrengthColor()} transition-all`}
                        style={{ width: `${(passwordStrength / 6) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    💡 Stronger passwords include uppercase, numbers, and
                    special characters
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password (only on setup) */}
            {isFirstTime && !passwordSet && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ?
                      <EyeOff className="w-5 h-5" />
                    : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Security Notes */}
            {isFirstTime && !passwordSet && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
                  Password Security Tips:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                  <li>✓ Use at least 12 characters for best security</li>
                  <li>✓ Mix uppercase, lowercase, numbers, and symbols</li>
                  <li>✓ Don't use personal information or common words</li>
                  <li>✓ Store it in a secure password manager</li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ?
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isFirstTime && !passwordSet ?
                    "Setting up..."
                  : "Authenticating..."}
                </>
              : <>
                  <Check className="w-5 h-5" />
                  {isFirstTime && !passwordSet ? "Create Password" : "Unlock"}
                </>
              }
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-6 leading-relaxed">
            🔒 Your data is encrypted with AES-256. Your password is never
            stored or transmitted.
          </p>
        </div>
      </div>
    </div>
  );
}
