"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader } from "@/components/ui/Loader";
import {
  Check,
  ChevronRight,
  CreditCard,
  Home,
  User,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const WizardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Steps = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    height: 2px;
    background: #e0e0e0;
    z-index: 0;
  }
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  position: relative;
  z-index: 1;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(p) =>
      p.$active || p.$completed ? p.theme.colors.primary : "white"};
    border: 2px solid
      ${(p) => (p.$active || p.$completed ? p.theme.colors.primary : "#e0e0e0")};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => (p.$active || p.$completed ? "white" : "#999")};
    font-weight: 700;
    transition: all 0.3s;
  }

  .label {
    font-size: 0.85rem;
    font-weight: 700;
    color: ${(p) => (p.$active ? p.theme.colors.primary : "#999")};
  }
`;

const StepContent = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 0.9rem;
  color: #444;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
    background: #fcfcfc;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const Button = styled.button<{ $variant?: "secondary" }>`
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;

  background: ${(p) =>
    p.$variant === "secondary" ? "#f5f5f5" : p.theme.colors.primary};
  color: ${(p) => (p.$variant === "secondary" ? "#666" : "white")};
  border: none;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// Validation Schemas
const PersonalSchema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastName: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
});

const ShippingSchema = z.object({
  address: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  zipCode: z.string().optional(),
  notes: z.string().optional(),
});

export default function CheckoutWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const { cart, totalPrice: total, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Initialize cartToken
  useEffect(() => {
    let token = localStorage.getItem("njm_cart_token");
    if (!token) {
      token = `cart_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem("njm_cart_token", token);
    }
    setCartToken(token);
  }, []);

  // Sync cart when it changes or when email is available
  useEffect(() => {
    if (cartToken && cart.length > 0 && (formData as any).email) {
      const { syncAbandonedCart } = require("@/lib/actions");
      syncAbandonedCart(cartToken, {
        email: (formData as any).email,
        items: cart,
        total,
      });
    }
  }, [cart, formData, cartToken, total]);

  // Forms
  const personalForm = useForm({ resolver: zodResolver(PersonalSchema) });
  const shippingForm = useForm({ resolver: zodResolver(ShippingSchema) });

  const nextStep = async (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    // Sync to DB when moving from personal to shipping
    if (step === 1 && cartToken) {
      const { syncAbandonedCart } = await import("@/lib/actions");
      await syncAbandonedCart(cartToken, {
        email: updatedData.email,
        items: cart,
        total,
      });
    }

    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          notes: formData.notes,
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error al procesar el pedido");
        return;
      }

      setOrderId(data.orderId);
      clearCart();
      setStep(4);
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <WizardContainer>
        <StepContent style={{ textAlign: "center", padding: 60 }}>
          <h2>Tu carrito está vacío</h2>
          <Button $variant="secondary" style={{ margin: "20px auto" }}>
            Volver a la tienda
          </Button>
        </StepContent>
      </WizardContainer>
    );
  }

  return (
    <WizardContainer>
      {step < 4 && (
        <Steps>
          {[1, 2, 3].map((i) => (
            <Step key={i} $active={step === i} $completed={step > i}>
              <div className="circle">{step > i ? <Check size={16} /> : i}</div>
              <div className="label">
                {i === 1 ? "Datos" : i === 2 ? "Envío" : "Confirmar"}
              </div>
            </Step>
          ))}
        </Steps>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepContent
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormTitle>
              <User size={24} /> Información Personal
            </FormTitle>
            <form onSubmit={personalForm.handleSubmit(nextStep)}>
              <InputGrid>
                <FormGroup>
                  <Label>Nombre</Label>
                  <Input
                    {...personalForm.register("firstName")}
                    placeholder="Juan"
                  />
                  {personalForm.formState.errors.firstName && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {
                        personalForm.formState.errors.firstName
                          .message as string
                      }
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Apellido</Label>
                  <Input
                    {...personalForm.register("lastName")}
                    placeholder="Pérez"
                  />
                  {personalForm.formState.errors.lastName && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {personalForm.formState.errors.lastName.message as string}
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    {...personalForm.register("email")}
                    placeholder="juan@ejemplo.com"
                  />
                  {personalForm.formState.errors.email && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {personalForm.formState.errors.email.message as string}
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Teléfono</Label>
                  <Input
                    {...personalForm.register("phone")}
                    placeholder="(809) 000-0000"
                  />
                  {personalForm.formState.errors.phone && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {personalForm.formState.errors.phone.message as string}
                    </span>
                  )}
                </FormGroup>
              </InputGrid>
              <ButtonRow>
                <div />
                <Button type="submit">
                  Siguiente <ChevronRight size={18} />
                </Button>
              </ButtonRow>
            </form>
          </StepContent>
        )}

        {step === 2 && (
          <StepContent
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormTitle>
              <Home size={24} /> Dirección de Envío
            </FormTitle>
            <form onSubmit={shippingForm.handleSubmit(nextStep)}>
              <InputGrid>
                <FormGroup style={{ gridColumn: "span 2" }}>
                  <Label>Dirección Completa</Label>
                  <Input
                    {...shippingForm.register("address")}
                    placeholder="Calle Principal #123, Sector..."
                  />
                  {shippingForm.formState.errors.address && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {shippingForm.formState.errors.address.message as string}
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Ciudad</Label>
                  <Input {...shippingForm.register("city")} />
                  {shippingForm.formState.errors.city && (
                    <span style={{ color: "red", fontSize: 12 }}>
                      {shippingForm.formState.errors.city.message as string}
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Código Postal (Opcional)</Label>
                  <Input {...shippingForm.register("zipCode")} />
                </FormGroup>
                <FormGroup style={{ gridColumn: "span 2" }}>
                  <Label>Notas de entrega (Opcional)</Label>
                  <Input
                    {...shippingForm.register("notes")}
                    placeholder="Dejar en recepción..."
                  />
                </FormGroup>
              </InputGrid>
              <ButtonRow>
                <Button type="button" $variant="secondary" onClick={prevStep}>
                  Atrás
                </Button>
                <Button type="submit">
                  Continuar al Pago <ChevronRight size={18} />
                </Button>
              </ButtonRow>
            </form>
          </StepContent>
        )}

        {step === 3 && (
          <StepContent
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <FormTitle>
              <CreditCard size={24} /> Confirmación y Pago
            </FormTitle>

            <div
              style={{
                background: "#f9f9f9",
                padding: 20,
                borderRadius: 12,
                marginBottom: 25,
              }}
            >
              <h3 style={{ marginBottom: 15, fontSize: "1.1rem" }}>
                Resumen del Pedido
              </h3>
              {cart.map((item: any) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    fontSize: "0.9rem",
                  }}
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              ))}
              <div
                style={{
                  borderTop: "2px solid #e0e0e0",
                  marginTop: 15,
                  paddingTop: 15,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.2rem",
                  fontWeight: 800,
                }}
              >
                <span>Total a Pagar</span>
                <span style={{ color: "#7BB32E" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            <ButtonRow>
              <Button type="button" $variant="secondary" onClick={prevStep}>
                Atrás
              </Button>
              <Button onClick={handleFinalSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <Loader size={8} color="white" />
                ) : (
                  "Confirmar Pedido"
                )}
              </Button>
            </ButtonRow>
          </StepContent>
        )}

        {step === 4 && orderId && (
          <StepContent
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#e8f5e9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <PackageCheck size={36} color="#2e7d32" />
              </div>
              <h2
                style={{ fontWeight: 900, fontSize: "1.8rem", marginBottom: 8 }}
              >
                ¡Pedido Recibido!
              </h2>
              <p style={{ color: "#666", marginBottom: 6 }}>
                Tu pedido fue registrado correctamente.
              </p>
              <p
                style={{
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  color: "#1a1a1a",
                  marginBottom: 24,
                }}
              >
                N.° de orden:{" "}
                <span style={{ color: "#7BB32E" }}>
                  #{orderId.slice(-8).toUpperCase()}
                </span>
              </p>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "#888",
                  maxWidth: 400,
                  margin: "0 auto 30px",
                  lineHeight: 1.6,
                }}
              >
                Nos pondremos en contacto a <strong>{formData.email}</strong>{" "}
                para confirmar los detalles de pago y envío.
              </p>
              <div
                style={{ display: "flex", gap: 12, justifyContent: "center" }}
              >
                <Link
                  href="/tienda"
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    background: "#7BB32E",
                    color: "white",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Seguir comprando
                </Link>
                <Link
                  href="/mi-cuenta/pedidos"
                  style={{
                    padding: "12px 24px",
                    borderRadius: 12,
                    background: "#f5f5f5",
                    color: "#333",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Mis pedidos
                </Link>
              </div>
            </div>
          </StepContent>
        )}
      </AnimatePresence>
    </WizardContainer>
  );
}
