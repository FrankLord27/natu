"use client";

import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X, ClipboardList, Calendar, Receipt } from "lucide-react";
import { useOrders } from "@/context/OrderContext";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2500;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  width: min(500px, 90vw);
  max-height: 80vh;
  background: white;
  border-radius: 24px;
  z-index: 2600;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  h2 {
    font-size: 1.3rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
`;

const OrderList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderCard = styled.div`
  background: #fcfcfc;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #666;
  .id {
    font-weight: 700;
    color: #333;
  }
`;

const OrderItems = styled.div`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 10px;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px dashed #eee;
  .total {
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.1rem;
  }
  .status {
    font-size: 0.75rem;
    font-weight: 700;
    background: #e8f5e9;
    color: #2e7d32;
    padding: 4px 8px;
    border-radius: 50px;
    text-transform: uppercase;
  }
`;

const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  p {
    font-weight: 600;
    font-size: 1rem;
    color: #999;
  }
`;

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderHistoryModal = ({
  isOpen,
  onClose,
}: OrderHistoryModalProps) => {
  const { orders } = useOrders();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Modal
            initial={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
          >
            <Header>
              <h2>
                <ClipboardList size={22} /> Mis Pedidos
              </h2>
              <button onClick={onClose}>
                <X size={24} color="#888" />
              </button>
            </Header>
            <OrderList>
              {orders.length === 0 ? (
                <EmptyState>
                  <Receipt size={60} strokeWidth={1} />
                  <p>Aún no has realizado pedidos</p>
                </EmptyState>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id}>
                    <OrderInfo>
                      <span className="id">{order.id}</span>
                      <span>
                        <Calendar size={12} style={{ marginRight: 4 }} />{" "}
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </OrderInfo>
                    <OrderItems>
                      {order.items.map((item) => (
                        <div key={item.id}>
                          {item.quantity}x {item.name}
                        </div>
                      ))}
                    </OrderItems>
                    <OrderFooter>
                      <span className="status">
                        {order.paymentMethod === "whatsapp"
                          ? "Enviado vía WhatsApp"
                          : order.status}
                      </span>
                      <span className="total">
                        ${(order.totalPrice || order.total).toFixed(2)}
                      </span>
                    </OrderFooter>
                  </OrderCard>
                ))
              )}
            </OrderList>
          </Modal>
        </>
      )}
    </AnimatePresence>
  );
};
