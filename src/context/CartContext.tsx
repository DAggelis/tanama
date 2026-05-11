"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';

const CartContext = createContext<any>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const isInitialMount = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        if (Array.isArray(parsedCart)) setCart(parsedCart);
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item._id === product._id && item.title === product.title);
      if (existing) {
        return prev.map(item =>
          item._id === product._id && item.title === product.title
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (id: string, title: string) => {
    setCart(prev => prev.filter(item => !(item._id === id && item.title === title)));
  };

  const updateQuantity = (id: string, title: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item._id === id && item.title === title) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  // 1. Καθαρή αξία προϊόντων (Subtotal)
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + (Number(item.price || 0) * item.quantity), 0);
  }, [cart]);

  // 2. Συνολικό βάρος (Weight) - Χωρίς αυθαίρετους πολλαπλασιασμούς
  const totalWeight = useMemo(() => {
    return cart.reduce((acc, item) => {
      const weightInGrams = Number(item.variantWeight) || Number(item.weight) || 0;
      return acc + (weightInGrams * item.quantity);
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      subtotal,      // Το στέλνουμε στο Header/Navbar
      totalWeight,   // Το στέλνουμε στο Checkout
      isLoaded 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within a CartProvider');
  return context;
};