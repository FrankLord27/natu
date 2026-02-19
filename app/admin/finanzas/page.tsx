'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, PieChart, 
  Calendar, ArrowUpRight, ArrowDownRight, Activity,
  Clock, FileText, Download, Filter, ShoppingBag
} from 'lucide-react';
import dynamic from 'next/dynamic';

const SalesTrendChart = dynamic(() => import('@/components/admin/FinanceCharts').then(mod => mod.SalesTrendChart), { ssr: false });

const Container = styled.div`
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;

  h1 { font-size: 2.5rem; font-weight: 950; color: #1a1a1a; letter-spacing: -2px; margin-bottom: 10px; }
  p { color: #666; font-weight: 600; font-size: 1.1rem; }

  .actions {
    display: flex;
    gap: 15px;
  }
`;

const GlassCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 32px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.03);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
  margin-bottom: 30px;
  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const MetricCard = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;

  .label { font-size: 0.85rem; font-weight: 800; color: #888; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 15px; }
  .value { font-size: 2.2rem; font-weight: 950; color: #1a1a1a; margin-bottom: 10px; }
  .comparison {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

const ChartSection = styled(GlassCard)`
  height: 450px;
  h3 { font-size: 1.2rem; font-weight: 900; color: #1a1a1a; margin-bottom: 30px; }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const PredictiveCard = styled(GlassCard)`
  background: linear-gradient(135deg, ${p => p.theme.colors.primaryDark} 0%, #1a1a1a 100%);
  color: white;
  border: none;

  h3 { font-size: 1.1rem; font-weight: 800; margin-bottom: 20px; opacity: 0.8; }
  .proj-value { font-size: 2.5rem; font-weight: 950; margin-bottom: 15px; color: ${p => p.theme.colors.primary}; }
  .note { font-size: 0.85rem; opacity: 0.7; line-height: 1.5; }
`;

const JournalCard = styled(GlassCard)`
  h3 { font-size: 1.1rem; font-weight: 900; margin-bottom: 25px; }
`;

const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  &:last-child { border-bottom: none; }

  .info {
    display: flex;
    gap: 12px;
    align-items: center;
    .icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
    .text { display: flex; flex-direction: column; }
    .desc { font-size: 0.9rem; font-weight: 700; color: #1a1a1a; }
    .date { font-size: 0.75rem; color: #888; font-weight: 600; }
  }

  .amount {
    font-size: 0.95rem;
    font-weight: 800;
    &.income { color: #7BB32E; }
    &.expense { color: #ff5252; }
  }
`;

const ActionBtn = styled.button`
  background: white; border: 1px solid #eee; padding: 12px 20px; border-radius: 16px;
  font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 10px;
  cursor: pointer; transition: 0.3s;
  &:hover { background: #f9f9f9; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
`;

export default function FinancialDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/finanzas')
      .then(res => res.json())
      .then(d => {
        if (d.success) setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <Container>Cargando Business Intelligence...</Container>;
  if (!data) return <Container>Error al cargar datos financieros.</Container>;

  const { descriptive, diagnostic, predictive, chartData, recentEntries } = data;

  return (
    <Container>
      <Header>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p>NaturaJM Elite Business</p>
          <h1>Inteligencia Financiera</h1>
        </motion.div>
        <div className="actions">
          <ActionBtn><Calendar size={18} /> Este Mes</ActionBtn>
          <ActionBtn><Download size={18} /> Exportar Reporte</ActionBtn>
        </div>
      </Header>

      <StatsGrid>
        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="label">Ingresos Totales</div>
          <div className="value">${descriptive.revenue.toLocaleString()}</div>
          <div className="comparison" style={{ color: diagnostic.momGrowth >= 0 ? '#7BB32E' : '#ff5252' }}>
            {diagnostic.momGrowth >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(diagnostic.momGrowth).toFixed(1)}% MoM
          </div>
        </MetricCard>

        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="label">Utilidad Bruta</div>
          <div className="value">${descriptive.profit.toLocaleString()}</div>
          <div className="comparison" style={{ color: '#7BB32E' }}>
            <Activity size={16} /> {(descriptive.profit / descriptive.revenue * 100).toFixed(1)}% Margen
          </div>
        </MetricCard>

        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="label">Valor Medio Orden</div>
          <div className="value">${descriptive.aov.toFixed(2)}</div>
          <div className="comparison" style={{ color: '#888' }}>
            <ShoppingBag size={16} /> {descriptive.orderCount} Pedidos
          </div>
        </MetricCard>

        <MetricCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="label">Efectividad de Venta</div>
          <div className="value">94.2%</div>
          <div className="comparison" style={{ color: '#7BB32E' }}>
            <ArrowUpRight size={16} /> +2.4% vs Mes Ant.
          </div>
        </MetricCard>
      </StatsGrid>

      <MainGrid>
        <ChartSection initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
          <h3>Tendencia de Ventas (Últimos 30 días)</h3>
          <div style={{ height: '320px', width: '100%' }}>
            <SalesTrendChart data={chartData} />
          </div>
        </ChartSection>

        <RightColumn>
          <PredictiveCard initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <h3>Proyección Cierre de Mes</h3>
            <div className="proj-value">${predictive.projectedRevenue.toLocaleString()}</div>
            <p className="note">
               Basado en la tendencia actual, se estima un crecimiento del **{((predictive.projectedRevenue / diagnostic.lastMonthRevenue - 1) * 100).toFixed(1)}%** respecto al mes pasado.
            </p>
          </PredictiveCard>

          <JournalCard initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Libro Diario</h3>
              <Filter size={18} style={{ color: '#ccc', cursor: 'pointer' }} />
            </div>
            
            {recentEntries.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>Sin transacciones hoy.</p>
            ) : recentEntries.map((entry: any) => (
              <Entry key={entry.id}>
                <div className="info">
                  <div className="icon">
                    {entry.type === 'INCOME' ? <TrendingUp size={16} color="#7BB32E" /> : <TrendingDown size={16} color="#ff5252" />}
                  </div>
                  <div className="text">
                    <span className="desc">{entry.description}</span>
                    <span className="date">{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className={`amount ${entry.type.toLowerCase()}`}>
                  {entry.type === 'INCOME' ? '+' : '-'}${entry.amount.toFixed(2)}
                </div>
              </Entry>
            ))}

            <ActionBtn style={{ width: '100%', marginTop: 25, justifyContent: 'center' }}>
              Ver Todos los Movimientos
            </ActionBtn>
          </JournalCard>
        </RightColumn>
      </MainGrid>
    </Container>
  );
}
