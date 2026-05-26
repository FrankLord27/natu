"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 5%;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 10px;
  color: ${(p) => p.theme.colors.text};
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${(p) => p.theme.colors.textLight};
  font-size: 1.1rem;
  margin-bottom: 60px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Form = styled.form`
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;
const Label = styled.label`
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #333;
`;
const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  min-height: 140px;
  resize: vertical;
  transition: border-color 0.3s;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const SubmitBtn = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  &:hover {
    filter: brightness(1.1);
  }
  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const InfoSection = styled.div``;
const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 30px;
`;

const ContactCard = styled.div`
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 16px;
  margin-bottom: 15px;
  .icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: ${(p) => p.theme.colors.primaryPale};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.colors.primary};
    flex-shrink: 0;
  }
  h4 {
    font-weight: 700;
    margin-bottom: 4px;
  }
  p {
    font-size: 0.9rem;
    color: #666;
  }
`;

const WhatsAppLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #25d366;
  color: white;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 20px;
  transition: all 0.3s;
  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

const Success = styled(motion.div)`
  text-align: center;
  padding: 40px;
  color: ${(p) => p.theme.colors.primary};
  h3 {
    font-size: 1.3rem;
    font-weight: 700;
    margin: 15px 0 8px;
  }
  p {
    color: #666;
  }
`;

export default function Contacto() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  return (
    <Page>
      <Title>Contáctanos</Title>
      <Subtitle>¿Tienes alguna pregunta? Estamos aquí para ayudarte.</Subtitle>

      <Grid>
        <Form onSubmit={handleSubmit}>
          {sent ? (
            <Success
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle2 size={60} />
              <h3>¡Mensaje Enviado!</h3>
              <p>Te responderemos lo antes posible. ¡Gracias!</p>
            </Success>
          ) : (
            <>
              <FormGroup>
                <Label>Nombre</Label>
                <Input
                  placeholder="Tu nombre completo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Correo Electrónico</Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Mensaje</Label>
                <Textarea
                  placeholder="¿Cómo podemos ayudarte?"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  required
                />
              </FormGroup>
              <SubmitBtn
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
              >
                <Send size={18} /> {loading ? "Enviando..." : "Enviar Mensaje"}
              </SubmitBtn>
            </>
          )}
        </Form>

        <InfoSection>
          <InfoTitle>Información de Contacto</InfoTitle>
          <ContactCard>
            <div className="icon">
              <Phone size={22} />
            </div>
            <div>
              <h4>Teléfono</h4>
              <p>+1 (809) 123-4567</p>
            </div>
          </ContactCard>
          <ContactCard>
            <div className="icon">
              <Mail size={22} />
            </div>
            <div>
              <h4>Email</h4>
              <p>info@naturajm.com</p>
            </div>
          </ContactCard>
          <ContactCard>
            <div className="icon">
              <MapPin size={22} />
            </div>
            <div>
              <h4>Ubicación</h4>
              <p>República Dominicana</p>
            </div>
          </ContactCard>
          <WhatsAppLink
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "18091234567"}`}
            target="_blank"
          >
            <MessageCircle size={20} fill="white" /> Escríbenos por WhatsApp
          </WhatsAppLink>
        </InfoSection>
      </Grid>
    </Page>
  );
}
