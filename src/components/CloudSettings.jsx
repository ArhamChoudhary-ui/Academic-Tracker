import React, { useState } from "react";
import { Mail, Lock, LogOut, Cloud, Check } from "lucide-react";
import { useCloudSync } from "../contexts/CloudSyncContext";

export default function CloudSettings({ onClose, subjectsData }) {
  const { user, isAuthenticated, login, logout, isSyncing, lastSyncFormatted } =
    useCloudSync();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("email");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password, provider);
    if (result.success) {
      setMessage("✅ Login successful!");
      setEmail("");
      setPassword("");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("❌ Login failed");
    }
  };

  const handleLogout = () => {
    logout();
    setMessage("Logged out");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Cloud size={20} className="text-blue-300" />
        <h3 className="text-lg font-semibold text-white">Cloud Sync</h3>
      </div>

      {isAuthenticated ?
        <div className="space-y-3">
          <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
            <p className="text-sm text-white">
              <Check size={16} className="inline mr-2" />
              Logged in as: <strong>{user?.email}</strong>
            </p>
          </div>

          <div className="text-sm text-white/70">
            Last sync: <strong>{lastSyncFormatted}</strong>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-white rounded-lg flex items-center gap-2 justify-center transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      : <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="block text-sm text-white/70 mb-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
            >
              <option value="email" className="bg-blue-900">
                Email
              </option>
              <option value="google" className="bg-blue-900">
                Google
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSyncing}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-all"
          >
            {isSyncing ? "Logging in..." : "Login"}
          </button>
        </form>
      }

      {message && (
        <div className="text-sm text-center text-white/70">{message}</div>
      )}
    </div>
  );
}
