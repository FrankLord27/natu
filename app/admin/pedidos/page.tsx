'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/Pagination';
import styled from 'styled-components';
import { Search, Eye, Package, TrendingUp, FileText } from 'lucide-react';
import Link from 'next/link';
import NextDynamic from 'next/dynamic';
import { Loader } from '@/components/ui/Loader';

const InvoiceView = NextDynamic(() => import('@/components/admin/InvoiceView').then(mod => mod.InvoiceView), { 
  ssr: false,
  loading: () => <Loader />
});

const Page = styled.div``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: #333;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);

  .value {
    font-size: 2rem;
    font-weight: 900;
    color: ${p => p.theme.colors.primary};
    margin-bottom: 5px;
  }

  .label {
    font-size: 0.85rem;
    color: #999;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const SearchBar = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 18px 20px;
  background: #f8f8f8;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  border-bottom: 2px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
`;

const Tr = styled.tr`
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

const OrderNumber = styled.div`
  font-weight: 800;
  color: #333;
  margin-bottom: 4px;
`;

const CustomerName = styled.div`
  font-size: 0.85rem;
  color: #666;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${p => {
    switch(p.$status) {
      case 'PENDING': return '#FFF3E0';
      case 'PAID': return '#E3F2FD';
      case 'PROCESSING': return '#E8F5E9';
      case 'SHIPPED': return '#F3E5F5';
      case 'DELIVERED': return '#C8E6C9';
      case 'CANCELLED': return '#FFEBEE';
      default: return '#F5F5F5';
    }
  }};
  color: ${p => {
    switch(p.$status) {
      case 'PENDING': return '#E65100';
      case 'PAID': return '#1565C0';
      case 'PROCESSING': return '#2E7D32';
      case 'SHIPPED': return '#6A1B9A';
      case 'DELIVERED': return '#2E7D32';
      case 'CANCELLED': return '#C62828';
      default: return '#666';
    }
  }};
`;

const Price = styled.div`
  font-weight: 800;
  color: ${p => p.theme.colors.primary};
  font-size: 1.1rem;
`;

const ViewButton = styled(Link)`
  padding: 8px 16px;
  background: ${p => p.theme.colors.primaryPale};
  color: ${p => p.theme.colors.primary};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;

  &:hover {
    background: ${p => p.theme.colors.primary};
    color: white;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999;

  h3 {
    font-size: 1.3rem;
    font-weight: 800;
    color: #666;
    margin-bottom: 10px;
  }
`;

const LoadingState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 1.1rem;
`;

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  items: Array<{
    quantity: number;
  }>;
}

export default function AdminPedidos() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, pending: 0, processing: 0, delivered: 0 });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${page}&limit=10&search=${searchTerm}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setPagination(data.pagination);
        calculateStats(data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const calculateStats = (orders: Order[]) => {
    setStats({
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      processing: orders.filter(o => o.status === 'PROCESSING').length,
      delivered: orders.filter(o => o.status === 'DELIVERED').length,
    });
  };

  const filteredOrders = orders.filter(o => {
    const search = searchTerm.toLowerCase();
    const orderNum = (o.orderNumber || '').toLowerCase();
    const name = (o.user?.name || o.customerName || '').toLowerCase();
    const email = (o.user?.email || o.customerEmail || '').toLowerCase();
    
    return orderNum.includes(search) || name.includes(search) || email.includes(search);
  });

  if (loading) {
    return (
      <Page>
        <Header>
          <h1>Gestión de Pedidos</h1>
        </Header>
        <TableCard>
          <div style={{ padding: '60px 0' }}>
            <Loader size={15} color="#7BB32E" />
          </div>
        </TableCard>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <h1>Gestión de Pedidos</h1>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="value">{stats.total}</div>
          <div className="label">Total Pedidos</div>
        </StatCard>
        <StatCard>
          <div className="value">{stats.pending}</div>
          <div className="label">Pendientes</div>
        </StatCard>
        <StatCard>
          <div className="value">{stats.processing}</div>
          <div className="label">En Proceso</div>
        </StatCard>
        <StatCard>
          <div className="value">{stats.delivered}</div>
          <div className="label">Entregados</div>
        </StatCard>
      </StatsGrid>

      <SearchBar>
        <Search size={20} color="#999" />
        <SearchInput
          type="text"
          placeholder="Buscar por número de orden, cliente o email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <TableCard>
        {filteredOrders.length === 0 ? (
          <EmptyState>
            <Package size={50} strokeWidth={1} color="#ccc" />
            <h3>No hay pedidos</h3>
            <p>Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Pedido</Th>
                <Th>Cliente</Th>
                <Th>Fecha</Th>
                <Th>Items</Th>
                <Th>Total</Th>
                <Th>Estado</Th>
                <Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <Tr key={order.id}>
                  <Td>
                    <OrderNumber>#{order.orderNumber}</OrderNumber>
                  </Td>
                  <Td>
                    <OrderNumber>{order.user?.name || order.customerName || 'Cliente Particular'}</OrderNumber>
                    <CustomerName>{order.user?.email || order.customerEmail || 'Sin email'}</CustomerName>
                  </Td>
                  <Td>
                    {new Date(order.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Td>
                  <Td>{order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)}</Td>
                  <Td>
                    <Price>${order.total.toFixed(2)}</Price>
                  </Td>
                  <Td>
                    <StatusBadge $status={order.status}>{order.status}</StatusBadge>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <ViewButton href={`/admin/pedidos/${order.id}`}>
                        <Eye size={16} /> Detalle
                      </ViewButton>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        style={{ background: 'none', border: '1px solid #7BB32E', color: '#7BB32E', padding: '8px 12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <FileText size={16} /> Factura
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableCard>

      {selectedOrder && (
        <InvoiceView 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </Page>
  );
}
