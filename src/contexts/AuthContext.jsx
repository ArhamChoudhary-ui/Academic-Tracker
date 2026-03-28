import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("academic_tracker_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error loading user session:", error);
        localStorage.removeItem("academic_tracker_user");
      }
    }
    setIsLoading(false);
  }, []);

  const signup = async (email, password, name) => {
    // Mock signup - in production, this would call your backend API
    const users = JSON.parse(
      localStorage.getItem("academic_tracker_users") || "[]",
    );

    // Check if user already exists
    if (users.find((u) => u.email === email)) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      avatar: null,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: "dark",
        notifications: true,
      },
    };

    // Store password separately (in production, this would be hashed on backend)
    users.push({ ...newUser, password });
    localStorage.setItem("academic_tracker_users", JSON.stringify(users));

    // Set current user (without password)
    const userSession = { ...newUser };
    delete userSession.password;
    setUser(userSession);
    localStorage.setItem("academic_tracker_user", JSON.stringify(userSession));

    return userSession;
  };

  const login = async (email, password) => {
    // Mock login - in production, this would call your backend API
    const users = JSON.parse(
      localStorage.getItem("academic_tracker_users") || "[]",
    );
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    const userSession = { ...foundUser };
    delete userSession.password;
    setUser(userSession);
    localStorage.setItem("academic_tracker_user", JSON.stringify(userSession));

    return userSession;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("academic_tracker_user");
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("academic_tracker_user", JSON.stringify(updatedUser));

    // Update in users list
    const users = JSON.parse(
      localStorage.getItem("academic_tracker_users") || "[]",
    );
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem("academic_tracker_users", JSON.stringify(users));
    }
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: "guest",
      email: "guest@local",
      name: "Guest User",
      avatar: null,
      isGuest: true,
      preferences: {
        theme: "dark",
        notifications: false,
      },
    };
    setUser(guestUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: user?.isGuest || false,
        signup,
        login,
        logout,
        updateProfile,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
