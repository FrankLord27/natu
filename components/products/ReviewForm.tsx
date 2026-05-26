"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { Star, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { submitReview } from "@/lib/actions";
import { motion, AnimatePresence } from "framer-motion";

const FormWrap = styled.div`
  background: white;
  border-radius: 16px;
  padding: 25px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 20px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const StarBtn = styled.button<{ $active: boolean }>`
  color: ${(p) => (p.$active ? "#FFB800" : "#e0e0e0")};
  transition: all 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #f0f0f0;
  margin-bottom: 15px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #f0f0f0;
  margin-bottom: 20px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const SubmitBtn = styled(motion.button)`
  padding: 12px 25px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Message = styled(motion.div)<{ $type: "success" | "error" }>`
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${(p) => (p.$type === "success" ? "#e8f5e9" : "#ffebee")};
  color: ${(p) => (p.$type === "success" ? "#2e7d32" : "#c62828")};
`;

const LoginPrompt = styled.div`
  text-align: center;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 16px;
  border: 1px dashed #ddd;
  p {
    margin-bottom: 15px;
    color: #666;
    font-size: 0.95rem;
  }
  a {
    font-weight: 700;
    color: ${(p) => p.theme.colors.primary};
    &:hover {
      text-decoration: underline;
    }
  }
`;

interface Props {
  productId: string;
  onSubmitted?: () => void;
}

export const ReviewForm = ({ productId, onSubmitted }: Props) => {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (
    status !== "authenticated" ||
    (session?.user as any)?.userType !== "customer"
  ) {
    return (
      <LoginPrompt>
        <Star size={32} color="#ccc" style={{ marginBottom: 15 }} />
        <p>
          Tu opinión es muy valiosa para nosotros. <br />
          Inicia sesión para compartir tu experiencia con este producto.
        </p>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            background: "#1a1a1a",
            color: "white",
            padding: "12px 25px",
            borderRadius: 12,
            textDecoration: "none",
            fontWeight: 800,
          }}
        >
          Iniciar Sesión Ahora
        </Link>
      </LoginPrompt>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    setLoading(true);
    setMsg(null);

    const res = await submitReview({ productId, rating, title, content });

    if (res.success) {
      setMsg({ type: "success", text: "¡Gracias por tu reseña!" });
      setTitle("");
      setContent("");
      setRating(5);
      if (onSubmitted) onSubmitted();
    } else {
      setMsg({ type: "error", text: res.error || "Error al enviar la reseña" });
    }
    setLoading(false);
  };

  return (
    <FormWrap>
      <Title>Deja tu opinión</Title>

      <AnimatePresence>
        {msg && (
          <Message
            $type={msg.type}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {msg.text}
          </Message>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            marginBottom: 5,
            fontSize: "0.9rem",
            color: "#666",
            fontWeight: 600,
          }}
        >
          Calificación:
        </div>
        <StarContainer>
          {[...Array(5)].map((_, i) => (
            <StarBtn
              key={i}
              type="button"
              $active={i < (hoverRating || rating)}
              onClick={() => setRating(i + 1)}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                size={24}
                fill={i < (hoverRating || rating) ? "#FFB800" : "none"}
              />
            </StarBtn>
          ))}
        </StarContainer>

        <Input
          placeholder="Título de tu reseña (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          placeholder="Cuéntanos tu experiencia con el producto..."
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <SubmitBtn type="submit" disabled={loading} whileTap={{ scale: 0.95 }}>
          {loading ? (
            "Enviando..."
          ) : (
            <>
              <Send size={18} />
              Enviar Reseña
            </>
          )}
        </SubmitBtn>
      </form>
    </FormWrap>
  );
};
