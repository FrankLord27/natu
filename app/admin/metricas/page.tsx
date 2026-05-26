"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";

const MonthlyPerformanceChart = dynamic(
  () =>
    import("@/components/admin/MetricsCharts").then(
      (mod) => mod.MonthlyPerformanceChart,
    ),
  { ssr: false },
);
const CategoryShareChart = dynamic(
  () =>
    import("@/components/admin/MetricsCharts").then(
      (mod) => mod.CategoryShareChart,
    ),
  { ssr: false },
);
const ProfitMarginChart = dynamic(
  () =>
    import("@/components/admin/MetricsCharts").then(
      (mod) => mod.ProfitMarginChart,
    ),
  { ssr: false },
);
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  MetricsStatsSkeleton,
  SkeletonBlock,
} from "@/components/admin/SkeletonLoaders";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    font-size: 2.2rem;
    font-weight: 900;
    color: #1a1a1a;
    letter-spacing: -0.5px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 25px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #f0f0f0;

  .label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .value {
    font-size: 1.8rem;
    font-weight: 900;
    color: #1a1a1a;
  }
  .trend {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85rem;
    font-weight: 700;
  }
  .trend.up {
    color: #7bb32e;
  }
  .trend.down {
    color: #ff5252;
  }
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;

  h3 {
    font-size: 1.2rem;
    font-weight: 900;
    color: #1a1a1a;
    margin-bottom: 25px;
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #fff5f5;
  border-radius: 16px;
  border: 1px solid #ffebee;

  .icon {
    color: #ff5252;
  }
  .info {
    flex: 1;
    .name {
      font-weight: 800;
      color: #333;
      font-size: 0.95rem;
    }
    .stock {
      font-size: 0.8rem;
      color: #c62828;
      font-weight: 700;
    }
  }
`;

export default function AdvancedMetrics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      const json = await res.json();
      if (json.success) setData(json);
    } catch (err) {
      toast.error("Error al cargar analíticas");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Page>
        <Header>
          <h1>Análisis de Negocio</h1>
        </Header>
        <MetricsStatsSkeleton />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 25,
            marginBottom: 25,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 30,
              border: "1px solid #f0f0f0",
            }}
          >
            <SkeletonBlock $w="50%" $h={18} style={{ marginBottom: 25 }} />
            <SkeletonBlock $w="100%" $h={280} $radius={12} />
          </div>
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: 30,
              border: "1px solid #f0f0f0",
            }}
          >
            <SkeletonBlock $w="50%" $h={18} style={{ marginBottom: 25 }} />
            <SkeletonBlock $w="100%" $h={280} $radius={12} />
          </div>
        </div>
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: 30,
            border: "1px solid #f0f0f0",
          }}
        >
          <SkeletonBlock $w="40%" $h={18} style={{ marginBottom: 25 }} />
          <SkeletonBlock $w="100%" $h={220} $radius={12} />
        </div>
      </Page>
    );
  if (!data) return <div>Error al cargar datos.</div>;

  return (
    <Page>
      <Header>
        <h1>Análisis de Negocio</h1>
        <div style={{ color: "#666", fontWeight: 700 }}>
          Lead Agent Dashboard 💎
        </div>
      </Header>

      <StatsGrid>
        <StatCard whileHover={{ y: -5 }}>
          <div className="label">Ingresos Totales (6M)</div>
          <div className="value">
            ${data.overview.totalRevenue.toLocaleString()}
          </div>
          <div className="trend up">
            <ArrowUpRight size={14} /> 12% vs prev
          </div>
        </StatCard>
        <StatCard whileHover={{ y: -5 }}>
          <div className="label">Beneficio Neto (6M)</div>
          <div className="value">
            ${data.overview.totalProfit.toLocaleString()}
          </div>
          <div className="trend up">
            <ArrowUpRight size={14} /> 18% vs prev
          </div>
        </StatCard>
        <StatCard whileHover={{ y: -5 }}>
          <div className="label">Pedidos Procesados</div>
          <div className="value">{data.overview.totalOrders}</div>
          <div className="trend down">
            <ArrowDownRight size={14} /> 3% vs prev
          </div>
        </StatCard>
        <StatCard whileHover={{ y: -5 }}>
          <div className="label">Valor Promedio Pedido</div>
          <div className="value">
            $
            {(
              data.overview.totalRevenue / data.overview.totalOrders || 0
            ).toFixed(2)}
          </div>
          <div className="trend up">
            <ArrowUpRight size={14} /> 5% vs prev
          </div>
        </StatCard>
      </StatsGrid>

      <ChartGrid>
        <ChartCard>
          <h3>Rendimiento Mensual (Ingresos vs Costos)</h3>
          <div style={{ width: "100%", height: 350 }}>
            <MonthlyPerformanceChart data={data.chartData} />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>Cuota por Categoría</h3>
          <div style={{ width: "100%", height: 350 }}>
            <CategoryShareChart data={data.categoryDistribution} />
          </div>
        </ChartCard>
      </ChartGrid>

      <ChartCard>
        <h3>Análisis de Margen de Beneficio</h3>
        <div style={{ width: "100%", height: 300 }}>
          <ProfitMarginChart data={data.chartData} />
        </div>
      </ChartCard>

      <ChartGrid>
        <ChartCard>
          <h3>Alertas de Inventario Crítico</h3>
          <AlertList>
            {data.stockAlerts.length === 0 ? (
              <p style={{ color: "#999" }}>
                Todo el inventario está en niveles óptimos.
              </p>
            ) : (
              data.stockAlerts.map((alert: any) => (
                <AlertItem key={alert.id}>
                  <div className="icon">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="info">
                    <div className="name">{alert.name}</div>
                    <div className="stock">
                      Stock Actual: {alert.stock} (Mín: {alert.min})
                    </div>
                  </div>
                  <button
                    style={{
                      padding: "8px 15px",
                      border: "none",
                      background: "#1a1a1a",
                      color: "white",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.8rem",
                    }}
                  >
                    Reponer
                  </button>
                </AlertItem>
              ))
            )}
          </AlertList>
        </ChartCard>

        <ChartCard>
          <h3>Salud Operativa</h3>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: 20 }}>
            Visión general de la eficiencia del sistema.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                <span>Tasa de Conversión</span>
                <span>3.2%</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#f0f0f0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "64%",
                    background: "#7BB32E",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                <span>Nivel de Satisfacción</span>
                <span>94%</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#f0f0f0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "94%",
                    background: "#7BB32E",
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                <span>Tiempo de Respuesta</span>
                <span>2.4h</span>
              </div>
              <div
                style={{
                  height: 8,
                  background: "#f0f0f0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "82%",
                    background: "#7BB32E",
                  }}
                />
              </div>
            </div>
          </div>
        </ChartCard>
      </ChartGrid>
    </Page>
  );
}
