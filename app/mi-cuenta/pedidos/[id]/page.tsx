'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Package, Calendar, Truck, CheckCircle, Clock, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SafeImage from '@/components/SafeImage';

const Page = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.colors.background};
  padding: 60px 5%;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
`;

const BackButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.colors.text};
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s;

  &:hover {
    background: ${p => p.theme.colors.primaryPale};
    color: ${p => p.theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${p => p.theme.colors.text};
`;

const OrderStatusSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
`;

const StatusHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const OrderId = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${p => p.theme.colors.text};
  span { color: ${p => p.theme.colors.textLight}; font-weight: 500; }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  margin-bottom: 25px;

  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: ${p => p.theme.colors.text};
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 10px;
  }

  .info {
    flex: 1;
    .name {
      font-weight: 700;
      color: ${p => p.theme.colors.text};
      margin-bottom: 4px;
    }
    .meta {
      font-size: 0.85rem;
      color: ${p => p.theme.colors.textLight};
    }
  }

  .price {
    font-weight: 800;
    color: ${p => p.theme.colors.primary};
  }
`;

const SummaryRow = styled.div<{ $bold?: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-weight: ${p => p.$bold ? '800' : '500'};
  color: ${p => p.$bold ? p.theme.colors.text : p.theme.colors.textLight};
  font-size: ${p => p.$bold ? '1.1rem' : '0.95rem' };

  .total-label { color: ${p => p.theme.colors.text}; }
  .total-value { color: ${p => p.theme.colors.primary}; }
`;

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrls: string[];
    };
  }>;
}

export default function PedidoDetalle() {
  const params = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/user/orders/${params.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrder(data.order);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  if (loading) {
    return <Page><Container><LoadingWrap>Cargando detalles...</LoadingWrap></Container></Page>;
  }

  if (!order) {
    return (
      <Page>
        <Container>
          <Header>
            <BackButton href="/mi-cuenta/pedidos"><ArrowLeft size={18} /></BackButton>
            <Title>Pedido no encontrado</Title>
          </Header>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <BackButton href="/mi-cuenta/pedidos"><ArrowLeft size={18} /></BackButton>
          <Title>Detalle del Pedido</Title>
        </Header>

        <OrderStatusSection>
          <StatusHeader>
            <OrderId>Orden <span>#{order.orderNumber}</span></OrderId>
            <StatusBadge $status={order.status}>{order.status}</StatusBadge>
          </StatusHeader>
          <div style={{ color: '#999', fontSize: '0.9rem' }}>
            Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', { 
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
            })}
          </div>
        </OrderStatusSection>

        <Grid>
          <div>
            <Card>
              <h3><Package size={20} /> Productos</h3>
              {order.items.map(item => (
                <Item key={item.id}>
                  <SafeImage 
                    src={item.product.imageUrls[0] || '/placeholder.jpg'} 
                    alt={item.product.name} 
                    width={60} 
                    height={60}
                    style={{ objectFit: 'cover', borderRadius: 10 }}
                  />
                  <div className="info">
                    <div className="name">{item.product.name}</div>
                    <div className="meta">Cantidad: {item.quantity} × ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="price">${(item.quantity * item.price).toFixed(2)}</div>
                </Item>
              ))}
            </Card>
          </div>

          <div>
            <Card>
              <h3><CreditCard size={20} /> Resumen</h3>
              <SummaryRow>
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Envío</span>
                <span>Gratis</span>
              </SummaryRow>
              <SummaryRow $bold style={{ marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #f0f0f0' }}>
                <span className="total-label">Total</span>
                <span className="total-value">${order.total.toFixed(2)}</span>
              </SummaryRow>
            </Card>

            <Card>
              <h3><MapPin size={20} /> Dirección de Envío</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: '1.6' }}>
                La información de envío se gestiona directamente tras la confirmación del pago.
              </p>
            </Card>
          </div>
        </Grid>
      </Container>
    </Page>
  );
}
