"use client";

import React from "react";
import styled from "styled-components";
import {
  Download,
  FileText,
  Printer,
  Mail,
  CheckCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const PdfDownloadButton = dynamic(() => import("./PdfDownloadButton"), {
  ssr: false,
  loading: () => (
    <Button $primary disabled>
      Preparando...
    </Button>
  ),
});

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const InvoiceCard = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 20px;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f5f5f5;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #eee;
    transform: rotate(90deg);
  }
`;

const Header = styled.div`
  padding: 40px;
  border-bottom: 2px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  .brand {
    h2 {
      font-size: 1.8rem;
      font-weight: 900;
      color: #7bb32e;
      margin: 0;
    }
    p {
      font-size: 0.85rem;
      color: #999;
      margin: 5px 0 0;
    }
  }
  .info {
    text-align: right;
    h3 {
      font-size: 1.2rem;
      font-weight: 800;
      color: #333;
      margin: 0;
    }
    p {
      font-size: 0.8rem;
      color: #666;
      margin: 5px 0 0;
    }
  }
`;

const Content = styled.div`
  padding: 40px;
  .section {
    margin-bottom: 30px;
  }
  .label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #999;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th {
    text-align: left;
    padding: 12px 10px;
    border-bottom: 2px solid #f5f5f5;
    font-size: 0.8rem;
    color: #999;
    text-transform: uppercase;
  }
  td {
    padding: 15px 10px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 0.95rem;
  }
  .total-row {
    background: #fafafa;
    font-weight: 800;
  }
`;

const Actions = styled.div`
  padding: 25px 40px;
  background: #fafafa;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  background: ${(p) => (p.$primary ? p.theme.colors.primary : "white")};
  color: ${(p) => (p.$primary ? "white" : "#666")};
  border: ${(p) => (p.$primary ? "none" : "1px solid #ddd")};
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface InvoiceProps {
  order: any;
  onClose: () => void;
}

export const InvoiceView: React.FC<InvoiceProps> = ({ order, onClose }) => {
  if (!order) return null;

  const normalizedOrder = {
    ...order,
    customerName:
      order.customerName ||
      order.customer ||
      order.user?.name ||
      "Cliente Particular",
    customerEmail: order.customerEmail || order.user?.email || "N/A",
    customerPhone: order.customerPhone || "N/A",
    items: order.items || [],
  };

  const invoiceNumber = `INV-${order.id.slice(-6).toUpperCase()}-${new Date().getFullYear()}`;

  return (
    <Overlay onClick={onClose}>
      <InvoiceCard
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
      >
        <CloseBtn onClick={onClose}>
          <X size={20} />
        </CloseBtn>

        <Header>
          <div className="brand">
            <h2>
              Natura<span>JM</span>
            </h2>
            <p>Salud Natural y Bienestar</p>
            <p style={{ fontSize: "0.75rem" }}>RNC: 131-12345-1</p>
          </div>
          <div className="info">
            <h3>Factura Elite Business</h3>
            <p>#{invoiceNumber}</p>
            <p>{new Date().toLocaleDateString()}</p>
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 5,
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#7BB32E",
                  background: "rgba(123,179,46,0.1)",
                  padding: "4px 12px",
                  borderRadius: 6,
                }}
              >
                <CheckCircle size={10} style={{ marginRight: 4 }} /> PAGADA
              </span>
            </div>
          </div>
        </Header>

        <Content>
          <div className="grid">
            <div className="section">
              <div className="label">Cliente</div>
              <div style={{ fontWeight: 800, fontSize: "1.2rem" }}>
                {normalizedOrder.customerName}
              </div>
              <div style={{ color: "#666", marginTop: 5 }}>
                {normalizedOrder.customerEmail}
              </div>
              <div style={{ color: "#666" }}>
                {normalizedOrder.customerPhone}
              </div>
            </div>
            <div className="section" style={{ textAlign: "right" }}>
              <div className="label">Método de Pago</div>
              <div style={{ fontWeight: 700 }}>
                {order.paymentMethod || "WhatsApp"}
              </div>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio</th>
                <th style={{ textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {normalizedOrder.items.map((item: any, i: number) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>
                    {item.product?.name || item.name || "Producto NaturaJM"}
                  </td>
                  <td>{item.quantity}</td>
                  <td>${(item.price || 0).toFixed(2)}</td>
                  <td style={{ textAlign: "right" }}>
                    ${((item.price || 0) * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td
                  colSpan={3}
                  style={{ textAlign: "right", padding: "20px 10px" }}
                >
                  SUBTOTAL
                </td>
                <td style={{ textAlign: "right" }}>
                  ${(order.total / 1.18).toFixed(2)}
                </td>
              </tr>
              <tr className="total-row">
                <td colSpan={3} style={{ textAlign: "right" }}>
                  ITBIS (0%)
                </td>
                <td style={{ textAlign: "right" }}>$0.00</td>
              </tr>
              <tr
                className="total-row"
                style={{ fontSize: "1.2rem", color: "#7BB32E" }}
              >
                <td
                  colSpan={3}
                  style={{ textAlign: "right", borderTop: "2px solid #7BB32E" }}
                >
                  TOTAL RD$
                </td>
                <td
                  style={{ textAlign: "right", borderTop: "2px solid #7BB32E" }}
                >
                  ${order.total.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </Table>
        </Content>

        <Actions>
          <Button onClick={onClose}>Cerrar</Button>
          <Button>
            <Printer size={16} /> Imprimir
          </Button>

          <PdfDownloadButton
            order={normalizedOrder}
            invoiceNumber={invoiceNumber}
          />
        </Actions>
      </InvoiceCard>
    </Overlay>
  );
};
