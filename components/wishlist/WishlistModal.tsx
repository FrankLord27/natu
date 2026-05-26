"use client";

import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 2500;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  width: min(500px, 90vw);
  max-height: 80vh;
  background: white;
  border-radius: 24px;
  z-index: 2600;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  h2 {
    font-size: 1.3rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
`;

const List = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ItemRow = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #fcfcfc;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
`;

const ItemImg = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  h4 {
    font-weight: 700;
    font-size: 0.95rem;
    color: #333;
    margin-bottom: 4px;
  }
  .price {
    font-weight: 800;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
`;

const IconBtn = styled.button`
  color: #999;
  transition: all 0.2s;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  padding: 60px 0;
  text-align: center;
  color: #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  p {
    font-weight: 600;
    font-size: 1rem;
    color: #999;
  }
`;

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrls?.[0] || "/placeholder.jpg",
      slug: product.slug,
    });
    setIsCartOpen(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Modal
            initial={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
          >
            <Header>
              <h2>
                <Heart size={22} /> Mis Favoritos
              </h2>
              <button onClick={onClose}>
                <X size={24} color="#888" />
              </button>
            </Header>
            <List>
              {wishlist.length === 0 ? (
                <EmptyState>
                  <Heart size={60} strokeWidth={1} />
                  <p>Aún no tienes favoritos</p>
                </EmptyState>
              ) : (
                wishlist.map((product) => (
                  <ItemRow key={product.id}>
                    <ItemImg>
                      <Image
                        src={product.imageUrls?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="70px"
                      />
                    </ItemImg>
                    <ItemInfo>
                      <h4>{product.name}</h4>
                      <span className="price">
                        ${(product.discountPrice || product.price).toFixed(2)}
                      </span>
                    </ItemInfo>
                    <ItemActions>
                      <IconBtn
                        onClick={() => handleAddToCart(product)}
                        title="Agregar al carrito"
                      >
                        <ShoppingBag size={18} />
                      </IconBtn>
                      <IconBtn
                        onClick={() => removeFromWishlist(product.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={18} color="#ff5252" />
                      </IconBtn>
                    </ItemActions>
                  </ItemRow>
                ))
              )}
            </List>
          </Modal>
        </>
      )}
    </AnimatePresence>
  );
};
