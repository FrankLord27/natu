'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ArrowRight, Star, CheckCircle2, Leaf, Droplets, Wheat, Play, ArrowDown, Send } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { getProducts, getCategories } from '@/lib/actions';
import { Product, Category, Testimonial, Video } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

import { DynamicCarousel } from '@/components/home/DynamicCarousel';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ==================== ANIMATION COMPONENTS ====================

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{
        scaleX,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: '#7BB32E',
        transformOrigin: '0%',
        zIndex: 1000
      }}
    />
  );
};

const Reveal = ({ children, width = "fit-content", delay = 0.25 }: { children: React.ReactNode, width?: "fit-content" | "100%", delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const mainControls = useSpring(isInView ? 1 : 0, { stiffness: 50, damping: 20 });
  
  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const ParallaxLeaf = ({ top, left, speed = 1, size = 40, rotate = 0 }: { top: string, left: string, speed?: number, size?: number, rotate?: number }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, speed * 200]);
  const rotation = useTransform(scrollY, [0, 1000], [rotate, rotate + 45]);
  
  return (
    <motion.div style={{ position: 'absolute', top, left, y, rotate: rotation, zIndex: 0, opacity: 0.15, color: '#7BB32E' }}>
      <Leaf size={size} />
    </motion.div>
  );
};

// ==================== HERO ====================
const HeroSection = styled.section`
  min-height: 95vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: radial-gradient(circle at 50% 50%, ${p => p.theme.colors.backgroundWarm} 0%, ${p => p.theme.colors.primaryPale} 100%);
  position: relative; overflow: hidden; padding: 60px 24px;
`;

const HeroContent = styled.div`text-align: center; max-width: 900px; z-index: 2; position: relative;`;

const HeroTitle = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem); 
  font-weight: 900; 
  color: ${p => p.theme.colors.primaryDark}; 
  margin-bottom: 24px; 
  line-height: 1.1;
  letter-spacing: -1px;
  background: linear-gradient(135deg, ${p => p.theme.colors.primaryDark} 0%, ${p => p.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(123,179,46,0.15);
`;

const HeroSub = styled(motion.p)`
  font-size: clamp(1rem, 2vw, 1.25rem); 
  color: ${p => p.theme.colors.textLight}; 
  margin-bottom: 40px; 
  line-height: 1.6;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const HeroBtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 12px;
  background: ${p => p.theme.colors.primary}; color: white;
  padding: 18px 40px; border-radius: 50px; font-size: 1.1rem; font-weight: 700;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  box-shadow: 0 10px 25px rgba(123,179,46,0.3);
  position: relative; overflow: hidden;
  
  &::before {
    content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: 0.5s;
  }

  &:hover { 
    transform: translateY(-5px) scale(1.02); 
    box-shadow: 0 20px 40px rgba(123,179,46,0.4); 
    &::before { left: 100%; }
  }
`;

// ==================== SECTIONS ====================
const Section = styled.section<{ $bg?: string }>`
  padding: 120px 5%; position: relative;
  background: ${({ $bg }) => $bg || 'transparent'};
  overflow: hidden;
`;

const SectionHeader = styled(motion.div)`
  text-align: center; margin-bottom: 80px;
  h2 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: ${p => p.theme.colors.text}; margin-bottom: 20px; letter-spacing: -0.5px; }
  p { color: ${p => p.theme.colors.textLight}; font-size: 1.2rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
`;

// ==================== FEATURES ====================
const FeaturesGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; max-width: 1200px; margin: 0 auto;
  @media (max-width: ${p => p.theme.breakpoints.md}) { grid-template-columns: 1fr; gap: 30px; }
`;

const FeatureCard = styled(motion.div)`
  text-align: center; padding: 50px 30px; border-radius: 30px; background: white;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.03);
  
  &:hover { transform: translateY(-10px); box-shadow: 0 20px 60px -15px rgba(123,179,46,0.2); border-color: ${p => p.theme.colors.primaryPale}; }
`;

const FeatureIcon = styled.div`
  width: 80px; height: 80px; border-radius: 20px; background: ${p => p.theme.colors.primaryPale};
  display: flex; align-items: center; justify-content: center; margin: 0 auto 25px;
  color: ${p => p.theme.colors.primary};
  transform: rotate(-5deg); transition: transform 0.4s ease;
  ${FeatureCard}:hover & { transform: rotate(5deg) scale(1.1); }
`;

// ==================== CATEGORIES ====================
const CategoryGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; max-width: 1500px; margin: 0 auto;
  @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const CategoryCard = styled(motion(Link))`
  height: 420px; border-radius: 30px; overflow: hidden; position: relative;
  display: flex; flex-direction: column; justify-content: flex-end; padding: 40px; color: white;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  
  img { 
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; 
    transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1); z-index: 1; 
  }
  
  &::after { 
    content: ''; position: absolute; inset: 0; 
    background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%); 
    z-index: 2; transition: opacity 0.3s;
  }
  
  .content { position: relative; z-index: 3; transform: translateY(0); transition: transform 0.4s ease; }
  
  h3 { font-size: 2rem; font-weight: 800; margin-bottom: 15px; text-shadow: 0 4px 8px rgba(0,0,0,0.3); }
  
  span { 
    display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.9rem; 
    text-transform: uppercase; letter-spacing: 1px; 
    background: rgba(255,255,255,0.2); backdrop-filter: blur(5px);
    padding: 10px 20px; border-radius: 50px;
    transition: background 0.3s, color 0.3s;
  }
  
  &:hover {
    img { transform: scale(1.1); }
    .content { transform: translateY(-5px); }
    span { background: white; color: ${p => p.theme.colors.primary}; }
  }
`;

// ==================== PRODUCTS ====================
const ProductGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px; max-width: 1500px; margin: 0 auto;
`;

// ==================== VIDEOS ====================
const VideosGrid = styled.div`
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; max-width: 1100px; margin: 0 auto;
  @media (max-width: ${p => p.theme.breakpoints.md}) { grid-template-columns: 1fr; }
`;

const VideoCard = styled(motion.div)`
  aspect-ratio: 16/9; border-radius: 30px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  background: linear-gradient(135deg, ${p => p.theme.colors.primary} 0%, ${p => p.theme.colors.primaryDark} 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; cursor: pointer;
  position: relative;
  
  &::before {
    content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.2); transition: background 0.3s;
  }
  
  &:hover { 
    transform: scale(1.02); 
    &::before { background: rgba(0,0,0,0.1); }
  }
  
  .content { position: relative; z-index: 2; text-align: center; }
  h4 { font-size: 1.3rem; margin-top: 20px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
  p { opacity: 0.9; font-size: 1rem; margin-top: 5px; }
`;

const PlayBtn = styled.div`
  width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.25);
  backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.4);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  ${VideoCard}:hover & { transform: scale(1.15); background: white; svg { fill: ${p => p.theme.colors.primary}; } }
`;

// ==================== TESTIMONIALS ====================
const TestGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1200px; margin: 0 auto;
  @media (max-width: 992px) { grid-template-columns: 1fr; }
`;

const TestCard = styled(motion.div)`
  background: white; padding: 50px 40px; border-radius: 30px; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.03);
  position: relative;
  
  &::before {
    content: '"'; position: absolute; top: 30px; left: 30px; font-size: 100px; 
    line-height: 1; color: ${p => p.theme.colors.primaryPale}; font-family: serif; opacity: 0.5;
  }
`;

const TestAvatar = styled.div`
  width: 80px; height: 80px; border-radius: 50%; background: ${p => p.theme.colors.primaryPale};
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
  font-size: 32px; font-weight: 700; color: ${p => p.theme.colors.primary};
  border: 4px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

// ==================== CTA ====================
const CTASection = styled.section`
  padding: 120px 24px; text-align: center; position: relative; overflow: hidden;
  background: linear-gradient(135deg, ${p => p.theme.colors.primary} 0%, ${p => p.theme.colors.primaryDark} 100%);
`;

const CTABgPattern = styled(motion.div)`
  position: absolute; inset: 0; opacity: 0.1;
  background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0);
  background-size: 40px 40px;
`;

const CTAContent = styled(motion.div)`
  position: relative; z-index: 2; max-width: 700px; margin: 0 auto;
  h2 { font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: white; margin-bottom: 25px; line-height: 1.1; }
  p { font-size: 1.25rem; color: rgba(255,255,255,0.9); margin-bottom: 50px; line-height: 1.6; }
`;

const CTABtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 15px; background: white;
  color: ${p => p.theme.colors.primary}; padding: 22px 48px; border-radius: 50px;
  font-size: 1.2rem; font-weight: 800; transition: all 0.3s ease;
  box-shadow: 0 15px 35px rgba(0,0,0,0.2);
  &:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 25px 50px rgba(0,0,0,0.3); }
`;

// ==================== NEWSLETTER ====================
const NewsletterSection = styled(Section)`
  text-align: center;
  background-image: linear-gradient(to bottom, #f8faf5, #ffffff);
`;

const NewsletterForm = styled.form`
  display: flex; gap: 15px; max-width: 600px; margin: 0 auto;
  @media (max-width: ${p => p.theme.breakpoints.sm}) { flex-direction: column; }
`;

const NewsletterInput = styled.input`
  flex: 1; padding: 20px 30px; border: 2px solid ${p => p.theme.colors.border}; border-radius: 20px;
  font-size: 1.1rem; transition: all 0.3s; background: white;
  &:focus { border-color: ${p => p.theme.colors.primary}; outline: none; box-shadow: 0 0 0 4px rgba(123,179,46,0.1); }
`;

const NewsletterBtn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 10px; padding: 20px 40px;
  background: ${p => p.theme.colors.primary}; color: white; border-radius: 20px;
  font-weight: 800; font-size: 1.1rem; transition: all 0.3s;
  &:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(123,179,46,0.3); }
`;

// ==================== TRUST ====================
const TrustBar = styled.div`
  display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; padding: 80px 5%;
  border-top: 1px solid ${p => p.theme.colors.border}; background: white;
`;

const TrustItem = styled(motion.div)`
  display: flex; align-items: center; gap: 15px; font-weight: 800;
  text-transform: uppercase; font-size: 0.9rem; color: ${p => p.theme.colors.textLight}; letter-spacing: 1px;
`;

// ==================== COMPONENT ====================


export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()]);
      if (prodRes.success) setProducts((prodRes.data as Product[]).slice(0, 8));
      if (catRes.success) setCategories((catRes.data as Category[]).slice(0, 4));
    };
    fetchData();

    fetch('/api/testimonials').then(r => r.json()).then(d => setTestimonials(d.slice?.(0, 3) || []))
      .catch(() => setTestimonials([
        { id: '1', name: 'Andrea Martínez', content: 'El aceite de coco es de otro mundo, se nota la pureza. Mi piel nunca estuvo mejor.', rating: 5, isActive: true, order: 1, createdAt: new Date() },
        { id: '2', name: 'Roberto Gómez', content: 'Las harinas son perfectas para mis recetas keto. ¡Por fin un proveedor confiable!', rating: 5, isActive: true, order: 2, createdAt: new Date() },
        { id: '3', name: 'Elena Paz', content: 'Servicio impecable y productos de primera. El sérum facial es indispensable.', rating: 5, isActive: true, order: 3, createdAt: new Date() },
      ]));

    fetch('/api/videos').then(r => r.json()).then(d => setVideos(d.slice?.(0, 2) || []))
      .catch(() => setVideos([
        { id: '1', title: 'Conoce Nuestros Productos', url: '#', description: 'Descubre la calidad de nuestros productos naturales', order: 1, isActive: true, createdAt: new Date() },
        { id: '2', title: 'Testimonios de Clientes', url: '#', description: 'Lo que dicen nuestros clientes', order: 2, isActive: true, createdAt: new Date() },
      ]));
  }, []);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setSubscribed(true);
      setEmail('');
    } catch { /* ignore */ }
  };

  return (
    <>
      <ScrollProgress />
      
      {/* HERO */}
      <DynamicCarousel />

      {/* FEATURES */}
      <Section $bg="#fff" style={{ position: 'relative' }}>
        <ParallaxLeaf top="10%" left="5%" speed={0.5} size={50} rotate={20} />
        <ParallaxLeaf top="60%" left="90%" speed={-0.3} size={40} rotate={150} />
        <Reveal width="100%">
          <SectionHeader>
            <h2>¿Por qué elegir NaturaJM?</h2>
            <p>Nos dedicamos a proporcionar productos naturales de la más alta calidad para tu bienestar</p>
          </SectionHeader>
          <FeaturesGrid>
            {[
              { icon: <Leaf size={40} />, title: '100% Natural', desc: 'Todos nuestros productos son elaborados con ingredientes completamente naturales y orgánicos.' },
              { icon: <Droplets size={40} />, title: 'Alta Calidad', desc: 'Seleccionamos cuidadosamente cada ingrediente para garantizar la máxima calidad.' },
              { icon: <Wheat size={40} />, title: 'Salud y Bienestar', desc: 'Nuestros productos están diseñados para mejorar tu salud de manera natural.' },
            ].map((f, i) => (
              <FeatureCard key={i} variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } }} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.2 }}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 15 }}>{f.title}</h3>
                <p style={{ fontSize: '1rem', color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Reveal>
      </Section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <Section $bg="#fcfcfc">
          <Reveal width="100%">
            <SectionHeader>
              <h2>Nuestros Mundos</h2>
              <p>Explora nuestras líneas de productos creadas especialmente para tu bienestar integral.</p>
            </SectionHeader>
            <div style={{ padding: '20px 0' }}>
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
                  1200: { slidesPerView: 4 }
                }}
                style={{ padding: '0 10px 50px 10px' }}
              >
                {categories.map((cat) => (
                  <SwiperSlide key={cat.id}>
                    <CategoryCard href={`/tienda?category=${cat.name}`}>
                      <Image 
                        src={cat.imageUrl || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=80'} 
                        alt={cat.name} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 25vw" 
                        style={{ objectFit: 'cover' }} 
                      />
                      <div className="content">
                        <h3>{cat.name}</h3>
                        <span>Ver Colección <ArrowRight size={16} /></span>
                      </div>
                    </CategoryCard>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Reveal>
        </Section>
      )}

      {/* PRODUCTS */}
      {products.length > 0 && (
        <Section>
          <Reveal width="100%">
            <SectionHeader>
              <h2>Nuevas Llegadas</h2>
              <p>Lo último de nuestra producción artesanal directamente a tu puerta.</p>
            </SectionHeader>
            <ProductGrid>
              {products.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </ProductGrid>
            <div style={{ textAlign: 'center', marginTop: 60 }}>
              <HeroBtn href="/tienda">Ver Todos los Productos <ArrowRight size={20} /></HeroBtn>
            </div>
          </Reveal>
        </Section>
      )}

      {/* VIDEOS */}
      {videos.length > 0 && (
        <Section $bg={`linear-gradient(135deg, #f8faf5 0%, #f0f4ec 100%)`} style={{ position: 'relative' }}>
          <ParallaxLeaf top="20%" left="85%" speed={0.4} size={60} rotate={45} />
          <ParallaxLeaf top="70%" left="10%" speed={-0.2} size={35} rotate={-30} />
          <Reveal width="100%">
            <SectionHeader>
              <h2>Conoce Más</h2>
              <p>Mira nuestros videos sobre nuestros productos y su elaboración</p>
            </SectionHeader>
            <VideosGrid>
              {videos.map((v, i) => (
                <VideoCard key={v.id} initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                  <div className="content">
                    <PlayBtn><Play size={35} fill="white" /></PlayBtn>
                    <h4>{v.title}</h4>
                    <p>{v.description}</p>
                  </div>
                </VideoCard>
              ))}
            </VideosGrid>
          </Reveal>
        </Section>
      )}

      {/* TESTIMONIALS */}
      <Section $bg="#fff">
        <Reveal width="100%">
          <SectionHeader>
            <h2>Voces de Bienestar</h2>
            <p>Únete a miles de personas que ya transformaron su vida con NaturaJM.</p>
          </SectionHeader>
          <TestGrid>
            {testimonials.map((t, i) => (
              <TestCard key={t.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}>
                <TestAvatar>{t.name.charAt(0)}</TestAvatar>
                <h4 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 10 }}>{t.name}</h4>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={18} fill="#FFB800" color="#FFB800" />)}
                </div>
                <p style={{ fontStyle: 'italic', color: '#555', lineHeight: 1.7, fontSize: '1.05rem' }}>&quot;{t.content}&quot;</p>
              </TestCard>
            ))}
          </TestGrid>
        </Reveal>
      </Section>

      {/* NEWSLETTER */}
      <NewsletterSection>
        <Reveal width="100%">
          <SectionHeader>
            <h2>Recibe Ofertas Exclusivas</h2>
            <p>Suscríbete a nuestro newsletter y sé el primero en enterarte de nuestras promociones.</p>
          </SectionHeader>
          {subscribed ? (
            <motion.p initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '1.5rem', color: '#7BB32E', fontWeight: 800 }}>✓ ¡Gracias por suscribirte!</motion.p>
          ) : (
            <NewsletterForm onSubmit={handleNewsletter}>
              <NewsletterInput type="email" placeholder="Tu correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required />
              <NewsletterBtn type="submit"><Send size={20} /> Suscribirse</NewsletterBtn>
            </NewsletterForm>
          )}
        </Reveal>
      </NewsletterSection>

      {/* CTA */}
      <CTASection>
        <CTABgPattern animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />
        <CTAContent initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <h2>¿Listo para tu transformación?</h2>
          <p>Explora nuestra tienda y encuentra los productos perfectos para tu bienestar</p>
          <CTABtn href="/tienda">Ver todos los productos <ArrowRight size={24} /></CTABtn>
        </CTAContent>
      </CTASection>

      {/* TRUST */}
      <TrustBar>
        {['Envío a todo el País', 'Pago 100% Seguro', 'Calidad Orgánica', 'Garantía NaturaJM'].map((text, i) => (
          <TrustItem key={text} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <CheckCircle2 size={24} color="#7BB32E" /> {text}
          </TrustItem>
        ))}
      </TrustBar>
    </>
  );
}
