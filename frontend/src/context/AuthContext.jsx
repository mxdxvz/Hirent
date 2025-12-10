import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing token on mount (restore session on refresh)
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
    
    // Mark as initialized to prevent redirect on refresh
    setIsInitialized(true);
  }, []);

  // Fetch counts when logged in
  useEffect(() => {
    if (isLoggedIn && token) {
      const fetchCounts = async () => {
        try {
          const [wishRes, collRes] = await Promise.all([
            fetch("http://localhost:5000/api/wishlist/count", {
              headers: { "Authorization": `Bearer ${token}` }
            }),
            fetch("http://localhost:5000/api/collection/count", {
              headers: { "Authorization": `Bearer ${token}` }
            })
          ]);

          const wishData = await wishRes.json();
          const collData = await collRes.json();

          setWishlistCount(wishData.count || 0);
          setCollectionCount(collData.count || 0);
        } catch (error) {
          console.error("Error fetching counts:", error);
        }
      };

      fetchCounts();
    }
  }, [isLoggedIn, token]);

  const updateWishlistCount = (count) => {
    setWishlistCount(count);
  };

  const updateCollectionCount = (count) => {
    setCollectionCount(count);
  };

  const login = (token, userData = null) => {
    localStorage.setItem("token", token);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setToken(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("fakeToken");
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setWishlistCount(0);
    setCollectionCount(0);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      login,
      logout,
      token,
      user,
      updateUser,
      wishlistCount,
      collectionCount,
      updateWishlistCount,
      updateCollectionCount,
      isInitialized
    }}>
      {children}
    </AuthContext.Provider>
  );
};

