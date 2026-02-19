'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  max-width: 450px;
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
`;

const SuccessMsg = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
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

const ToggleButton = styled.button`
  position: absolute;
  right: 14px;
  color: #999;
  &:hover { color: ${p => p.theme.colors.primary}; }
`;

const ForgotLink = styled(Link)`
  font-size: 0.85rem;
  color: ${p => p.theme.colors.primary};
  text-decoration: none;
  font-weight: 600;
  align-self: flex-end;
  margin-top: -10px;

  &:hover {
    text-decoration: underline;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: ${p => p.disabled ? '#ccc' : p.theme.colors.primaryDark};
    transform: ${p => p.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const ErrorMsg = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: center;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 25px;
  font-size: 0.9rem;
  color: ${p => p.theme.colors.textLight};

  a {
    color: ${p => p.theme.colors.primary};
    font-weight: 700;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 30px 0 20px;
  color: #999;
  font-size: 0.85rem;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e0e0e0;
  }
`;

const AdminLink = styled(Link)`
  display: block;
  text-align: center;
  padding: 12px;
  border: 2px solid ${p => p.theme.colors.border};
  border-radius: 10px;
  color: ${p => p.theme.colors.text};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    border-color: ${p => p.theme.colors.primary};
    background: ${p => p.theme.colors.primaryPale};
  }
`;

export default function Login() {
  return (
    <Suspense fallback={<Page><div>Cargando...</div></Page>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('customer', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      } else {
        router.push('/mi-cuenta');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Iniciar Sesión</Title>
        <Subtitle>Bienvenido de vuelta a NaturaJM</Subtitle>

        {showSuccess && (
          <SuccessMsg>
            ✓ Cuenta creada exitosamente. Por favor inicia sesión.
          </SuccessMsg>
        )}

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

          <InputGroup>
            <Label>Contraseña</Label>
            <InputWrapper>
              <IconWrapper><Lock size={18} /></IconWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </ToggleButton>
            </InputWrapper>
          </InputGroup>

          <ForgotLink href="/recuperar-contrasena">
            ¿Olvidaste tu contraseña?
          </ForgotLink>

          <Button type="submit" disabled={loading}>
            <LogIn size={20} />
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </Form>

        <Divider>o</Divider>

        <AdminLink href="/admin/login">
          Acceso para Administradores →
        </AdminLink>

        <Footer>
          ¿No tienes cuenta? <Link href="/registrarse">Regístrate gratis</Link>
        </Footer>
      </FormCard>
    </Page>
  );
}
