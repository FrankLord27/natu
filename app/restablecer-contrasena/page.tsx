'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
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

const PasswordStrength = styled.div<{ $strength: number }>`
  margin-top: 8px;
  height: 4px;
  border-radius: 2px;
  background: #e0e0e0;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${p => p.$strength}%;
    background: ${p => 
      p.$strength < 40 ? '#ff5252' : 
      p.$strength < 70 ? '#ffb800' : 
      '#4caf50'};
    transition: width 0.3s, background 0.3s;
  }
`;

const PasswordHint = styled.p<{ $valid: boolean }>`
  font-size: 0.75rem;
  color: ${p => p.$valid ? '#4caf50' : '#999'};
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
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

const ErrorMsg = styled.div`
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
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

const LoginButton = styled(Link)`
  display: inline-block;
  padding: 14px 30px;
  background: ${p => p.theme.colors.primary};
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s;

  &:hover {
    background: ${p => p.theme.colors.primaryDark};
    transform: translateY(-2px);
  }
`;

export default function RestablecerContrasena() {
  return (
    <Suspense fallback={<Page><div>Cargando...</div></Page>}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setValidToken(false);
      setError('Token de recuperación inválido o expirado');
    }
  }, [token]);

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const isPasswordValid = passwordStrength() >= 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al restablecer contraseña');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!validToken && !token) {
    return (
      <Page>
        <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ErrorMsg>
            <AlertCircle size={20} />
            Token de recuperación inválido o expirado
          </ErrorMsg>
          <LoginButton href="/login" style={{ marginTop: 20, textAlign: 'center' }}>
            Ir al Login
          </LoginButton>
        </FormCard>
      </Page>
    );
  }

  if (success) {
    return (
      <Page>
        <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <SuccessCard>
            <div className="icon">
              <CheckCircle size={40} color="white" />
            </div>
            <h2>Contraseña Restablecida</h2>
            <p>
              Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
            </p>
            <LoginButton href="/login">
              Iniciar Sesión
            </LoginButton>
          </SuccessCard>
        </FormCard>
      </Page>
    );
  }

  return (
    <Page>
      <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Nueva Contraseña</Title>
        <Subtitle>Ingresa tu nueva contraseña</Subtitle>

        {error && <ErrorMsg><AlertCircle size={18} />{error}</ErrorMsg>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nueva Contraseña</Label>
            <InputWrapper>
              <IconWrapper><Lock size={18} /></IconWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
              <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </ToggleButton>
            </InputWrapper>
            <PasswordStrength $strength={passwordStrength()} />
            <PasswordHint $valid={password.length >= 8}>
              {password.length >= 8 ? <Check size={12} /> : <X size={12} />}
              Mínimo 8 caracteres
            </PasswordHint>
            <PasswordHint $valid={/[A-Z]/.test(password)}>
              {/[A-Z]/.test(password) ? <Check size={12} /> : <X size={12} />}
              Una mayúscula
            </PasswordHint>
            <PasswordHint $valid={/[0-9]/.test(password)}>
              {/[0-9]/.test(password) ? <Check size={12} /> : <X size={12} />}
              Un número
            </PasswordHint>
          </InputGroup>

          <InputGroup>
            <Label>Confirmar Contraseña</Label>
            <InputWrapper>
              <IconWrapper><Lock size={18} /></IconWrapper>
              <Input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
              />
              <ToggleButton type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </ToggleButton>
            </InputWrapper>
            {confirmPassword && (
              <PasswordHint $valid={password === confirmPassword}>
                {password === confirmPassword ? <Check size={12} /> : <X size={12} />}
                Las contraseñas coinciden
              </PasswordHint>
            )}
          </InputGroup>

          <Button type="submit" disabled={loading || !isPasswordValid}>
            {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
          </Button>
        </Form>
      </FormCard>
    </Page>
  );
}
