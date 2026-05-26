"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Star,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getProductBySlug } from "@/lib/actions";
import { Product, Review } from "@/types";
import { ReviewForm } from "@/components/products/ReviewForm";

const Page = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 5%;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  font-size: 0.85rem;
  color: #999;
  a {
    transition: color 0.2s;
    &:hover {
      color: ${(p) => p.theme.colors.primary};
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  @media (max-width: ${(p) => p.theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const Gallery = styled.div``;
const MainImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 24px;
  overflow: hidden;
  background: #f5f5f5;
  img {
    transition: transform 0.5s ease;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

const Thumbs = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;
const Thumb = styled.button<{ $active: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 3px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  transition: all 0.3s;
`;

const Info = styled.div``;
const CategoryLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${(p) => p.theme.colors.primary};
  background: ${(p) => p.theme.colors.primaryPale};
  padding: 6px 14px;
  border-radius: 50px;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  color: ${(p) => p.theme.colors.text};
  margin: 20px 0 15px;
  line-height: 1.2;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  .price {
    font-size: 2rem;
    font-weight: 900;
    color: ${(p) => p.theme.colors.primary};
  }
  .old {
    font-size: 1.3rem;
    color: #999;
    text-decoration: line-through;
  }
  .badge {
    background: ${(p) => p.theme.colors.accent};
    color: white;
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 700;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  span {
    font-size: 0.9rem;
    color: #666;
    font-weight: 600;
  }
`;

const Description = styled.p`
  color: ${(p) => p.theme.colors.textLight};
  line-height: 1.8;
  margin-bottom: 30px;
  font-size: 1rem;
`;

const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const QtyBox = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: #f5f5f5;
  padding: 8px 14px;
  border-radius: 14px;
  button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: white;
    transition: all 0.2s;
    &:hover {
      background: ${(p) => p.theme.colors.primary};
      color: white;
    }
  }
  span {
    font-size: 1.1rem;
    font-weight: 800;
    min-width: 30px;
    text-align: center;
  }
`;

const AddBtn = styled(motion.button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  padding: 16px 30px;
  border-radius: 14px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s;
  &:hover {
    filter: brightness(1.1);
  }
`;

const WishBtn = styled.button<{ $active: boolean }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  border: 2px solid ${({ $active }) => ($active ? "#ff5252" : "#e0e0e0")};
  background: ${({ $active }) => ($active ? "#fff0f0" : "white")};
  color: ${({ $active }) => ($active ? "#ff5252" : "#999")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
`;

const Trust = styled.div`
  display: flex;
  gap: 25px;
  padding: 25px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 30px;
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    flex-direction: column;
    gap: 15px;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  svg {
    color: ${(p) => p.theme.colors.primary};
  }
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 25px;
  gap: 25px;
`;
const TabBtn = styled.button<{ $active: boolean }>`
  padding: 12px 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : "#999")};
  border-bottom: 3px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  transition: all 0.3s;
  margin-bottom: -2px;
`;

const TabContent = styled.div`
  line-height: 1.8;
  color: ${(p) => p.theme.colors.textLight};
  font-size: 0.95rem;
  h4 {
    font-weight: 700;
    color: ${(p) => p.theme.colors.text};
    margin: 15px 0 8px;
  }
`;

const ReviewCard = styled.div`
  padding: 20px;
  background: #fcfcfc;
  border-radius: 14px;
  border: 1px solid #f0f0f0;
  margin-bottom: 15px;
`;

import { ProductReviews } from "@/components/products/reviews/ProductReviews";

const TabSection = styled.div`
  margin-top: 80px;
  border-top: 1px solid #f0f0f0;
  padding-top: 40px;
`;

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart, setIsCartOpen } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    getProductBySlug(params.slug).then((res) => {
      if (res.success) setProduct(res.data as Product);
    });
  }, [params.slug]);

  if (!product)
    return (
      <Page
        style={{ textAlign: "center", padding: "100px 20px", color: "#999" }}
      >
        Cargando...
      </Page>
    );

  const inWishlist = isInWishlist(product.id);
  const discount = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.imageUrls?.[0] || "/placeholder.jpg",
        slug: product.slug,
      });
    }
    setIsCartOpen(true);
  };

  return (
    <Page>
      <Breadcrumb>
        <Link href="/">Inicio</Link>
        <ChevronRight size={14} />
        <Link href="/tienda">Tienda</Link>
        <ChevronRight size={14} />
        <span style={{ color: "#333" }}>{product.name}</span>
      </Breadcrumb>

      <Grid>
        <Gallery>
          <MainImage>
            <Image
              src={product.imageUrls?.[selectedImage] || "/placeholder.jpg"}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </MainImage>
          {product.imageUrls?.length > 1 && (
            <Thumbs>
              {product.imageUrls.map((url, i) => (
                <Thumb
                  key={i}
                  $active={selectedImage === i}
                  onClick={() => setSelectedImage(i)}
                >
                  <Image
                    src={url}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="80px"
                  />
                </Thumb>
              ))}
            </Thumbs>
          )}
        </Gallery>

        <Info>
          {product.category && (
            <CategoryLabel>{product.category.name}</CategoryLabel>
          )}
          <Title>{product.name}</Title>
          <PriceRow>
            <span className="price">
              ${(product.discountPrice || product.price).toFixed(2)}
            </span>
            {product.discountPrice && (
              <span className="old">${product.price.toFixed(2)}</span>
            )}
            {discount > 0 && <span className="badge">-{discount}%</span>}
          </PriceRow>

          {product.reviewCount > 0 && (
            <Rating>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={
                    i < Math.round(product.averageRating) ? "#FFB800" : "none"
                  }
                  color="#FFB800"
                />
              ))}
              <span>
                {product.averageRating.toFixed(1)} ({product.reviewCount}{" "}
                reseñas)
              </span>
            </Rating>
          )}

          <Description>{product.description}</Description>

          <AddRow>
            <QtyBox>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>
                <Plus size={16} />
              </button>
            </QtyBox>
            <AddBtn onClick={handleAddToCart} whileTap={{ scale: 0.95 }}>
              <ShoppingBag size={20} /> Agregar al Carrito
            </AddBtn>
            <WishBtn
              $active={inWishlist}
              onClick={() =>
                inWishlist
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)
              }
            >
              <Heart size={20} fill={inWishlist ? "#ff5252" : "none"} />
            </WishBtn>
          </AddRow>

          <Trust>
            <TrustItem>
              <Truck size={20} /> Envío seguro
            </TrustItem>
            <TrustItem>
              <Shield size={20} /> Pago protegido
            </TrustItem>
            <TrustItem>
              <RotateCcw size={20} /> Garantía NaturaJM
            </TrustItem>
          </Trust>

          <TabButtons>
            <TabBtn
              $active={activeTab === "description"}
              onClick={() => setActiveTab("description")}
            >
              Detalles
            </TabBtn>
            {(product.ingredients || product.howToUse) && (
              <TabBtn
                $active={activeTab === "info"}
                onClick={() => setActiveTab("info")}
              >
                Ingredientes y Uso
              </TabBtn>
            )}
            <TabBtn
              $active={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
            >
              Reseñas ({product.reviewCount})
            </TabBtn>
          </TabButtons>

          <TabContent>
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p>{product.description}</p>
                {product.brand && (
                  <div style={{ marginTop: 20 }}>
                    <h4 style={{ fontSize: "0.9rem", color: "#333" }}>Marca</h4>
                    <p>{product.brand}</p>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === "info" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {product.ingredients && (
                  <div style={{ marginBottom: 25 }}>
                    <h4
                      style={{
                        fontWeight: 800,
                        color: "#1a1a1a",
                        marginBottom: 10,
                      }}
                    >
                      Ingredientes Clave
                    </h4>
                    <p>{product.ingredients}</p>
                  </div>
                )}
                {product.howToUse && (
                  <div>
                    <h4
                      style={{
                        fontWeight: 800,
                        color: "#1a1a1a",
                        marginBottom: 10,
                      }}
                    >
                      Modo de Empleo
                    </h4>
                    <p>{product.howToUse}</p>
                  </div>
                )}
              </motion.div>
            )}
            {activeTab === "reviews" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProductReviews productId={product.id} />
                <div
                  style={{
                    marginTop: 40,
                    borderTop: "1px solid #eee",
                    paddingTop: 40,
                  }}
                >
                  <ReviewForm
                    productId={product.id}
                    onSubmitted={() =>
                      getProductBySlug(params.slug).then(
                        (res) => res.success && setProduct(res.data as Product),
                      )
                    }
                  />
                </div>
              </motion.div>
            )}
          </TabContent>
        </Info>
      </Grid>
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image:
                product.imageUrls?.[0] ||
                "https://naturajm.com/placeholder.jpg",
              description: product.description,
              brand: {
                "@type": "Brand",
                name: "NaturaJM",
              },
              offers: {
                "@type": "Offer",
                url: `https://naturajm.com/productos/${product.slug}`,
                priceCurrency: "DOP",
                price: product.price,
                availability:
                  product.stock > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
              aggregateRating:
                product.averageRating > 0
                  ? {
                      "@type": "AggregateRating",
                      ratingValue: product.averageRating,
                      reviewCount: product.reviewCount,
                    }
                  : undefined,
            }),
          }}
        />
      )}
    </Page>
  );
}
