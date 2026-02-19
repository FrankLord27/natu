'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Package, Heart, User, Settings, LogOut, ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';

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
  margin-bottom: 40px;
  h1 {
    font-size: 2.2rem;
    font-weight: 900;
    color: ${p => p.theme.colors.text};
    margin-bottom: 8px;
  }
  p {
    color: ${p => p.theme.colors.textLight};
    font-size: 1.1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const Card = styled(motion(Link))`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  }
`;

const IconBox = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CardContent = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: ${p => p.theme.colors.text};
    margin-bottom: 5px;
  }
  p {
    font-size: 0.9rem;
    color: ${p => p.theme.colors.textLight};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .value {
    font-size: 2rem;
    font-weight: 900;
    color: ${p => p.theme.colors.primary};
    margin-bottom: 5px;
  }

  .label {
    font-size: 0.85rem;
    color: ${p => p.theme.colors.textLight};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

const QuickActions = styled.div`
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);

  h2 {
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 20px;
    color: ${p => p.theme.colors.text};
  }
`;

const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border: 2px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  text-decoration: none;
  color: ${p => p.theme.colors.text};
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: ${p => p.theme.colors.primaryPale};
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
`;

export default function MiCuenta() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ orders: 0, favorites: 0, reviews: 0 });

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Fetch user stats
      fetch('/api/user/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error(err));
    }
  }, [status, session]);

  if (status === 'loading') {
    return <Page><Container>Cargando...</Container></Page>;
  }

  const userName = session?.user?.name || 'Usuario';

  return (
    <Page>
      <Container>
        <Header>
          <h1>¡Hola, {userName}!</h1>
          <p>Bienvenido a tu cuenta de NaturaJM</p>
        </Header>

        <StatsGrid>
          <StatCard>
            <div className="value">{stats.orders}</div>
            <div className="label">Pedidos</div>
          </StatCard>
          <StatCard>
            <div className="value">{stats.favorites}</div>
            <div className="label">Favoritos</div>
          </StatCard>
          <StatCard>
            <div className="value">{stats.reviews}</div>
            <div className="label">Reseñas</div>
          </StatCard>
        </StatsGrid>

        <Grid>
          <Card href="/mi-cuenta/pedidos">
            <IconBox $color="linear-gradient(135deg, #7BB32E, #5D8522)">
              <Package size={28} color="white" />
            </IconBox>
            <CardContent>
              <h3>Mis Pedidos</h3>
              <p>Historial de compras</p>
            </CardContent>
          </Card>

          <Card href="/mi-cuenta/favoritos">
            <IconBox $color="linear-gradient(135deg, #E91E63, #AD1457)">
              <Heart size={28} color="white" />
            </IconBox>
            <CardContent>
              <h3>Favoritos</h3>
              <p>Productos guardados</p>
            </CardContent>
          </Card>

          <Card href="/mi-cuenta/perfil">
            <IconBox $color="linear-gradient(135deg, #2196F3, #1565C0)">
              <User size={28} color="white" />
            </IconBox>
            <CardContent>
              <h3>Mi Perfil</h3>
              <p>Datos personales</p>
            </CardContent>
          </Card>
        </Grid>

        <QuickActions>
          <h2>Acciones Rápidas</h2>
          <ActionList>
            <ActionButton href="/tienda">
              <div className="left">
                <ShoppingBag size={20} />
                <span>Continuar Comprando</span>
              </div>
              <span>→</span>
            </ActionButton>
            <ActionButton href="/mi-cuenta/pedidos">
              <div className="left">
                <Clock size={20} />
                <span>Ver Pedidos Recientes</span>
              </div>
              <span>→</span>
            </ActionButton>
            <ActionButton href="/mi-cuenta/perfil">
              <div className="left">
                <Settings size={20} />
                <span>Configuración</span>
              </div>
              <span>→</span>
            </ActionButton>
          </ActionList>
        </QuickActions>
      </Container>
    </Page>
  );
}
