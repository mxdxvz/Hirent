import React, { createContext, useState, useEffect, useContext } from 'react';
import { ENDPOINTS, makeAPICall } from '../config/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    try {
      const data = await makeAPICall(ENDPOINTS.CART.GET);
      if (data && Array.isArray(data.items)) {
        setCart(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (item) => {
    try {
      await makeAPICall(ENDPOINTS.CART.ADD, {
        method: 'POST',
        body: JSON.stringify({ itemId: item._id, quantity: 1 }),
        headers: { 'Content-Type': 'application/json' },
      });
      fetchCart(); // Refetch cart to update state
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await makeAPICall(ENDPOINTS.CART.REMOVE(itemId), { method: 'DELETE' });
      fetchCart(); // Refetch cart
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
