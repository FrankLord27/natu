'use client';

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import Image from 'next/image';
import Link from 'next/link';

const Overlay = styled(motion.div)`
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2000;
`;

const Drawer = styled(motion.div)`
  position: fixed; top: 0; right: 0;
  width: min(450px, 100vw);
  height: 100vh;
  background: white;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  padding: 25px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid #f0f0f0;
  h2 { font-size: 1.5rem; font-weight: 800; display: flex; align-items: center; gap: 12px; margin: 0; }
`;

const CloseBtn = styled.button`
  color: #888;
  transition: all 0.3s ease;
  &:hover { color: #333; transform: rotate(90deg); }
`;

const CartList = styled.div`
  flex: 1; overflow-y: auto; padding: 25px;
  display: flex; flex-direction: column; gap: 20px;
`;

const EmptyCart = styled.div`
  height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; color: #ccc;
  p { font-weight: 600; font-size: 1.1rem; }
`;

const CartItemRow = styled.div`
  display: flex; gap: 15px; padding-bottom: 20px; border-bottom: 1px solid #f9f9f9;
`;

const ItemImg = styled.div`
  width: 80px; height: 80px; border-radius: 12px; background: #f5f5f5; position: relative; overflow: hidden; flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1; display: flex; flex-direction: column; justify-content: space-between;
`;

const ItemHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
  h4 { font-weight: 700; font-size: 1rem; margin: 0; color: #333; }
`;

const ItemPrice = styled.div`
  font-weight: 800; color: ${({ theme }) => theme.colors.primary}; margin-top: 5px;
`;

const ItemControls = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-top: 10px;
`;

const QtyControl = styled.div`
  display: flex; align-items: center; gap: 15px;
  background: #f5f5f5; padding: 5px 10px; border-radius: 50px;
  span { font-weight: 800; min-width: 20px; text-align: center; }
  button { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; color: #666; &:hover { color: #000; } }
`;

const FooterSection = styled.div`
  padding: 25px; border-top: 1px solid #f0f0f0; background: #fafafa;
`;

const TotalRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;
  span:first-child { font-weight: 600; color: #888; }
  span:last-child { font-size: 1.5rem; font-weight: 900; color: #1a1a1a; }
`;

const WhatsAppBtn = styled.button`
  width: 100%; background: #25D366; color: white; padding: 16px; border-radius: 15px;
  font-weight: 800; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 12px;
  transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(37, 211, 102, 0.2);
  &:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(37, 211, 102, 0.3); background: #22c35e; }
  &:disabled { background: #ccc; box-shadow: none; transform: none; cursor: not-allowed; }
`;

const CheckoutLink = styled(Link)`
  display: flex; width: 100%; background: ${({ theme }) => theme.colors.primary}; color: white; padding: 16px; border-radius: 15px;
  font-weight: 800; font-size: 1rem; align-items: center; justify-content: center; gap: 12px;
  transition: all 0.3s ease; margin-top: 10px; text-align: center;
  &:hover { transform: translateY(-3px); filter: brightness(1.1); }
`;

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart();
  const { addOrder } = useOrders();

  const handleWhatsAppCheckout = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '18091234567';
    const itemsText = cart.map(item => `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`).join('%0A');
    const totalText = `Total: $${totalPrice.toFixed(2)}`;
    const message = `¡Hola NaturaJM! Me gustaría realizar el siguiente pedido:%0A%0A${itemsText}%0A%0A${totalText}%0A%0A¡Espero su confirmación!`;

    addOrder({ items: cart, total: totalPrice, totalPrice, status: 'sent', paymentMethod: 'whatsapp' });
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <Overlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} />
          <Drawer initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
            <Header>
              <h2><ShoppingBag size={24} /> Mi Carrito</h2>
              <CloseBtn onClick={() => setIsCartOpen(false)}><X size={28} /></CloseBtn>
            </Header>

            <CartList>
              {cart.length === 0 ? (
                <EmptyCart><ShoppingBag size={80} strokeWidth={1} /><p>Tu carrito está vacío</p></EmptyCart>
              ) : (
                cart.map(item => (
                  <CartItemRow key={item.id}>
                    <ItemImg>
                      <Image src={item.image || '/placeholder.jpg'} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                    </ItemImg>
                    <ItemInfo>
                      <ItemHeader>
                        <h4>{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)}><Trash2 size={18} color="#ff5252" /></button>
                      </ItemHeader>
                      <ItemPrice>${item.price.toFixed(2)}</ItemPrice>
                      <ItemControls>
                        <QtyControl>
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                        </QtyControl>
                        <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
                      </ItemControls>
                    </ItemInfo>
                  </CartItemRow>
                ))
              )}
            </CartList>

            <FooterSection>
              <TotalRow>
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </TotalRow>
              <WhatsAppBtn disabled={cart.length === 0} onClick={handleWhatsAppCheckout}>
                Pedir vía WhatsApp <ArrowRight size={20} />
              </WhatsAppBtn>
              {cart.length > 0 && (
                <CheckoutLink href="/checkout" onClick={() => setIsCartOpen(false)}>
                  Pagar con Tarjeta / PayPal <ArrowRight size={20} />
                </CheckoutLink>
              )}
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999', marginTop: '15px' }}>
                Tu pedido será procesado de forma segura.
              </p>
            </FooterSection>
          </Drawer>
        </>
      )}
    </AnimatePresence>
  );
};
