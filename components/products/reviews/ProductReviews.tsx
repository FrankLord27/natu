"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ThumbsUp,
  CheckCircle2,
  Camera,
  Filter,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";

const Container = styled.div`
  max-width: 1200px;
  margin: 80px auto;
  padding: 0 24px;
`;

const Header = styled.div`
  display: flex;
  gap: 60px;
  margin-bottom: 60px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 40px;
  }
`;

const RatingSummary = styled.div`
  flex: 0 0 320px;
  background: white;
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.03);
  text-align: center;

  .big-score {
    font-size: 4.5rem;
    font-weight: 950;
    color: #1a1a1a;
    line-height: 1;
    margin-bottom: 10px;
  }

  .stars {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-bottom: 15px;
    color: #ffb800;
  }

  .total {
    font-size: 0.9rem;
    color: #888;
    font-weight: 600;
  }
`;

const RatingBarContainer = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RatingBar = ({ label, percent }: { label: string; percent: number }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 15,
      fontSize: "0.85rem",
      fontWeight: 700,
    }}
  >
    <span style={{ width: 60, textAlign: "left" }}>{label}</span>
    <div
      style={{
        flex: 1,
        height: 8,
        background: "#f0f0f0",
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ height: "100%", background: "#FFB800", borderRadius: 10 }}
      />
    </div>
    <span style={{ width: 40, textAlign: "right", color: "#888" }}>
      {percent}%
    </span>
  </div>
);

const ReviewList = styled.div`
  flex: 1;
`;

const ReviewCard = styled(motion.div)`
  padding: 40px 0;
  border-bottom: 1px solid #f0f0f0;

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  }

  .avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: ${(p) => p.theme.colors.primary};
  }

  .name {
    font-weight: 800;
    font-size: 1rem;
    color: #1a1a1a;
  }

  .verified {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #7bb32e;
    font-size: 0.75rem;
    font-weight: 800;
    margin-left: 10px;
  }

  .rating-stars {
    display: flex;
    gap: 4px;
    color: #ffb800;
    margin-bottom: 12px;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 10px;
  }
  p {
    font-size: 1rem;
    color: #555;
    line-height: 1.7;
    margin-bottom: 20px;
  }

  .images {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    img {
      width: 100px;
      height: 100px;
      border-radius: 12px;
      object-fit: cover;
      cursor: pointer;
      border: 2px solid transparent;
      transition: 0.3s;
      &:hover {
        border-color: ${(p) => p.theme.colors.primary};
        transform: scale(1.05);
      }
    }
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 20px;
    button {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #888;
      transition: 0.3s;
      &:hover {
        color: ${(p) => p.theme.colors.primary};
      }
    }
  }
`;

interface ReviewData {
  id: string;
  rating: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  imageUrls: string[];
  helpfulVotes: number;
  user: { name: string; avatarUrl?: string };
  createdAt: string;
}

export const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setReviews(d.reviews);
        setLoading(false);
      });
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const getPercent = (star: number) => {
    if (reviews.length === 0) return 0;
    const count = reviews.filter((r) => r.rating === star).length;
    return Math.round((count / reviews.length) * 100);
  };

  if (loading) return <div>Cargando reseñas...</div>;

  return (
    <Container>
      <Header>
        <RatingSummary>
          <div className="big-score">{avgRating}</div>
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                fill={i < Math.round(Number(avgRating)) ? "#FFB800" : "none"}
                stroke="#FFB800"
              />
            ))}
          </div>
          <div className="total">{reviews.length} valoraciones globales</div>

          <RatingBarContainer>
            {[5, 4, 3, 2, 1].map((num) => (
              <RatingBar
                key={num}
                label={`${num} estrellas`}
                percent={getPercent(num)}
              />
            ))}
          </RatingBarContainer>
        </RatingSummary>

        <ReviewList>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <h3 style={{ fontSize: "1.5rem", fontWeight: 900 }}>
              Opiniones de clientes
            </h3>
            <button
              style={{
                background: "#f5f5f5",
                border: "none",
                padding: "10px 20px",
                borderRadius: 12,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Filter size={18} /> Filtrar por relevancia
            </button>
          </div>

          <AnimatePresence>
            {reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  border: "2px dashed #eee",
                  borderRadius: 30,
                }}
              >
                <MessageSquare
                  size={48}
                  style={{ color: "#ccc", marginBottom: 20 }}
                />
                <p style={{ color: "#999", fontWeight: 600 }}>
                  Nadie ha reseñado este producto aún. <br />
                  ¡Sé el primero en compartir tu experiencia!
                </p>
              </motion.div>
            ) : (
              reviews.map((rv, i) => (
                <ReviewCard
                  key={rv.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="user-info">
                    <div className="avatar">{rv.user.name.charAt(0)}</div>
                    <div>
                      <span className="name">{rv.user.name}</span>
                      {rv.verifiedPurchase && (
                        <span className="verified">
                          <CheckCircle2 size={12} /> Compra verificada
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rating-stars">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        size={16}
                        fill={j < rv.rating ? "#FFB800" : "none"}
                        stroke="#FFB800"
                      />
                    ))}
                  </div>

                  <h4>{rv.title}</h4>
                  <p>{rv.content}</p>

                  {rv.imageUrls.length > 0 && (
                    <div className="images">
                      {rv.imageUrls.map((url, idx) => (
                        <SafeImage
                          key={idx}
                          src={url}
                          alt={`User review ${idx}`}
                          width={100}
                          height={100}
                        />
                      ))}
                    </div>
                  )}

                  <div className="actions">
                    <button>
                      <ThumbsUp size={16} /> Útil ({rv.helpfulVotes})
                    </button>
                    <button>Reportar abuso</button>
                  </div>
                </ReviewCard>
              ))
            )}
          </AnimatePresence>
        </ReviewList>
      </Header>
    </Container>
  );
};
