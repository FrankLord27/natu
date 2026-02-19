'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

const InputGroup = styled.div`
  position: relative;
`;

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

const Checkbox = styled.div`
  display: flex;
  align-items: start;
  gap: 10px;

  input[type="checkbox"] {
    margin-top: 4px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  label {
    font-size: 0.85rem;
    color: ${p => p.theme.colors.textLight};
    cursor: pointer;
  }

  a {
    color: ${p => p.theme.colors.primary};
    font-weight: 600;
    text-decoration: none;
    &:hover { text-decoration: underline; }
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
  margin-bottom: 15px;
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

export default function Registrarse() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    const { password } = formData;
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

    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
      return;
    }

    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Redirigir al login para que inicie sesión
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <FormCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Crear Cuenta</Title>
        <Subtitle>Únete a NaturaJM y disfruta de todos los beneficios</Subtitle>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Nombre Completo *</Label>
            <InputWrapper>
              <IconWrapper><User size={18} /></IconWrapper>
              <Input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Juan Pérez"
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Correo Electrónico *</Label>
            <InputWrapper>
              <IconWrapper><Mail size={18} /></IconWrapper>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Teléfono (Opcional)</Label>
            <InputWrapper>
              <IconWrapper><Phone size={18} /></IconWrapper>
              <Input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 234 567 8900"
              />
            </InputWrapper>
          </InputGroup>

          <InputGroup>
            <Label>Contraseña *</Label>
            <InputWrapper>
              <IconWrapper><Lock size={18} /></IconWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
              />
              <ToggleButton type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </ToggleButton>
            </InputWrapper>
            <PasswordStrength $strength={passwordStrength()} />
            <PasswordHint $valid={formData.password.length >= 8}>
              {formData.password.length >= 8 ? <Check size={12} /> : <X size={12} />}
              Mínimo 8 caracteres
            </PasswordHint>
            <PasswordHint $valid={/[A-Z]/.test(formData.password)}>
              {/[A-Z]/.test(formData.password) ? <Check size={12} /> : <X size={12} />}
              Una mayúscula
            </PasswordHint>
            <PasswordHint $valid={/[0-9]/.test(formData.password)}>
              {/[0-9]/.test(formData.password) ? <Check size={12} /> : <X size={12} />}
              Un número
            </PasswordHint>
          </InputGroup>

          <Checkbox>
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={e => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              Acepto los <a href="/terminos" target="_blank">términos y condiciones</a> y la <a href="/privacidad" target="_blank">política de privacidad</a>
            </label>
          </Checkbox>

          <Button type="submit" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </Form>

        <Footer>
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </Footer>
      </FormCard>
    </Page>
  );
}
