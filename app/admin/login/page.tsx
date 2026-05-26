"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Leaf, LogIn, Eye, EyeOff } from "lucide-react";

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  padding: 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 35px;
  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: ${(p) => p.theme.colors.primary};
    span {
      color: #333;
      font-weight: 400;
    }
  }
  p {
    font-size: 0.85rem;
    color: #999;
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 600;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const InputGroup = styled.div`
  position: relative;
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
    outline: none;
  }
`;

const PassToggle = styled.button`
  position: absolute;
  right: 14px;
  top: 42px;
  color: #999;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 16px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
  margin-top: 10px;
  &:hover {
    filter: brightness(1.1);
  }
  &:disabled {
    opacity: 0.6;
  }
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff3f3;
  border: 1px solid #ffd4d4;
  border-radius: 10px;
  color: #e53935;
  font-size: 0.9rem;
  font-weight: 500;
`;

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("admin", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
    } else {
      toast.success("Sesión iniciada correctamente");
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <Page>
      <Card>
        <Logo>
          <h1>
            Natura<span>JM</span>
          </h1>
          <p>Panel Administrativo</p>
        </Logo>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="admin@naturajm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Contraseña</Label>
            <Input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PassToggle type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </PassToggle>
          </InputGroup>

          <SubmitBtn type="submit" disabled={loading}>
            <LogIn size={18} />{" "}
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </SubmitBtn>
        </Form>
      </Card>
    </Page>
  );
}
