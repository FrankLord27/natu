"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

/**
 * Interfaz que define las funciones y el estado disponibles para la lista de deseos (wishlist).
 */
interface WishlistContextType {
  wishlist: Product[]; // Arreglo de productos marcados como favoritos
  addToWishlist: (product: Product) => void; // Función para añadir un producto a favoritos
  removeFromWishlist: (productId: string) => void; // Función para quitar un producto de favoritos
  isInWishlist: (productId: string) => boolean; // Utilidad para verificar si un producto ya es favorito
  wishlistCount: number; // Cantidad total de productos en favoritos
}

// Creación del contexto inicial
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

/**
 * Proveedor del contexto de la lista de deseos.
 * Mantiene la persistencia de los favoritos del usuario utilizando localStorage con la clave 'naturajm_wishlist'.
 */
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Recupera los favoritos guardados al cargar la aplicación
  useEffect(() => {
    const saved = localStorage.getItem("naturajm_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        // Si hay un error al parsear, ignoramos y empezamos con lista vacía
      }
    }
  }, []);

  // Sincroniza el estado de la wishlist con localStorage cuando hay cambios
  useEffect(() => {
    localStorage.setItem("naturajm_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /**
   * Añade un producto a la lista de deseos si no está ya presente.
   *
   * @param product - El objeto del producto a añadir.
   */
  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      // Evitamos duplicados basándonos en el ID único del producto
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  /**
   * Elimina un producto de la lista de deseos.
   *
   * @param productId - El ID del producto a eliminar.
   */
  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  /**
   * Verifica si un producto específico se encuentra en la lista de favoritos.
   *
   * @param productId - ID del producto a comprobar.
   * @returns true si el producto está en la wishlist, false en caso contrario.
   */
  const isInWishlist = (productId: string) =>
    wishlist.some((p) => p.id === productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de la lista de deseos en los componentes.
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context)
    throw new Error("useWishlist debe ser usado dentro de un WishlistProvider");
  return context;
};
