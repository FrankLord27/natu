'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { Package, Calendar, DollarSign, Eye, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import SafeImage from '@/components/SafeImage';

const Page = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.colors.background};
  padding: 60px 5%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 35px;
  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: ${p => p.theme.colors.text};
    margin-bottom: 5px;
  }
  p {
    color: ${p => p.theme.colors.textLight};
  }
`;

const OrdersGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border: 2px solid transparent;
  transition: all 0.3s;

  &:hover {
    border-color: ${p => p.theme.colors.primary};
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const OrderInfo = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: ${p => p.theme.colors.text};
    margin-bottom: 8px;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    font-size: 0.85rem;
    color: ${p => p.theme.colors.textLight};

    span {
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 8px 16px;
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

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f8f8;
  border-radius: 10px;

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }

  .details {
    flex: 1;
    .name {
      font-weight: 700;
      color: ${p => p.theme.colors.text};
      margin-bottom: 4px;
    }
    .qty {
      font-size: 0.85rem;
      color: ${p => p.theme.colors.textLight};
    }
  }

  .price {
    font-weight: 800;
    color: ${p => p.theme.colors.primary};
  }
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;

  .total {
    font-size: 1.3rem;
    font-weight: 900;
    color: ${p => p.theme.colors.text};
    span {
      color: ${p => p.theme.colors.primary};
    }
  }
`;

const ViewButton = styled(Link)`
  padding: 10px 24px;
  background: ${p => p.theme.colors.primary};
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: ${p => p.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;

  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: ${p => p.theme.colors.primaryPale};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${p => p.theme.colors.text};
    margin-bottom: 10px;
  }

  p {
    color: ${p => p.theme.colors.textLight};
    margin-bottom: 25px;
  }

  a {
    display: inline-block;
    padding: 14px 30px;
    background: ${p => p.theme.colors.primary};
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s;

    &:hover {
      background: ${p => p.theme.colors.primaryDark};
      transform: translateY(-2px);
    }
  }
`;

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      name: string;
      imageUrls: string[];
    };
    quantity: number;
    price: number;
  }>;
}

export default function MisPedidos() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch('/api/user/orders')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [session]);

  if (loading) {
    return <Page><Container>Cargando pedidos...</Container></Page>;
  }

  if (orders.length === 0) {
    return (
      <Page>
        <Container>
          <Header>
            <h1>Mis Pedidos</h1>
            <p>Historial de compras</p>
          </Header>
          <EmptyState>
            <div className="icon">
              <Package size={40} color="#7BB32E" />
            </div>
            <h3>No tienes pedidos aún</h3>
            <p>Explora nuestra tienda y realiza tu primera compra</p>
            <Link href="/tienda">Ir a la Tienda</Link>
          </EmptyState>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <h1>Mis Pedidos</h1>
          <p>{orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'} realizados</p>
        </Header>

        <OrdersGrid>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <h3>Pedido #{order.orderNumber}</h3>
                  <div className="meta">
                    <span>
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span>
                      <Package size={14} />
                      {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                    </span>
                  </div>
                </OrderInfo>
                <StatusBadge $status={order.status}>{order.status}</StatusBadge>
              </OrderHeader>

              <ItemsList>
                {order.items.slice(0, 3).map(item => (
                  <Item key={item.id}>
                    <SafeImage 
                        src={item.product.imageUrls[0] || '/placeholder.jpg'} 
                        alt={item.product.name} 
                        width={60}
                        height={60}
                        style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div className="details">
                      <div className="name">{item.product.name}</div>
                      <div className="qty">Cantidad: {item.quantity}</div>
                    </div>
                    <div className="price">${item.price.toFixed(2)}</div>
                  </Item>
                ))}
                {order.items.length > 3 && (
                  <div style={{ fontSize: '0.85rem', color: '#999', paddingLeft: '12px' }}>
                    + {order.items.length - 3} producto{order.items.length -3 !== 1 ? 's' : ''} más
                  </div>
                )}
              </ItemsList>

              <OrderFooter>
                <div className="total">
                  Total: <span>${order.total.toFixed(2)}</span>
                </div>
                <ViewButton href={`/mi-cuenta/pedidos/${order.id}`}>
                  <Eye size={16} />
                  Ver Detalles
                </ViewButton>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrdersGrid>
      </Container>
    </Page>
  );
}
