'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/SafeImage';

const Page = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const BackButton = styled(Link)`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  &:hover {
    background: ${p => p.theme.colors.primaryPale};
    color: ${p => p.theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: #333;
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
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);

  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #333;
    margin-bottom: 20px;
  }
`;

const StatusSelector = styled.select`
  width: 100%;
  padding: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 15px;

  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const UpdateButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${p => p.theme.colors.primary};
  color: white;
  border-radius: 10px;
  font-weight: 700;
  transition: all 0.3s;

  &:hover {
    background: ${p => p.theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: #666;
  }

  .value {
    font-weight: 700;
    color: #333;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 12px;

  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 10px;
  }

  .details {
    flex: 1;

    .name {
      font-weight: 700;
      color: #333;
      margin-bottom: 5px;
    }

    .qty {
      font-size: 0.85rem;
      color: #999;
    }
  }

  .price {
    font-weight: 800;
    color: ${p => p.theme.colors.primary};
    font-size: 1.1rem;
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
  border-top: 2px solid #e0e0e0;
  margin-top: 10px;

  .label {
    font-size: 1.2rem;
    font-weight: 800;
    color: #333;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 900;
    color: ${p => p.theme.colors.primary};
  }
`;

const LoadingState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 1.1rem;
`;

interface OrderData {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  } | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
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

export default function AdminOrderDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
        setStatus(data.order.status);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        alert('Estado actualizado exitosamente');
        fetchOrder();
      }
    } catch (err) {
      console.error(err);
      alert('Error al actualizar estado');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <LoadingState>Cargando detalles del pedido...</LoadingState>
      </Page>
    );
  }

  if (!order) {
    return (
      <Page>
        <LoadingState>Pedido no encontrado</LoadingState>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <BackButton href="/admin/pedidos">
          <ArrowLeft size={20} />
        </BackButton>
        <Title>Pedido #{order.orderNumber}</Title>
      </Header>

      <Grid>
        <div>
          <Card>
            <h3>Productos</h3>
            <ItemsList>
              {order.items.map(item => (
                <Item key={item.id}>
                  <SafeImage 
                    src={item.product?.imageUrls?.[0] || '/placeholder.jpg'} 
                    alt={item.product?.name || 'Producto'}
                    width={70}
                    height={70}
                    style={{ objectFit: 'cover', borderRadius: 10 }}
                  />
                  <div className="details">
                    <div className="name">{item.product?.name || 'Producto no disponible'}</div>
                    <div className="qty">Cantidad: {item.quantity}</div>
                  </div>
                  <div className="price">${item.price.toFixed(2)}</div>
                </Item>
              ))}
            </ItemsList>

            <TotalRow>
              <div className="label">Total</div>
              <div className="value">${order.total.toFixed(2)}</div>
            </TotalRow>
          </Card>
        </div>

        <div>
          <Card style={{ marginBottom: 25 }}>
            <h3>Estado del Pedido</h3>
            <StatusSelector value={status} onChange={e => setStatus(e.target.value)}>
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagado</option>
              <option value="PROCESSING">En Proceso</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
            </StatusSelector>
            <UpdateButton 
              onClick={handleStatusUpdate}
              disabled={updating || status === order.status}
            >
              {updating ? 'Actualizando...' : 'Actualizar Estado'}
            </UpdateButton>
          </Card>

          <Card style={{ marginBottom: 25 }}>
            <h3>Información del Cliente</h3>
            <InfoRow>
              <span className="label">Nombre:</span>
              <span className="value">{order.user?.name || order.customerName || 'N/A'}</span>
            </InfoRow>
            <InfoRow>
              <span className="label">Email:</span>
              <span className="value">{order.user?.email || order.customerEmail || 'N/A'}</span>
            </InfoRow>
            <InfoRow>
              <span className="label">Teléfono:</span>
              <span className="value">{order.user?.phone || order.customerPhone || 'N/A'}</span>
            </InfoRow>
          </Card>

          <Card>
            <h3>Detalles del Pedido</h3>
            <InfoRow>
              <span className="label">Fecha:</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </InfoRow>
            <InfoRow>
              <span className="label">Items:</span>
              <span className="value">{order.items.reduce((sum: number, i: any) => sum + i.quantity, 0)}</span>
            </InfoRow>
          </Card>
        </div>
      </Grid>
    </Page>
  );
}
