'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FileText, Download, Plus, Search, ExternalLink, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  h1 { font-size: 2.2rem; font-weight: 900; color: #1a1a1a; }
`;

const InvoiceCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
  transition: all 0.3s;
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }

  .main-info {
    display: flex;
    gap: 20px;
    align-items: center;
    .icon {
      width: 50px; height: 50px; border-radius: 12px;
      background: #f0f4ec; color: #7BB32E;
      display: flex; align-items: center; justify-content: center;
    }
    .details {
      .number { font-weight: 900; font-size: 1.1rem; color: #1a1a1a; }
      .client { font-size: 0.9rem; color: #666; font-weight: 600; }
    }
  }

  .financials {
    text-align: right;
    .amount { font-size: 1.2rem; font-weight: 900; color: #1a1a1a; }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 50px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      margin-top: 5px;
      &.paid { background: #e8f5e9; color: #2e7d32; }
      &.issued { background: #fff8e1; color: #f57c00; }
    }
  }

  .actions {
    display: flex; gap: 10px;
  }
`;

const ActionButton = styled.button`
  width: 40px; height: 40px; border-radius: 10px; border: none;
  background: #f5f5f5; color: #666; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  &:hover { background: #1a1a1a; color: white; }
`;

export default function Invoicing() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch('/api/admin/invoices');
      const data = await res.json();
      if (data.success) setInvoices(data.invoices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Header>
        <h1>Facturación y Cobros</h1>
        <div style={{ display: 'flex', gap: 15 }}>
          <button style={{ 
            background: '#1a1a1a', color: 'white', border: 'none', 
            padding: '12px 24px', borderRadius: '12px', fontWeight: '800',
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer'
          }}>
            <Plus size={18} /> Nueva Factura Manual
          </button>
        </div>
      </Header>

      {loading ? (
        <p>Cargando facturas...</p>
      ) : (
        <div>
          {invoices.length === 0 ? (
            <div style={{ padding: 100, textAlign: 'center', opacity: 0.5 }}>
              <FileText size={80} style={{ margin: '0 auto 20px' }} />
              <p style={{ fontWeight: 800 }}>Aún no hay facturas generadas</p>
            </div>
          ) : (
            invoices.map((inv: any) => (
              <InvoiceCard key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="main-info">
                  <div className="icon"><FileText size={24} /></div>
                  <div className="details">
                    <div className="number">{inv.invoiceNumber}</div>
                    <div className="client">{inv.order?.customerName || 'Cliente Genérico'}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8, color: '#999', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Calendar size={14} /> Emitida: {new Date(inv.issuedAt).toLocaleDateString()}
                  </div>
                  
                  <div className="financials">
                    <div className="amount">${inv.total.toLocaleString()}</div>
                    <div className={`status ${inv.status.toLowerCase()}`}>
                      {inv.status === 'ISSUED' ? 'Pendiente' : 'Pagada'}
                    </div>
                  </div>

                  <div className="actions">
                    <ActionButton title="Descargar PDF"><Download size={18} /></ActionButton>
                    <ActionButton title="Ver Detalles"><ExternalLink size={18} /></ActionButton>
                  </div>
                </div>
              </InvoiceCard>
            ))
          )}
        </div>
      )}
    </Page>
  );
}
