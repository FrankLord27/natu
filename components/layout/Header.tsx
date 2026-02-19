'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { ShoppingBag, Heart, Menu, X, ClipboardList, Search, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { WishlistModal } from '@/components/wishlist/WishlistModal';
import { OrderHistoryModal } from '@/components/orders/OrderHistoryModal';

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 5%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.6rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -1px;

  span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 400;
  }
`;

const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 35px;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    flex-direction: column;
    justify-content: center;
    gap: 30px;
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2000;
    padding: 20px;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.3s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    &::after { width: 100%; }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.2rem;
    letter-spacing: 2px;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionBtn = styled.button`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryPale};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuBtn = styled.button`
  display: none;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  z-index: 2100;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LoginButton = styled(Link)`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primaryPale};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 8px;
    span {
      display: none;
    }
  }
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  min-width: 200px;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateY(0)' : 'translateY(-10px)')};
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryPale};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  width: 100%;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: #ffebee;
    color: #c62828;
  }
`;

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const userType = (session?.user as any)?.userType;
  const userName = session?.user?.name || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <HeaderWrapper>
        <Nav>
          <Logo href="/">Natura<span>JM</span></Logo>

          <NavLinks $isOpen={menuOpen}>
            <NavLink href="/" onClick={() => setMenuOpen(false)}>Inicio</NavLink>
            <NavLink href="/tienda" onClick={() => setMenuOpen(false)}>Tienda</NavLink>
            <NavLink href="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</NavLink>
            <NavLink href="/contacto" onClick={() => setMenuOpen(false)}>Contacto</NavLink>
          </NavLinks>

          <Actions>
            <ActionBtn onClick={() => setWishlistOpen(true)} title="Favoritos">
              <Heart size={20} />
              {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
            </ActionBtn>
            <ActionBtn onClick={() => setOrdersOpen(true)} title="Mis Pedidos">
              <ClipboardList size={20} />
            </ActionBtn>
            <ActionBtn onClick={toggleCart} title="Carrito">
              <ShoppingBag size={20} />
              {totalItems > 0 && <Badge>{totalItems}</Badge>}
            </ActionBtn>

            {!isAuthenticated ? (
              <LoginButton href="/login">Iniciar Sesión</LoginButton>
            ) : (
              <UserMenu>
                <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <User size={18} />
                  <span>{userName.split(' ')[0]}</span>
                </UserButton>
                <Dropdown $isOpen={userMenuOpen}>
                  {userType === 'customer' && (
                    <>
                      <DropdownItem href="/mi-cuenta" onClick={() => setUserMenuOpen(false)}>
                        <User size={16} />
                        Mi Cuenta
                      </DropdownItem>
                      <DropdownItem href="/mi-cuenta/pedidos" onClick={() => setUserMenuOpen(false)}>
                        <ClipboardList size={16} />
                        Pedidos
                      </DropdownItem>
                      <DropdownItem href="/mi-cuenta/favoritos" onClick={() => setUserMenuOpen(false)}>
                        <Heart size={16} />
                        Favoritos
                      </DropdownItem>
                      <DropdownItem href="/mi-cuenta/perfil" onClick={() => setUserMenuOpen(false)}>
                        <Settings size={16} />
                        Configuración
                      </DropdownItem>
                    </>
                  )}
                  {userType === 'admin' && (
                    <DropdownItem href="/admin" onClick={() => setUserMenuOpen(false)}>
                      <Settings size={16} />
                      Panel Admin
                    </DropdownItem>
                  )}
                  <DropdownButton onClick={handleLogout}>
                    <LogOut size={16} />
                    Cerrar Sesión
                  </DropdownButton>
                </Dropdown>
              </UserMenu>
            )}

            <MenuBtn onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </MenuBtn>
          </Actions>
        </Nav>
      </HeaderWrapper>

      <WishlistModal isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <OrderHistoryModal isOpen={ordersOpen} onClose={() => setOrdersOpen(false)} />
    </>
  );
};
