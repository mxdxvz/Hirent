import React, { createContext, useState, useEffect } from "react";
import { ENDPOINTS, makeAPICall } from "../config/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem("user") : null;

  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  const [token, setToken] = useState(storedToken);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchWishlistAndCart = async () => {
    if (isLoggedIn) {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          makeAPICall(ENDPOINTS.WISHLIST.GET),
          makeAPICall(ENDPOINTS.CART.GET),
        ]);

        const newWishlist = wishlistRes?.success && Array.isArray(wishlistRes.wishlist) 
          ? wishlistRes.wishlist.filter(Boolean) 
          : [];
        setWishlist(newWishlist);

        const newCart = cartRes?.items && Array.isArray(cartRes.items) 
          ? cartRes.items.filter(Boolean) 
          : [];
        setCart(newCart);

      } catch (error) {
        console.error("Error fetching user data:", error);
        // Don't logout on a simple fetch failure, just clear the data
        setWishlist([]);
        setCart([]);
      }
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchWishlistAndCart();
      setIsInitialized(true);
    };
    initializeAuth();
  }, [isLoggedIn]);

  const toggleWishlist = async (item) => {
    if (!isLoggedIn) {
      console.log("User not logged in. Aborting wishlist toggle.");
      return;
    }
    if (!item || !item._id) {
      console.error("toggleWishlist called with invalid item:", item);
      return;
    }

    const itemId = item._id;
    const previousWishlist = [...wishlist];

    // Optimistic UI Update
    const isInWishlist = previousWishlist.some((w) => w && w._id === itemId);
    const newOptimisticWishlist = isInWishlist
      ? previousWishlist.filter((w) => w && w._id !== itemId)
      : [...previousWishlist, item]; // Add the full item object
    
    setWishlist(newOptimisticWishlist);

    try {
      let response;
      if (isInWishlist) {
        response = await makeAPICall(ENDPOINTS.WISHLIST.REMOVE(itemId), { method: "DELETE" });
      } else {
        response = await makeAPICall(ENDPOINTS.WISHLIST.ADD, {
          method: "POST",
          body: JSON.stringify({ itemId }),
          headers: { "Content-Type": "application/json" },
        });
      }

      // Sync with the server's response as the source of truth
      if (response?.success && Array.isArray(response.wishlist)) {
        setWishlist(response.wishlist.filter(Boolean));
      } else {
        throw new Error("Invalid response from server during wishlist toggle.");
      }
    } catch (error) {
      console.error("Failed to toggle wishlist, reverting UI:", error);
      setWishlist(previousWishlist); // Rollback on error
      // Revert to the previous state on any failure
      setWishlist(previousWishlist);
    }
  };

  const addToCart = async (item, quantity) => {
    if (!isLoggedIn) return;
    try {
      await makeAPICall(ENDPOINTS.CART.ADD, {
        method: "POST",
        body: JSON.stringify({ itemId: item._id, quantity }),
        headers: { "Content-Type": "application/json" },
      });
      await fetchWishlistAndCart(); // Refetch to get populated data
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isLoggedIn) return;
    try {
      await makeAPICall(ENDPOINTS.CART.REMOVE(itemId), { method: "DELETE" });
      await fetchWishlistAndCart(); // Refetch to get populated data
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
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
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
    setWishlist([]);
    setCart([]);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        token,
        user,
        updateUser,
        wishlist,
        cart,
        toggleWishlist,
        addToCart,
        removeFromCart,
        fetchWishlistAndCart,
        wishlistCount: wishlist.length,
        collectionCount: cart.length,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

