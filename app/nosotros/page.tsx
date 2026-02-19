'use client';

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Leaf, Heart, Users, Award, Target, Globe } from 'lucide-react';

const Page = styled.div``;

const Hero = styled.section`
  padding: 100px 5%; text-align: center;
  background: linear-gradient(135deg, ${p => p.theme.colors.primaryPale} 0%, #f8faf5 100%);
  h1 { font-size: 2.8rem; font-weight: 900; color: ${p => p.theme.colors.text}; margin-bottom: 15px;
    @media (max-width: 768px) { font-size: 2rem; }
  }
  p { font-size: 1.1rem; color: ${p => p.theme.colors.textLight}; max-width: 700px; margin: 0 auto; line-height: 1.8; }
`;

const Section = styled.section<{ $bg?: string }>`padding: 80px 5%; background: ${p => p.$bg || 'white'};`;
const Container = styled.div`max-width: 1200px; margin: 0 auto;`;

const Grid3 = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ValCard = styled(motion.div)`
  text-align: center; padding: 40px 30px; border-radius: 20px; background: white; box-shadow: ${p => p.theme.shadows.sm};
  transition: all 0.3s; &:hover { transform: translateY(-8px); box-shadow: ${p => p.theme.shadows.lg}; }
`;

const IconCircle = styled.div`
  width: 70px; height: 70px; border-radius: 50%; background: ${p => p.theme.colors.primaryPale};
  display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
  color: ${p => p.theme.colors.primary};
`;

const StorySection = styled(Section)``;
const StoryGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const StoryContent = styled.div`
  h2 { font-size: 2rem; font-weight: 900; margin-bottom: 20px; color: ${p => p.theme.colors.text}; }
  p { color: #666; line-height: 1.8; margin-bottom: 15px; font-size: 1rem; }
`;

const StoryVisual = styled.div`
  height: 400px; border-radius: 24px; overflow: hidden;
  background: linear-gradient(135deg, ${p => p.theme.colors.primary} 0%, ${p => p.theme.colors.primaryDark} 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;
  h3 { font-size: 4rem; font-weight: 900; }
  p { font-size: 1.2rem; opacity: 0.8; }
`;

const Stats = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; text-align: center;
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const Stat = styled(motion.div)`
  padding: 30px; border-radius: 16px; background: ${p => p.theme.colors.primaryPale};
  h3 { font-size: 2.5rem; font-weight: 900; color: ${p => p.theme.colors.primary}; margin-bottom: 8px; }
  p { font-size: 0.85rem; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 1px; }
`;

export default function Nosotros() {
  return (
    <Page>
      <Hero>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>Nuestra Historia</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          En NaturaJM creemos que la naturaleza tiene todo lo que necesitas para vivir mejor.
          Desde República Dominicana, llevamos lo mejor de la tierra a tu hogar.
        </motion.p>
      </Hero>

      <Section $bg="#fcfcfc">
        <Container>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', marginBottom: 50 }}>Nuestros Valores</h2>
          <Grid3>
            {[
              { icon: <Leaf size={30} />, title: 'Naturaleza Pura', desc: 'Todos nuestros productos son elaborados con ingredientes 100% naturales seleccionados cuidadosamente.' },
              { icon: <Heart size={30} />, title: 'Pasión por el Bienestar', desc: 'Nos mueve la pasión de ayudar a las personas a mejorar su salud de forma natural y sostenible.' },
              { icon: <Award size={30} />, title: 'Calidad Certificada', desc: 'Mantenemos los más altos estándares de calidad en cada etapa de nuestra producción artesanal.' },
            ].map((v, i) => (
              <ValCard key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <IconCircle>{v.icon}</IconCircle>
                <h3 style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 12 }}>{v.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.7 }}>{v.desc}</p>
              </ValCard>
            ))}
          </Grid3>
        </Container>
      </Section>

      <StorySection>
        <Container>
          <StoryGrid>
            <StoryContent>
              <h2>¿Quiénes Somos?</h2>
              <p>NaturaJM nació con la visión de hacer accesibles los productos naturales de la más alta calidad. Nos especializamos en aceites, harinas y cosméticos elaborados artesanalmente.</p>
              <p>Trabajamos directamente con productores locales de República Dominicana, asegurando que cada producto cumpla con nuestros rigurosos estándares de calidad y sostenibilidad.</p>
              <p>Nuestra misión es transformar vidas a través de la naturaleza, ofreciendo soluciones reales para quienes buscan mejorar su bienestar de manera integral.</p>
            </StoryContent>
            <StoryVisual>
              <Leaf size={50} style={{ opacity: 0.5, marginBottom: 15 }} />
              <h3>V3</h3>
              <p>NaturaJM — La Versión Definitiva</p>
            </StoryVisual>
          </StoryGrid>
        </Container>
      </StorySection>

      <Section $bg="#f8faf5">
        <Container>
          <Stats>
            {[
              { num: '500+', label: 'Productos' },
              { num: '10K+', label: 'Clientes Felices' },
              { num: '100%', label: 'Natural' },
              { num: '5★', label: 'Valoración' },
            ].map((s, i) => (
              <Stat key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <h3>{s.num}</h3>
                <p>{s.label}</p>
              </Stat>
            ))}
          </Stats>
        </Container>
      </Section>
    </Page>
  );
}
