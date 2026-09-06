import React, { useState } from "react";
import { User, Mail, Camera, Save, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage({ onClose, theme, onThemeChange }) {
  const { user, updateProfile, logout, isGuest } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [saveState, setSaveState] = useState("idle");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, avatar });
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 1500);
  };

  const handleLogout = () => {
    if (
      window.confirm(
        "Are you sure you want to log out? Your marks data will remain saved.",
      )
    ) {
      logout();
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gradient-to-br from-blue-700 to-blue-800 border border-white/20 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Profile</h2>
            <p className="text-white/60 text-sm">
              {isGuest ? "Guest Mode" : "Manage your account"}
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center overflow-hidden">
                {avatar ?
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                : <User size={48} className="text-white/40" />}
              </div>
              {!isGuest && (
                <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 p-2 rounded-full cursor-pointer transition-all shadow-lg group-hover:scale-110">
                  <Camera size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Profile Info */}
          {!isGuest && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60">
                  <Mail size={20} />
                  <span>{user?.email}</span>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`w-full py-3 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                  saveState === "saved" ?
                    "bg-gradient-to-r from-emerald-500 to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                <Save size={20} />
                {saveState === "saved" ? "Saved!" : "Save Changes"}
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Appearance
            </h3>
            <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center gap-3">
                {theme === "dark" ?
                  <Moon size={20} className="text-white/70" />
                : <Sun size={20} className="text-white/70" />}
                <span className="text-white">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </span>
              </div>
              <button
                onClick={onThemeChange}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  theme === "dark" ? "bg-blue-500" : "bg-white/30"
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Guest Info */}
          {isGuest && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-sm text-yellow-200 text-center">
                You're using Guest Mode. Sign up to sync your data across
                devices and unlock more features!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="border-t border-white/10 pt-6 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-200 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              {isGuest ? "Exit Guest Mode" : "Log Out"}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white/80 font-medium rounded-lg transition-all"
            >
              Close
            </button>
          </div>

          <p className="text-center text-white/40 text-xs">
            Member since{" "}
            {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
