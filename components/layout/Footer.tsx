"use client";

import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { Leaf, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";

const FooterWrapper = styled.footer`
  background: #1a1a1a;
  color: #ccc;
  padding: 80px 5% 30px;
`;

const FooterGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 60px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterBrand = styled.div`
  h3 {
    font-size: 1.6rem;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 15px;
    span {
      color: white;
      font-weight: 400;
    }
  }
  p {
    font-size: 0.9rem;
    line-height: 1.8;
    opacity: 0.7;
    max-width: 300px;
  }
`;

const FooterSection = styled.div`
  h4 {
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: white;
    margin-bottom: 25px;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  a {
    font-size: 0.9rem;
    opacity: 0.6;
    transition: all 0.3s ease;
    &:hover {
      opacity: 1;
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  opacity: 0.6;
  margin-bottom: 12px;
`;

const Socials = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const SocialBtn = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    transform: translateY(-3px);
  }
`;

const FooterBottom = styled.div`
  max-width: 1400px;
  margin: 60px auto 0;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.8rem;
  opacity: 0.5;
`;

export const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMsg("");

    try {
      const { subscribeToNewsletter } = await import("@/lib/actions");
      const res = await subscribeToNewsletter(email, "footer");

      if (res.success) {
        setMsg(res.message || "¡Gracias! Te has suscrito.");
        setEmail("");
      } else {
        setMsg(res.error || "Ocurrió un error.");
      }
    } catch (err) {
      setMsg("Error de conexión.");
    }
    setLoading(false);
  };

  return (
    <FooterWrapper>
      <FooterGrid>
        <FooterBrand>
          <h3>
            Natura<span>JM</span>
          </h3>
          <p>
            Productos 100% naturales para tu bienestar. Aceites, harinas y
            cosméticos de la más alta calidad, directo a tu puerta.
          </p>
          <Socials>
            <SocialBtn
              href="https://instagram.com/naturajm"
              target="_blank"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </SocialBtn>
            <SocialBtn
              href="https://facebook.com/naturajm"
              target="_blank"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </SocialBtn>
          </Socials>
        </FooterBrand>

        <FooterSection>
          <h4>Tienda</h4>
          <ul>
            <li>
              <Link href="/tienda">Todos los Productos</Link>
            </li>
            <li>
              <Link href="/tienda?category=Aceites">Aceites</Link>
            </li>
            <li>
              <Link href="/tienda?category=Harinas">Harinas</Link>
            </li>
            <li>
              <Link href="/tienda?category=Cosméticos">Cosméticos</Link>
            </li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>Empresa</h4>
          <ul>
            <li>
              <Link href="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link href="/contacto">Contacto</Link>
            </li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h4>Suscríbete</h4>
          <p
            style={{ fontSize: "0.85rem", marginBottom: "15px", color: "#aaa" }}
          >
            Recibe ofertas exclusivas y novedades.
          </p>
          <form
            onSubmit={handleSubscribe}
            style={{ display: "flex", gap: "8px" }}
          >
            <input
              type="email"
              placeholder="Tu correo..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #333",
                background: "#222",
                color: "white",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "0 15px",
                borderRadius: "4px",
                border: "none",
                background: "#7BB32E",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "..." : <Mail size={16} />}
            </button>
          </form>
          {msg && (
            <p
              style={{
                marginTop: "10px",
                fontSize: "0.8rem",
                color: msg.includes("Error") ? "#ff5252" : "#7BB32E",
              }}
            >
              {msg}
            </p>
          )}
        </FooterSection>
      </FooterGrid>

      <FooterBottom>
        <span>
          © {new Date().getFullYear()} NaturaJM V3. Todos los derechos
          reservados.
        </span>
        <span>
          Hecho con{" "}
          <Leaf size={12} style={{ display: "inline", color: "#7BB32E" }} /> en
          RD
        </span>
      </FooterBottom>
    </FooterWrapper>
  );
};
