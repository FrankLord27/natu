'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(123,179,46,0.15);
    border-color: ${({ theme }) => theme.colors.primaryPale};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  overflow: hidden;

  img { transition: transform 0.6s ease; }
  &:hover img { transform: scale(1.08); }
`;

const DiscountBadge = styled.span`
  position: absolute; top: 15px; left: 15px; z-index: 5;
  background: ${({ theme }) => theme.colors.accent};
  color: white; padding: 6px 14px; border-radius: 50px;
  color: white; padding: 6px 14px; border-radius: 50px;
  font-size: 0.75rem; font-weight: 800;
`;

const StockBadge = styled.span<{ $type: 'out' | 'low' }>`
  position: absolute; top: 15px; left: 15px; z-index: 5;
  background: ${({ $type }) => $type === 'out' ? '#000' : '#FF9800'};
  color: white; padding: 6px 14px; border-radius: 50px;
  font-size: 0.75rem; font-weight: 800;
`;

const QuickActions = styled.div`
  position: absolute; top: 15px; right: 15px; z-index: 5;
  display: flex; flex-direction: column; gap: 8px;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  width: 38px; height: 38px; border-radius: 50%;
  background: ${({ $active }) => $active ? '#ff5252' : 'rgba(255,255,255,0.9)'};
  backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center;
  color: ${({ $active }) => $active ? 'white' : '#333'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    transform: scale(1.1);
    background: ${({ $active, theme }) => $active ? '#ff5252' : theme.colors.primary};
    color: white;
  }
`;

const Info = styled.div`
  padding: 20px;
`;

const CategoryLabel = styled.span`
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.primary}; opacity: 0.8;
`;

const ProductName = styled.h3`
  font-size: 1.05rem; font-weight: 700; color: ${({ theme }) => theme.colors.text};
  margin: 8px 0; line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
`;

const PriceRow = styled.div`
  display: flex; align-items: center; gap: 10px; margin-top: 5px;
`;

const Price = styled.span`
  font-size: 1.3rem; font-weight: 900; color: ${({ theme }) => theme.colors.primary};
`;

const OldPrice = styled.span`
  font-size: 0.9rem; color: #999; text-decoration: line-through;
`;

const RatingRow = styled.div`
  display: flex; align-items: center; gap: 4px; margin-top: 8px;
  span { font-size: 0.8rem; color: #999; font-weight: 600; }
`;

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrls?.[0] || '/placeholder.jpg',
      slug: product.slug,
    });
    setIsCartOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product);
  };

  return (
    <Card onClick={onClick || (() => router.push(`/productos/${product.slug}`))}>
      <ImageWrapper>
        <Image
          src={product.imageUrls?.[0] || '/placeholder.jpg'}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        {product.stock === 0 ? (
          <StockBadge $type="out">AGOTADO</StockBadge>
        ) : product.stock < 5 ? (
          <StockBadge $type="low">¡ÚLTIMAS {product.stock}!</StockBadge>
        ) : (
          discountPercent > 0 && <DiscountBadge>-{discountPercent}%</DiscountBadge>
        )}
        <QuickActions>
          <ActionButton $active={inWishlist} onClick={handleToggleWishlist} title="Favorito">
            <Heart size={16} fill={inWishlist ? 'white' : 'none'} />
          </ActionButton>
          <ActionButton 
            onClick={handleAddToCart} 
            title={product.stock === 0 ? "Agotado" : "Agregar al carrito"}
            disabled={product.stock === 0}
            style={{ opacity: product.stock === 0 ? 0.5 : 1, cursor: product.stock === 0 ? 'not-allowed' : 'pointer' }}
          >
            <ShoppingBag size={16} />
          </ActionButton>
        </QuickActions>
      </ImageWrapper>
      <Info>
        {product.category && <CategoryLabel>{product.category.name}</CategoryLabel>}
        <ProductName>{product.name}</ProductName>
        <PriceRow>
          <Price>${(product.discountPrice || product.price).toFixed(2)}</Price>
          {product.discountPrice && <OldPrice>${product.price.toFixed(2)}</OldPrice>}
        </PriceRow>
        {product.reviewCount > 0 && (
          <RatingRow>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.round(product.averageRating) ? '#FFB800' : 'none'} color="#FFB800" />
            ))}
            <span>({product.reviewCount})</span>
          </RatingRow>
        )}
      </Info>
    </Card>
  );
};
