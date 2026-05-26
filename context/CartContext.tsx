"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

/**
 * Interfaz que define el estado y las funciones disponibles en el contexto del carrito.
 */
interface CartContextType {
  cart: CartItem[]; // Lista de productos en el carrito
  addToCart: (item: Omit<CartItem, "quantity">) => void; // Añadir un producto al carrito
  removeFromCart: (id: string) => void; // Eliminar un producto por su ID
  updateQuantity: (id: string, quantity: number) => void; // Cambiar la cantidad de un producto
  clearCart: () => void; // Vaciar el carrito completamente
  totalItems: number; // Cantidad total de productos (suma de cantidades)
  totalPrice: number; // Precio total de todos los productos en el carrito
  isCartOpen: boolean; // Estado de visibilidad del Drawer del carrito
  setIsCartOpen: (open: boolean) => void; // Función para abrir/cerrar el carrito
  toggleCart: () => void; // Alternar la visibilidad del carrito
}

// Creación del contexto inicial
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Proveedor del contexto del carrito. Envuelve la aplicación para dar acceso global al estado del carrito.
 * Utiliza localStorage para persistir los datos entre sesiones.
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  /**
   * Alterna el estado de visibilidad del carrito (Drawer).
   */
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("naturajm_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error al parsear el carrito guardado:", e);
      }
    }
  }, []);

  // Guardar el carrito en localStorage cada vez que el estado cambia
  useEffect(() => {
    localStorage.setItem("naturajm_cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * Añade un producto al carrito. Si el producto ya existe, incrementa su cantidad.
   *
   * @param product - El producto a añadir (sin la propiedad 'quantity').
   */
  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        // Si ya está, mapeamos y sumamos 1 a la cantidad del producto coincidente
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      // Si es nuevo, lo añadimos con cantidad inicial de 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /**
   * Elimina un producto del carrito basándose en su ID.
   *
   * @param id - ID único del producto a eliminar.
   */
  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  /**
   * Actualiza la cantidad de un producto específico.
   *
   * @param id - ID del producto.
   * @param quantity - Nueva cantidad (debe ser al menos 1).
   */
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  /**
   * Limpia todos los elementos del carrito.
   */
  const clearCart = () => setCart([]);

  // Cálculos derivados del estado del carrito
  const totalItems = cart.reduce((sum: number, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum: number, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook personalizado para acceder fácilmente a las funciones y estado del carrito.
 * Debe usarse dentro de un CartProvider.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  return context;
};
