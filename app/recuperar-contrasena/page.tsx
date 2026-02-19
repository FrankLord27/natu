'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${p => p.theme.colors.primaryPale} 0%, #f8faf5 100%);
  padding: 40px 20px;
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  padding: 50px 40px;
  max-width: 480px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  color: ${p => p.theme.colors.text};
  margin-bottom: 10px;
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${p => p.theme.colors.textLight};
  text-align: center;
  margin-bottom: 35px;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px 14px 45px;
  border: 2px solid ${p => p.theme.colors.border};
  border-radius: 12px;
  font-size: 0.95rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${p => p.theme.colors.primary};
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 14px;
  color: #999;
`;

const Button = styled.button<{ disabled?: boolean }>`
  padding: 16px;
  background: ${p => p.disabled ? '#ccc' : p.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  margin-top: 10px;

  &:hover {
    background: ${p => p.disabled ? '#ccc' : p.theme.colors.primaryDark};
    transform: ${p => p.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${p => p.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 20px;
  justify-content: center;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const SuccessCard = styled.div`
  text-align: center;
  
  .icon {
    margin: 0 auto 20px;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #7BB32E, #5D8522);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${p => p.theme.colors.text};
    margin-bottom: 15px;
  }

  p {
    color: ${p => p.theme.colors.textLight};
    line-height: 1.6;
    margin-bottom: 25px;
  }
`;

export default function RecuperarContrasena() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al enviar el correo');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Page>
        <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SuccessCard>
            <div className="icon">
              <CheckCircle size={40} color="white" />
            </div>
            <h2>Correo Enviado</h2>
            <p>
              Revisa tu bandeja de entrada. Te hemos enviado un enlace para restablecer tu contraseña.
              El enlace expirará en 1 hora.
            </p>
            <BackLink href="/login">
              <ArrowLeft size={18} />
              Volver al inicio de sesión
            </BackLink>
          </SuccessCard>
        </FormCard>
      </Page>
    );
  }

  return (
    <Page>
      <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Recuperar Contraseña</Title>
        <Subtitle>
          Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
        </Subtitle>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Correo Electrónico</Label>
            <InputWrapper>
              <IconWrapper><Mail size={18} /></IconWrapper>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </InputWrapper>
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
          </Button>
        </Form>

        <BackLink href="/login">
          <ArrowLeft size={18} />
          Volver al inicio de sesión
        </BackLink>
      </FormCard>
    </Page>
  );
}
