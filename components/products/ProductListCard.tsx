"use client";

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter } from "next/navigation";

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.3s ease;
  cursor: pointer;
  display: grid;
  grid-template-columns: 240px 1fr 200px;
  gap: 20px;
  padding: 15px;

  &:hover {
    transform: translateX(5px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.2;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;

  img {
    transition: transform 0.6s ease;
  }
  &:hover img {
    transform: scale(1.08);
  }
`;

const DiscountBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 5;
  background: ${({ theme }) => theme.colors.accent};
  color: white;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 800;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 0;
`;

const CategoryLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
  margin-bottom: 5px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 5px 0 10px;
  line-height: 1.3;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 15px;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: auto;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  span {
    font-size: 0.8rem;
    color: #999;
    font-weight: 600;
  }
`;

const Sidebar = styled.div`
  border-left: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 20px;
  gap: 15px;

  @media (max-width: 768px) {
    border-left: none;
    border-top: 1px solid #f0f0f0;
    padding-left: 0;
    padding-top: 15px;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
`;

const PriceCol = styled.div`
  text-align: center;
  @media (max-width: 768px) {
    text-align: left;
  }
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.primary};
`;

const OldPrice = styled.div`
  font-size: 0.95rem;
  color: #999;
  text-decoration: line-through;
  margin-top: 2px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: row;
    width: auto;
  }
`;

const PrimaryBtn = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

const IconButton = styled.button<{ $active?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? "#ff5252" : "#f5f5f5")};
  color: ${({ $active }) => ($active ? "white" : "#666")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;

  &:hover {
    background: ${({ $active }) => ($active ? "#ff5252" : "#eee")};
    color: ${({ $active }) => ($active ? "white" : "#333")};
    transform: scale(1.05);
  }
`;

interface ProductListCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductListCard: React.FC<ProductListCardProps> = ({
  product,
  onClick,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);

  const discountPercent = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrls?.[0] || "/placeholder.jpg",
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
    <Card
      onClick={onClick || (() => router.push(`/productos/${product.slug}`))}
    >
      <ImageWrapper>
        <Image
          src={product.imageUrls?.[0] || "/placeholder.jpg"}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="240px"
        />
        {discountPercent > 0 && (
          <DiscountBadge>-{discountPercent}%</DiscountBadge>
        )}
      </ImageWrapper>

      <Content>
        {product.category && (
          <CategoryLabel>{product.category.name}</CategoryLabel>
        )}
        <ProductName>{product.name}</ProductName>
        <Description>{product.description}</Description>

        <Meta>
          {product.reviewCount > 0 && (
            <RatingRow>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={
                    i < Math.round(product.averageRating) ? "#FFB800" : "none"
                  }
                  color="#FFB800"
                />
              ))}
              <span>({product.reviewCount})</span>
            </RatingRow>
          )}
          <span style={{ fontSize: "0.8rem", color: "#999", fontWeight: 600 }}>
            {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
          </span>
        </Meta>
      </Content>

      <Sidebar>
        <PriceCol>
          <Price>${(product.discountPrice || product.price).toFixed(2)}</Price>
          {product.discountPrice && (
            <OldPrice>${product.price.toFixed(2)}</OldPrice>
          )}
        </PriceCol>

        <Actions>
          <PrimaryBtn onClick={handleAddToCart}>
            <ShoppingBag size={18} />
            Agregar
          </PrimaryBtn>
          <div style={{ display: "flex", gap: 10 }}>
            <IconButton
              $active={inWishlist}
              onClick={handleToggleWishlist}
              title="Favorito"
            >
              <Heart size={20} fill={inWishlist ? "white" : "none"} />
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/productos/${product.slug}`);
              }}
              title="Ver detalles"
            >
              <Info size={20} />
            </IconButton>
          </div>
        </Actions>
      </Sidebar>
    </Card>
  );
};
