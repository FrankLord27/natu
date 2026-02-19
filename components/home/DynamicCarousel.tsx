'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CarouselWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 95vh;
  min-height: 750px;
  overflow: hidden;
  background: ${p => p.theme.colors.backgroundWarm || '#fcfaf7'};
  @media (max-width: 768px) { height: 90vh; min-height: 600px; }
`;

const CurveDivider = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  line-height: 0;
  z-index: 5;
  svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 100px;
    fill: white;
  }
`;

const OrganicShape = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  background: ${p => p.theme.colors.primaryPale || '#f0f4ec'};
  clip-path: ellipse(75% 100% at 100% 50%);
  z-index: 0;
  @media (max-width: 992px) { 
    width: 100%; 
    height: 50%; 
    top: auto; 
    bottom: 0;
    clip-path: ellipse(100% 75% at 50% 100%);
  }
`;

const LeafContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 3;
  overflow: hidden;
`;

const FloatingLeaf = styled(motion.div)<{ $top: string, $left: string, $size: number }>`
  position: absolute;
  top: ${p => p.$top};
  left: ${p => p.$left};
  color: ${p => p.theme.colors.primary};
  opacity: 0.15;
  filter: blur(0.5px);
`;

const Slide = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10%;
  @media (max-width: 992px) { flex-direction: column; justify-content: center; text-align: center; padding: 0 5%; }
`;

const BackdropImage = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 100%);
  }
`;

const Content = styled(motion.div)`
  max-width: 650px;
  z-index: 2;
  position: relative;

  .slogan {
    font-size: 1rem;
    font-weight: 700;
    color: ${p => p.theme.colors.primary};
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 15px;
    display: block;
    opacity: 0.8;
  }

  h2 { 
    font-size: clamp(3.2rem, 7vw, 5.5rem); 
    font-weight: 950; 
    color: #1a2a0a; 
    margin-bottom: 25px; 
    line-height: 0.9;
    letter-spacing: -2px;
  }

  p { 
    font-size: clamp(1.1rem, 1.8vw, 1.35rem); 
    color: #444; 
    margin-bottom: 45px; 
    line-height: 1.7;
    font-weight: 500;
    max-width: 550px;
    @media (max-width: 992px) { margin-left: auto; margin-right: auto; }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) { justify-content: center; }
`;

const MainBtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 12px;
  background: #1a1a1a; color: white;
  padding: 20px 45px; border-radius: 50px; font-size: 1.1rem; font-weight: 700;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  &:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 25px 50px rgba(0,0,0,0.25); background: ${p => p.theme.colors.primaryDark}; }
`;

const SecondaryBtn = styled(Link)`
  display: inline-flex; align-items: center; gap: 10px;
  color: #1a1a1a; font-weight: 800; font-size: 1rem;
  text-decoration: underline; text-underline-offset: 8px;
  transition: all 0.3s;
  &:hover { color: ${p => p.theme.colors.primary}; padding-left: 10px; }
`;

const ProductShowcase = styled(motion.div)`
  position: relative;
  width: 50%;
  height: 80%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 992px) { width: 90%; height: 45%; margin-top: 40px; }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  width: 110%;
  height: 110%;
  filter: drop-shadow(0 40px 80px rgba(0,0,0,0.12));
`;

const NavBtn = styled.button<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${p => p.$side}: 40px;
  transform: translateY(-50%);
  width: 60px; height: 60px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex; align-items: center; justify-content: center;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  opacity: 0.8;
  &:hover { opacity: 1; transform: translateY(-50%) scale(1.1); background: ${p => p.theme.colors.primary}; color: white; }
  @media (max-width: 768px) { display: none; }
`;

const Indicators = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 10;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: ${p => p.$active ? '40px' : '10px'};
  height: 10px;
  border-radius: 10px;
  background: ${p => p.$active ? p.theme.colors.primary : 'rgba(0,0,0,0.2)'};
  border: none;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const slides = [
  {
    slogan: 'Naturalmente Mejor',
    title: 'Frescura de Aguacate',
    desc: 'Nuestros cultivos orgánicos garantizan la máxima pureza. Siente el poder de la tierra dominicana en cada producto.',
    image: '/images/hero/avocado_hero.png',
    color: '#f8faf5',
    link: '/tienda'
  },
  {
    slogan: 'Botánica Avanzada',
    title: 'Esencias de Bienestar',
    desc: 'Aceites esenciales de grado terapéutico para armonizar tu cuerpo y mente. 100% puros, sin adiciones.',
    image: '/images/hero/botanical_hero.png',
    color: '#fdfcf7',
    link: '/tienda?category=Aceites'
  },
  {
    slogan: 'Cuidado Integral',
    title: 'Belleza Orgánica',
    desc: 'Rituales de belleza inspirados en la selva tropical. Ingredientes vivos para una piel radiante y saludable.',
    image: '/images/hero/cosmetics_hero.png',
    color: '#f6f9f2',
    link: '/tienda'
  }
];

import { Leaf } from 'lucide-react';

export const DynamicCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <CarouselWrapper>
      <AnimatePresence mode="wait">
        <Slide
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          <OrganicShape style={{ background: slides[current].color }} />
          
          <LeafContainer>
            {[...Array(6)].map((_, i) => (
              <FloatingLeaf
                key={i}
                $top={`${Math.random() * 80 + 10}%`}
                $left={`${Math.random() * 80 + 10}%`}
                $size={Math.random() * 20 + 20}
                animate={{ 
                  y: [0, -40, 0],
                  x: [0, 20, 0],
                  rotate: [0, 180, 360],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Leaf size={30} />
              </FloatingLeaf>
            ))}
          </LeafContainer>
          
          <Content
            initial={{ opacity: 0, x: -60, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >
            <span className="slogan">{slides[current].slogan}</span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {slides[current].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              {slides[current].desc}
            </motion.p>
            <ButtonGroup>
              <MainBtn href={slides[current].link}>
                Explorar Colección <ShoppingBag size={20} />
              </MainBtn>
              <SecondaryBtn href="/nosotros">
                Nuestra Historia <ArrowRight size={18} />
              </SecondaryBtn>
            </ButtonGroup>
          </Content>

          <ProductShowcase>
            <FloatingElement
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: 0,
                y: [0, -25, 0]
              }}
              transition={{ 
                scale: { duration: 1, delay: 0.5 },
                opacity: { duration: 1, delay: 0.5 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ width: '100%', height: '100%' }}
            >
              <Image
                src={slides[current].image}
                alt={slides[current].title}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </FloatingElement>
            
            <motion.div
              style={{ position: 'absolute', top: '10%', right: '0%', zIndex: -1, opacity: 0.5 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
               <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                 <circle cx="50" cy="50" r="48" stroke="#7BB32E" strokeWidth="0.5" strokeDasharray="10 10" />
               </svg>
            </motion.div>
          </ProductShowcase>
        </Slide>
      </AnimatePresence>

      <NavBtn $side="left" onClick={prev} aria-label="Anterior">
        <ChevronLeft size={28} />
      </NavBtn>
      <NavBtn $side="right" onClick={next} aria-label="Siguiente">
        <ChevronRight size={28} />
      </NavBtn>

      <Indicators>
        {slides.map((_, i) => (
          <Dot key={i} $active={current === i} onClick={() => setCurrent(i)} aria-label={`Slide ${i+1}`} />
        ))}
      </Indicators>

      <CurveDivider>
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </CurveDivider>
    </CarouselWrapper>
  );
};
