"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

/**
 * Interfaz que representa una orden (pedido) realizada por el usuario.
 */
export interface Order {
  id: string; // ID autogenerado para el pedido local
  items: CartItem[]; // Productos incluidos en el pedido
  total: number; // Cantidad total de items
  totalPrice: number; // Monto total pagado
  date: string; // Fecha de creación en formato ISO
  status: "sent" | "pending" | "paid"; // Estado del pedido
  paymentMethod?: string; // Método de pago utilizado (WhatsApp, PayPal, Stripe)
  paymentId?: string; // ID de transacción si aplica (especialmente para PayPal/Stripe)
}

/**
 * Interfaz para el contexto de órdenes.
 */
interface OrderContextType {
  orders: Order[]; // Lista de pedidos históricos
  addOrder: (order: Omit<Order, "id" | "date">) => void; // Función para registrar un nuevo pedido
  clearOrders: () => void; // Función para borrar el historial de pedidos
}

// Creación del contexto inicial
const OrderContext = createContext<OrderContextType | undefined>(undefined);

/**
 * Proveedor del contexto de órdenes. Gestiona el historial de pedidos del usuario localmente.
 * Persiste los datos en localStorage bajo la clave 'naturajm_orders'.
 */
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Sincronización inicial con localStorage al montar el componente
  useEffect(() => {
    const saved = localStorage.getItem("naturajm_orders");
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Error al parsear el historial de pedidos:", e);
      }
    }
  }, []);

  // Persistencia automática en localStorage cuando cambian las órdenes
  useEffect(() => {
    localStorage.setItem("naturajm_orders", JSON.stringify(orders));
  }, [orders]);

  /**
   * Registra una nueva orden en el historial local.
   * Genera automáticamente un ID único y la fecha actual.
   *
   * @param orderData - Los datos básicos del pedido (items, total, precio, etc.)
   */
  const addOrder = (orderData: Omit<Order, "id" | "date">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
    };
    // Añadimos el nuevo pedido al principio de la lista
    setOrders((prev) => [newOrder, ...prev]);
  };

  /**
   * Elimina todo el historial de pedidos local.
   */
  const clearOrders = () => setOrders([]);

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

/**
 * Hook para usar el contexto de órdenes en componentes.
 */
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrders debe utilizarse dentro de un OrderProvider");
  return context;
};
