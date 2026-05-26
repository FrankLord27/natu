"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  CheckCircle2,
  Leaf,
  Droplets,
  Wheat,
  Play,
  Send,
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Product, Category, Testimonial, Video } from "@/types";
import Link from "next/link";
import Image from "next/image";

import { DynamicCarousel } from "@/components/home/DynamicCarousel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Section = styled.section<{ $bg?: string }>`
  padding: 120px 5%;
  position: relative;
  background: ${({ $bg }) => $bg || "transparent"};
  overflow: hidden;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 80px;
  h2 {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 900;
    color: ${(p) => p.theme.colors.text};
    margin-bottom: 20px;
    letter-spacing: -0.5px;
  }
  p {
    color: ${(p) => p.theme.colors.textLight};
    font-size: 1.2rem;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 50px 30px;
  border-radius: 30px;
  background: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 60px -15px rgba(123, 179, 46, 0.2);
    border-color: ${(p) => p.theme.colors.primaryPale};
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${(p) => p.theme.colors.primaryPale};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: ${(p) => p.theme.colors.primary};
  transform: rotate(-5deg);
  transition: transform 0.4s ease;
  ${FeatureCard}:hover & {
    transform: rotate(5deg) scale(1.1);
  }
`;

const CategoryCard = styled(motion(Link))`
  height: 420px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  color: white;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: 1;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.85) 0%,
      rgba(0, 0, 0, 0.2) 50%,
      transparent 100%
    );
    z-index: 2;
    transition: opacity 0.3s;
  }

  .content {
    position: relative;
    z-index: 3;
    transition: transform 0.4s ease;
  }

  h3 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 15px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  span {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    padding: 10px 20px;
    border-radius: 50px;
    transition:
      background 0.3s,
      color 0.3s;
  }

  &:hover {
    img {
      transform: scale(1.1);
    }
    .content {
      transform: translateY(-5px);
    }
    span {
      background: white;
      color: ${(p) => p.theme.colors.primary};
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  max-width: 1500px;
  margin: 0 auto;
`;

const HeroBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(123, 179, 46, 0.3);
  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 20px 40px rgba(123, 179, 46, 0.4);
  }
`;

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  max-width: 1100px;
  margin: 0 auto;
  @media (max-width: ${(p) => p.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const VideoCard = styled(motion.div)`
  aspect-ratio: 16/9;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary} 0%,
    ${(p) => p.theme.colors.primaryDark} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    transition: background 0.3s;
  }

  &:hover {
    transform: scale(1.02);
    &::before {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .content {
    position: relative;
    z-index: 2;
    text-align: center;
  }
  h4 {
    font-size: 1.3rem;
    margin-top: 20px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  p {
    opacity: 0.9;
    font-size: 1rem;
    margin-top: 5px;
  }
`;

const PlayBtn = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  ${VideoCard}:hover & {
    transform: scale(1.15);
    background: white;
    svg {
      fill: ${(p) => p.theme.colors.primary};
    }
  }
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const TestCard = styled(motion.div)`
  background: white;
  padding: 50px 40px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  position: relative;

  &::before {
    content: '"';
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 100px;
    line-height: 1;
    color: ${(p) => p.theme.colors.primaryPale};
    font-family: serif;
    opacity: 0.5;
  }
`;

const TestAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primaryPale};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 32px;
  font-weight: 700;
  color: ${(p) => p.theme.colors.primary};
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const CTASection = styled.section`
  padding: 120px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${(p) => p.theme.colors.primary} 0%,
    ${(p) => p.theme.colors.primaryDark} 100%
  );
`;

const CTAContent = styled(motion.div)`
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
  h2 {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 900;
    color: white;
    margin-bottom: 25px;
    line-height: 1.1;
  }
  p {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 50px;
    line-height: 1.6;
  }
`;

const CTABtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  background: white;
  color: ${(p) => p.theme.colors.primary};
  padding: 22px 48px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 800;
  transition: all 0.3s ease;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  }
`;

const NewsletterSection = styled(Section)`
  text-align: center;
  background-image: linear-gradient(to bottom, #f8faf5, #ffffff);
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 15px;
  max-width: 600px;
  margin: 0 auto;
  @media (max-width: ${(p) => p.theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 20px 30px;
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: 20px;
  font-size: 1.1rem;
  transition: all 0.3s;
  background: white;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 4px rgba(123, 179, 46, 0.1);
  }
`;

const NewsletterBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px 40px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border-radius: 20px;
  font-weight: 800;
  font-size: 1.1rem;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(123, 179, 46, 0.3);
  }
`;

const TrustBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  padding: 80px 5%;
  border-top: 1px solid ${(p) => p.theme.colors.border};
  background: white;
`;

const TrustItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: ${(p) => p.theme.colors.textLight};
  letter-spacing: 1px;
`;

interface Props {
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  videos: Video[];
}

export function HomeClient({
  products,
  categories,
  testimonials,
  videos,
}: Props) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail("");
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <DynamicCarousel />

      {/* FEATURES */}
      <Section $bg="#fff">
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>¿Por qué elegir NaturaJM?</h2>
          <p>
            Nos dedicamos a proporcionar productos naturales de la más alta
            calidad para tu bienestar
          </p>
        </SectionHeader>
        <FeaturesGrid>
          {[
            {
              icon: <Leaf size={40} />,
              title: "100% Natural",
              desc: "Todos nuestros productos son elaborados con ingredientes completamente naturales y orgánicos.",
            },
            {
              icon: <Droplets size={40} />,
              title: "Alta Calidad",
              desc: "Seleccionamos cuidadosamente cada ingrediente para garantizar la máxima calidad.",
            },
            {
              icon: <Wheat size={40} />,
              title: "Salud y Bienestar",
              desc: "Nuestros productos están diseñados para mejorar tu salud de manera natural.",
            },
          ].map((f, i) => (
            <FeatureCard
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <FeatureIcon>{f.icon}</FeatureIcon>
              <h3
                style={{
                  fontSize: "1.4rem",
                  fontWeight: 800,
                  marginBottom: 15,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: "1rem", color: "#666", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <Section $bg="#fcfcfc">
          <SectionHeader
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Nuestros Mundos</h2>
            <p>
              Explora nuestras líneas de productos creadas especialmente para tu
              bienestar integral.
            </p>
          </SectionHeader>
          <div style={{ padding: "20px 0" }}>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              navigation
              breakpoints={{
                640: { slidesPerView: 2 },
                968: { slidesPerView: 3 },
                1200: { slidesPerView: 4 },
              }}
              style={{ padding: "0 10px 50px 10px" }}
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <CategoryCard href={`/tienda?category=${cat.name}`}>
                    <Image
                      src={
                        cat.imageUrl ||
                        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80"
                      }
                      alt={cat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="content">
                      <h3>{cat.name}</h3>
                      <span>
                        Ver Colección <ArrowRight size={16} />
                      </span>
                    </div>
                  </CategoryCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Section>
      )}

      {/* PRODUCTS */}
      {products.length > 0 && (
        <Section>
          <SectionHeader
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Nuevas Llegadas</h2>
            <p>
              Lo último de nuestra producción artesanal directamente a tu
              puerta.
            </p>
          </SectionHeader>
          <ProductGrid>
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </ProductGrid>
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <HeroBtn href="/tienda">
              Ver Todos los Productos <ArrowRight size={20} />
            </HeroBtn>
          </div>
        </Section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <Section $bg="linear-gradient(135deg, #f8faf5 0%, #f0f4ec 100%)">
          <SectionHeader
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Conoce Más</h2>
            <p>
              Mira nuestros videos sobre nuestros productos y su elaboración
            </p>
          </SectionHeader>
          <VideosGrid>
            {videos.map((v, i) => (
              <VideoCard
                key={v.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="content">
                  <PlayBtn>
                    <Play size={35} fill="white" />
                  </PlayBtn>
                  <h4>{v.title}</h4>
                  <p>{v.description}</p>
                </div>
              </VideoCard>
            ))}
          </VideosGrid>
        </Section>
      )}

      {/* TESTIMONIALS */}
      <Section $bg="#fff">
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Voces de Bienestar</h2>
          <p>
            Únete a miles de personas que ya transformaron su vida con NaturaJM.
          </p>
        </SectionHeader>
        <TestGrid>
          {testimonials.map((t, i) => (
            <TestCard
              key={t.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <TestAvatar>{t.name.charAt(0)}</TestAvatar>
              <h4
                style={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  marginBottom: 10,
                }}
              >
                {t.name}
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 4,
                  marginBottom: 20,
                }}
              >
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={18} fill="#FFB800" color="#FFB800" />
                ))}
              </div>
              <p
                style={{
                  fontStyle: "italic",
                  color: "#555",
                  lineHeight: 1.7,
                  fontSize: "1.05rem",
                }}
              >
                &quot;{t.content}&quot;
              </p>
            </TestCard>
          ))}
        </TestGrid>
      </Section>

      {/* NEWSLETTER */}
      <NewsletterSection>
        <SectionHeader
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Recibe Ofertas Exclusivas</h2>
          <p>
            Suscríbete a nuestro newsletter y sé el primero en enterarte de
            nuestras promociones.
          </p>
        </SectionHeader>
        {subscribed ? (
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: "1.5rem", color: "#7BB32E", fontWeight: 800 }}
          >
            ✓ ¡Gracias por suscribirte!
          </motion.p>
        ) : (
          <NewsletterForm onSubmit={handleNewsletter}>
            <NewsletterInput
              type="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NewsletterBtn type="submit">
              <Send size={20} /> Suscribirse
            </NewsletterBtn>
          </NewsletterForm>
        )}
      </NewsletterSection>

      {/* CTA */}
      <CTASection>
        <CTAContent
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>¿Listo para tu transformación?</h2>
          <p>
            Explora nuestra tienda y encuentra los productos perfectos para tu
            bienestar
          </p>
          <CTABtn href="/tienda">
            Ver todos los productos <ArrowRight size={24} />
          </CTABtn>
        </CTAContent>
      </CTASection>

      {/* TRUST */}
      <TrustBar>
        {[
          "Envío a todo el País",
          "Pago 100% Seguro",
          "Calidad Orgánica",
          "Garantía NaturaJM",
        ].map((text, i) => (
          <TrustItem
            key={text}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <CheckCircle2 size={24} color="#7BB32E" /> {text}
          </TrustItem>
        ))}
      </TrustBar>
    </>
  );
}
