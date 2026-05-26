"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  Eye,
  MessageSquare,
  Mail,
  Star,
  FileText,
} from "lucide-react";

const Page = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #999;
  margin: 0 0 30px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 25px;
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 30px 25px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 18px;
`;

const StatIcon = styled.div<{ $bg: string }>`
  width: 55px;
  height: 55px;
  border-radius: 14px;
  background: ${(p) => p.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  h3 {
    font-size: 1.8rem;
    font-weight: 900;
    color: #333;
    margin: 0;
  }
  p {
    font-size: 0.8rem;
    font-weight: 600;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: inherit;
  gap: 25px;
  margin-bottom: 25px;
`;

const ChartRow = styled(Row)`
  grid-template-columns: 2fr 1fr;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const OrderRow = styled(Row)`
  grid-template-columns: 1.5fr 1fr;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #333;
    margin-bottom: 20px;
  }
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  &:last-child {
    border-bottom: none;
  }
  .name {
    font-weight: 600;
    font-size: 0.9rem;
  }
  .value {
    font-weight: 700;
    color: ${(p) => p.theme.colors.primary};
  }
`;

import dynamic from "next/dynamic";

const DashboardChart = dynamic(
  () => import("@/components/admin/DashboardChart"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: 200,
          background: "#f9f9f9",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Cargando gráfico...
      </div>
    ),
  },
);

import { InvoiceView } from "@/components/admin/InvoiceView";

const ChartCard = styled(Card)`
  height: auto;
  margin: 0;
  display: flex;
  flex-direction: column;

  h3 {
    margin-bottom: 20px;
  }

  > div {
    flex: 1;
    min-height: 300px;
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(p) => {
    switch (p.$status) {
      case "PAID":
        return "#e8f5e9";
      case "DELIVERED":
        return "#e3f2fd";
      case "SHIPPED":
        return "#f3e5f5";
      case "CANCELLED":
        return "#ffebee";
      default:
        return "#fff3e0";
    }
  }};
  color: ${(p) => {
    switch (p.$status) {
      case "PAID":
        return "#2e7d32";
      case "DELIVERED":
        return "#1565c0";
      case "SHIPPED":
        return "#6a1b9a";
      case "CANCELLED":
        return "#c62828";
      default:
        return "#e67e22";
    }
  }};
`;

interface DashboardStats {
  products: number;
  users: number;
  orders: number;
  views: number;
  messages: number;
  subscribers: number;
  testimonials: number;
  invoicesCount: number;
  revenue: number;
  cost: number;
  profit: number;
  chartData: Array<{ date: string; total: number }>;
  monthlyReport: Array<{
    month: string;
    revenue: number;
    cost: number;
    profit: number;
  }>;
  topProducts: Array<{ name: string; sales: number }>;
  recentOrders: Array<{
    id: string;
    customer: string;
    total: number;
    status: string;
    date: string;
    hasInvoice: boolean;
  }>;
  recentAccounting: Array<{
    id: string;
    type: string;
    category: string;
    amount: number;
    description: string;
    date: string;
  }>;
}

export default function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    users: 0,
    orders: 0,
    views: 0,
    messages: 0,
    subscribers: 0,
    testimonials: 0,
    invoicesCount: 0,
    revenue: 0,
    cost: 0,
    profit: 0,
    chartData: [],
    monthlyReport: [],
    topProducts: [],
    recentOrders: [],
    recentAccounting: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        toast.error("Error al cargar estadísticas");
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Ingresos",
      value: `$${stats.revenue.toFixed(2)}`,
      icon: <TrendingUp size={24} color="white" />,
      bg: "linear-gradient(135deg, #FFB800, #F39C12)",
    },
    {
      label: "Utilidad Meta",
      value: `$${stats.profit.toFixed(2)}`,
      icon: <TrendingUp size={24} color="white" />,
      bg: "linear-gradient(135deg, #7BB32E, #5D8522)",
    },
    {
      label: "Facturas",
      value: stats.invoicesCount,
      icon: <FileText size={24} color="white" />,
      bg: "linear-gradient(135deg, #2196F3, #1565C0)",
    },
    {
      label: "Pedidos",
      value: stats.orders,
      icon: <ShoppingBag size={24} color="white" />,
      bg: "linear-gradient(135deg, #8E44AD, #7D3C98)",
    },
  ];

  return (
    <Page>
      <Title>
        Dashboard de Administración{" "}
        <span
          style={{
            fontSize: "0.8rem",
            verticalAlign: "middle",
            color: "#7BB32E",
            marginLeft: 10,
            background: "rgba(123,179,46,0.1)",
            padding: "4px 12px",
            borderRadius: 20,
          }}
        >
          Elite Business 1.0
        </span>
      </Title>
      <Subtitle>Resumen general del negocio</Subtitle>

      <StatsGrid>
        {statCards.map((s, i) => (
          <StatCard
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <StatIcon $bg={s.bg}>{s.icon}</StatIcon>
            <StatInfo>
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      {/* FILA 2: Gráfico + Engagement & Top Productos */}
      <ChartRow>
        <ChartCard>
          <h3 style={{ margin: 0, marginBottom: 20 }}>Tendencia de Ventas</h3>
          <div>
            <DashboardChart data={stats.chartData} />
          </div>
        </ChartCard>

        <Column>
          <Card>
            <h3>Engagement & Sitio</h3>
            <ListItem>
              <span className="name">
                <Eye size={14} style={{ marginRight: 8, color: "#2196F3" }} />
                Páginas Vistas
              </span>
              <span className="value" style={{ color: "#333" }}>
                {stats.views}
              </span>
            </ListItem>
            <ListItem>
              <span className="name">
                <Mail size={14} style={{ marginRight: 8, color: "#8E44AD" }} />
                Suscriptores
              </span>
              <span className="value" style={{ color: "#333" }}>
                {stats.subscribers}
              </span>
            </ListItem>
            <ListItem>
              <span className="name">
                <Star size={14} style={{ marginRight: 8, color: "#FFB800" }} />
                Testimonios
              </span>
              <span className="value" style={{ color: "#333" }}>
                {stats.testimonials}
              </span>
            </ListItem>
          </Card>

          <Card>
            <h3>Top Productos Vendidos</h3>
            {stats.topProducts.length > 0 ? (
              stats.topProducts.map((p) => (
                <ListItem key={p.name}>
                  <span className="name" style={{ fontSize: "0.85rem" }}>
                    {p.name}
                  </span>
                  <span className="value">{p.sales}</span>
                </ListItem>
              ))
            ) : (
              <p
                style={{
                  color: "#999",
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                Sin datos aún
              </p>
            )}
          </Card>
        </Column>
      </ChartRow>

      {/* FILA 3: Pedidos Recientes + Historial Contable */}
      <OrderRow>
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <h3 style={{ margin: 0 }}>Pedidos Recientes</h3>
            <a
              href="/admin/pedidos"
              style={{
                fontSize: "0.8rem",
                color: "#7BB32E",
                fontWeight: 700,
              }}
            >
              Ver todos
            </a>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    borderBottom: "2px solid #f5f5f5",
                    color: "#888",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "12px 8px" }}>Pedido</th>
                  <th style={{ padding: "12px 8px" }}>Cliente</th>
                  <th style={{ padding: "12px 8px" }}>Total</th>
                  <th style={{ padding: "12px 8px" }}>Estado</th>
                  <th style={{ padding: "12px 8px" }}>DOC</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        padding: 30,
                        textAlign: "center",
                        color: "#BBB",
                      }}
                    >
                      No hay pedidos registrados
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      style={{ borderBottom: "1px solid #f9f9f9" }}
                    >
                      <td style={{ padding: "14px 8px", fontWeight: 800 }}>
                        #{o.id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: "14px 8px" }}>{o.customer}</td>
                      <td
                        style={{
                          padding: "14px 8px",
                          fontWeight: 800,
                          color: "#7BB32E",
                        }}
                      >
                        ${o.total.toFixed(2)}
                      </td>
                      <td style={{ padding: "14px 8px" }}>
                        <StatusBadge $status={o.status}>{o.status}</StatusBadge>
                      </td>
                      <td style={{ padding: "14px 8px" }}>
                        {o.hasInvoice ? (
                          <span
                            title="Ver Factura"
                            onClick={() => setSelectedOrder(o)}
                            style={{ cursor: "pointer" }}
                          >
                            <FileText size={16} color="#7BB32E" />
                          </span>
                        ) : (
                          <div
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              border: "1px dashed #DDD",
                            }}
                            title="Sin Factura"
                          />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 style={{ margin: 0, marginBottom: 20 }}>
            Historial Contable (Income/Expense)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.recentAccounting.map((entry) => (
              <ListItem
                key={entry.id}
                style={{
                  border: "1px solid #F0F0F0",
                  padding: "12px 15px",
                  borderRadius: 10,
                }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background:
                        entry.type === "INCOME" ? "#7BB32E" : "#FF5252",
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>
                      {entry.description}
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "#999" }}>
                      {entry.category} •{" "}
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  style={{
                    fontWeight: 800,
                    color: entry.type === "INCOME" ? "#7BB32E" : "#FF5252",
                  }}
                >
                  {entry.type === "INCOME" ? "+" : "-"}$
                  {entry.amount.toFixed(2)}
                </span>
              </ListItem>
            ))}
          </div>
        </Card>
      </OrderRow>

      {selectedOrder && (
        <InvoiceView
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Page>
  );
}
