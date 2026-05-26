"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { Save, User as UserIcon, Mail, Phone, Camera } from "lucide-react";

const Page = styled.div`
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
  padding: 60px 5%;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 35px;
  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: ${(p) => p.theme.colors.text};
    margin-bottom: 5px;
  }
  p {
    color: ${(p) => p.theme.colors.textLight};
  }
`;

const Card = styled.div`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7bb32e, #5d8522);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  position: relative;
`;

const UploadBtn = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div``;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(p) => p.theme.colors.text};
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
  border: 2px solid ${(p) => p.theme.colors.border};
  border-radius: 12px;
  font-size: 0.95rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const IconBox = styled.div`
  position: absolute;
  left: 14px;
  color: #999;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 14px 30px;
  background: ${(p) =>
    p.variant === "secondary" ? "transparent" : p.theme.colors.primary};
  color: ${(p) => (p.variant === "secondary" ? p.theme.colors.text : "white")};
  border: 2px solid
    ${(p) =>
      p.variant === "secondary" ? p.theme.colors.border : "transparent"};
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    background: ${(p) =>
      p.variant === "secondary" ? "#f5f5f5" : p.theme.colors.primaryDark};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 15px;
`;

const SuccessMsg = styled.div`
  background: #e8f5e9;
  color: #2e7d32;
  padding: 14px 18px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
`;

export default function Perfil() {
  const { data: session, update } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any).phone || "",
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        // Update session
        await update();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initials =
    formData.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <Page>
      <Container>
        <Header>
          <h1>Mi Perfil</h1>
          <p>Administra tu información personal</p>
        </Header>

        <Card>
          <AvatarSection>
            <Avatar>
              {initials}
              <UploadBtn
                type="button"
                onClick={() => alert("Función de carga de avatar próximamente")}
              >
                <Camera size={16} />
              </UploadBtn>
            </Avatar>
            <div>
              <h3
                style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 5 }}
              >
                {formData.name || "Usuario"}
              </h3>
              <p style={{ color: "#999", fontSize: "0.9rem" }}>
                {formData.email}
              </p>
            </div>
          </AvatarSection>

          {success && (
            <SuccessMsg>✓ Perfil actualizado exitosamente</SuccessMsg>
          )}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>Nombre Completo</Label>
              <InputWrapper>
                <IconBox>
                  <UserIcon size={18} />
                </IconBox>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Juan Pérez"
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Correo Electrónico</Label>
              <InputWrapper>
                <IconBox>
                  <Mail size={18} />
                </IconBox>
                <Input
                  type="email"
                  value={formData.email}
                  disabled
                  title="El correo no puede ser modificado"
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <Label>Teléfono</Label>
              <InputWrapper>
                <IconBox>
                  <Phone size={18} />
                </IconBox>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 234 567 8900"
                />
              </InputWrapper>
            </InputGroup>

            <ButtonGroup>
              <Button type="submit" disabled={loading}>
                <Save size={18} />
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => window.history.back()}
              >
                Cancelar
              </Button>
            </ButtonGroup>
          </Form>
        </Card>
      </Container>
    </Page>
  );
}
