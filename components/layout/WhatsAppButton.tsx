"use client";

import styled from "styled-components";
import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WhatsAppLink = styled(motion.a)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.whatsapp};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
  z-index: 900;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.5);
  }
`;

export const WhatsAppButton = () => {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "18091234567";

  return (
    <WhatsAppLink
      href={`https://wa.me/${phone}?text=¡Hola! Me gustaría saber más sobre sus productos naturales.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <MessageCircle size={28} fill="white" />
    </WhatsAppLink>
  );
};
