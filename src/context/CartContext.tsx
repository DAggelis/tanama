"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';

const CartContext = createContext<any>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const isInitialMount = useRef(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Φόρτωση από LocalStorage κατά το Mount
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const parsedCart = JSON.parse(saved);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Αποθήκευση στο LocalStorage (Μόνο αφού φορτωθούν τα παλιά δεδομένα)
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
      // Ελέγχουμε αν υπάρχει ήδη με βάση το ID ΚΑΙ τον τίτλο (variants)
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

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + (Number(item.price || 0) * item.quantity), 0);
  }, [cart]);

  /**
   * ΒΕΛΤΙΩΜΕΝΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΒΑΡΟΥΣ
   * Μετατρέπει τα κιλά σε γραμμάρια αν το rawWeight είναι μικρό νούμερο (π.χ. 0.5kg -> 500g)
   */
  const totalWeight = useMemo(() => {
    return cart.reduce((acc, item) => {
      // Προσπάθεια λήψης βάρους από πολλαπλές πηγές (variant ή main weight)
      const rawWeight = Number(item.variantWeight) || Number(item.weight) || 0;
      
      // Αν το βάρος είναι κάτω από 50, θεωρούμε ότι είναι ΚΙΛΑ και μετατρέπουμε σε γραμμάρια
      // Αν είναι πάνω από 50, θεωρούμε ότι είναι ήδη ΓΡΑΜΜΑΡΙΑ.
      const weightInGrams = (rawWeight > 0 && rawWeight < 50) ? rawWeight * 1000 : rawWeight;
      
      return acc + (weightInGrams * item.quantity);
    }, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      totalPrice,
      totalWeight,
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