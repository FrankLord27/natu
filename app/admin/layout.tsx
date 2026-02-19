'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from '@/components/ui/Loader';
import {
  LayoutDashboard, Package, Users, FileText, BarChart3,
  Settings, LogOut, Leaf, Mail, Star, Video, MessageSquare, ShoppingBag, Globe, ChevronDown, ChevronRight
} from 'lucide-react';

const AdminWrapper = styled.div`display: flex; min-height: 100vh;`;

const Sidebar = styled.aside`
  width: 260px; background: #1a1a1a; color: white; padding: 30px 0;
  display: flex; flex-direction: column; position: fixed; top: 0; left: 0;
  height: 100vh; z-index: 1100; overflow-y: auto;

  @media (max-width: 768px) { display: none; }
`;

const SidebarLogo = styled.div`
  padding: 0 25px 30px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;
  h2 { font-size: 1.4rem; font-weight: 900; color: ${p => p.theme.colors.primary}; span { color: white; font-weight: 400; } }
  p { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-top: 5px; }
`;

const NavGroup = styled.div`
  padding: 0 15px; margin-bottom: 5px;
  .group-header { 
    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: #555; 
    padding: 10px; margin-bottom: 2px; display: flex; justify-content: space-between; 
    align-items: center; cursor: pointer; border-radius: 8px; transition: all 0.2s;
    &:hover { background: rgba(255,255,255,0.05); color: #888; }
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  display: flex; align-items: center; gap: 12px; padding: 12px 15px; border-radius: 10px;
  font-size: 0.9rem; font-weight: 500; margin-bottom: 3px;
  background: ${({ $active }) => $active ? 'rgba(123,179,46,0.15)' : 'transparent'};
  color: ${({ $active }) => $active ? '#7BB32E' : '#aaa'};
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.05); color: #fff; }
`;

import ErrorBoundary from '@/components/ErrorBoundary';

const LogoutBtn = styled.button`
  display: flex; align-items: center; gap: 12px; padding: 12px 15px; margin: 0 15px; border-radius: 10px;
  font-size: 0.9rem; color: #ff5252; transition: all 0.2s; width: calc(100% - 30px);
  &:hover { background: rgba(255,82,82,0.1); }
`;

const Main = styled.main`
  flex: 1; margin-left: 260px; background: #f5f5f5; min-height: 100vh; padding: 30px;
  @media (max-width: 768px) { margin-left: 0; }
`;

const navItems = [
  { label: 'General', items: [
    { href: '/admin', icon: <LayoutDashboard size={18} />, label: 'Inicio' },
    { href: '/admin/metricas', icon: <BarChart3 size={18} />, label: 'Análisis de Negocio' },
  ]},
  { label: 'Tienda', items: [
    { href: '/admin/productos', icon: <Package size={18} />, label: 'Productos' },
    { href: '/admin/categorias', icon: <FileText size={18} />, label: 'Categorías' },
    { href: '/admin/pedidos', icon: <ShoppingBag size={18} />, label: 'Pedidos' },
    { href: '/admin/inventario', icon: <BarChart3 size={18} />, label: 'Inventario' },
    { href: '/admin/facturacion', icon: <FileText size={18} />, label: 'Facturación' },
    { href: '/admin/ventas-manuales', icon: <DollarSign size={18} />, label: 'Caja (Tienda)' },
  ]},
  { label: 'Comunidad', items: [
    { href: '/admin/usuarios', icon: <Users size={18} />, label: 'Clientes' },
    { href: '/admin/resenas', icon: <Star size={18} />, label: 'Reseñas' },
    { href: '/admin/testimonios', icon: <MessageSquare size={18} />, label: 'Testimonios' },
  ]},
  { label: 'Contenido', items: [
    { href: '/admin/contenido', icon: <Globe size={18} />, label: 'Editor Web' },
    { href: '/admin/videos', icon: <Video size={18} />, label: 'Galería Videos' },
    { href: '/admin/mensajes', icon: <Mail size={18} />, label: 'Mensajes' },
    { href: '/admin/marketing', icon: <Users size={18} />, label: 'Marketing' },
  ]},
  { label: 'Configuración', items: [
    { href: '/admin/ajustes', icon: <Settings size={18} />, label: 'Ajustes Globales' },
  ]},
];

import { DollarSign } from 'lucide-react';

interface NavGroupProps {
  group: {
    label: string;
    items: Array<{ href: string, icon: React.ReactNode, label: string }>;
  };
  pathname: string;
}

const AdminNavGroup: React.FC<NavGroupProps> = ({ group, pathname }) => {
  const isDashboard = group.label === 'General';
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <NavGroup key={group.label}>
      {!isDashboard && (
        <div className="group-header" onClick={() => setIsOpen(!isOpen)}>
          {group.label}
          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>
      )}
      <AnimatePresence initial={false}>
        {(isOpen || isDashboard) && (
          <motion.div
            initial={isDashboard ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {group.items.map(item => (
              <NavItem key={item.href} href={item.href} $active={pathname === item.href}>
                {item.icon} {item.label}
              </NavItem>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </NavGroup>
  );
};

import { Suspense } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <AdminWrapper>
      <Sidebar>
        <SidebarLogo>
          <h2>Natura<span>JM</span></h2>
          <p>Admin V3</p>
        </SidebarLogo>

        {navItems.map(group => (
          <AdminNavGroup key={group.label} group={group} pathname={pathname} />
        ))}

        <div style={{ flex: 1 }} />
        <LogoutBtn onClick={() => signOut({ callbackUrl: '/admin/login' })}>
          <LogOut size={18} /> Cerrar Sesión
        </LogoutBtn>
      </Sidebar>
      <Main>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </Main>
    </AdminWrapper>
  );
}
