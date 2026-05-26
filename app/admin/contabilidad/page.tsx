"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import dynamic from "next/dynamic";

const RevenueTrendChart = dynamic(
  () =>
    import("@/components/admin/AccountingCharts").then(
      (mod) => mod.RevenueTrendChart,
    ),
  { ssr: false },
);
const ProfitByMonthChart = dynamic(
  () =>
    import("@/components/admin/AccountingCharts").then(
      (mod) => mod.ProfitByMonthChart,
    ),
  { ssr: false },
);
import { getFinancialSummary } from "@/lib/actions";
import Link from "next/link";

const Page = styled.div`
  padding-bottom: 50px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;

  h1 {
    font-size: 2.2rem;
    font-weight: 950;
    color: #1a1a1a;
    letter-spacing: -1px;
  }
  p {
    color: #666;
    font-weight: 600;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const MetricCard = styled(motion.div)<{
  $type?: "income" | "expense" | "profit";
}>`
  background: white;
  padding: 30px;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  position: relative;
  overflow: hidden;

  .label {
    font-size: 0.85rem;
    font-weight: 800;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .value {
    font-size: 2.2rem;
    font-weight: 900;
    color: #1a1a1a;
    margin-bottom: 10px;
  }

  .trend {
    font-size: 0.9rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${(p) => {
      if (p.$type === "income") return "#4caf50";
      if (p.$type === "expense") return "#f44336";
      return "#2196f3";
    }};
  }
`;

const ChartSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  margin-bottom: 40px;

  @media (max-width: 1100px) {
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
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

export default function ContabilidadPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const res = await getFinancialSummary();
    if (res.success) {
      setData(res.data);
    }
    setLoading(false);
  };

  if (loading) return <div>Cargando panel financiero...</div>;

  const { currentMonth, trends } = data || {
    currentMonth: { income: 0, expense: 0, profit: 0 },
    trends: [],
  };

  return (
    <Page>
      <Header>
        <div>
          <h1>Control Financiero</h1>
          <p>Métricas de ingresos, costos y beneficios en tiempo real.</p>
        </div>
        <div style={{ display: "flex", gap: 15 }}>
          <button
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              background: "#f5f5f5",
              border: "none",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Exportar Reporte
          </button>
        </div>
      </Header>

      <MetricsGrid>
        <MetricCard
          $type="income"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="label">
            <TrendingUp size={16} /> Ingresos Mensuales
          </div>
          <div className="value">${currentMonth.income.toLocaleString()}</div>
          <div className="trend">
            <ArrowUpRight size={16} /> +12% vs mes anterior
          </div>
        </MetricCard>

        <MetricCard
          $type="expense"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="label">
            <TrendingDown size={16} /> Costos Totales (COGS)
          </div>
          <div className="value">${currentMonth.expense.toLocaleString()}</div>
          <div className="trend">
            <ArrowDownRight size={16} /> -5% optimización
          </div>
        </MetricCard>

        <MetricCard
          $type="profit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="label">
            <DollarSign size={16} /> Beneficio Neto
          </div>
          <div className="value">${currentMonth.profit.toLocaleString()}</div>
          <div className="trend">
            <ArrowUpRight size={16} /> Margen del{" "}
            {currentMonth.income > 0
              ? ((currentMonth.profit / currentMonth.income) * 100).toFixed(1)
              : 0}
            %
          </div>
        </MetricCard>
      </MetricsGrid>

      <ChartSection>
        <ChartCard>
          <h3>
            <TrendingUp size={20} /> Tendencia de Ingresos vs Egresos
          </h3>
          <div style={{ width: "100%", height: 350 }}>
            <RevenueTrendChart trends={trends} />
          </div>
        </ChartCard>

        <ChartCard>
          <h3>
            <PieChart size={20} /> Beneficio por Mes
          </h3>
          <div style={{ width: "100%", height: 350 }}>
            <ProfitByMonthChart trends={trends} />
          </div>
        </ChartCard>
      </ChartSection>
    </Page>
  );
}
