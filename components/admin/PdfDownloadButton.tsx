"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/lib/invoice-generator";
import styled from "styled-components";
import { Download } from "lucide-react";

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  background: ${(p) => (p.$primary ? p.theme.colors.primary : "white")};
  color: ${(p) => (p.$primary ? "white" : "#666")};
  border: ${(p) => (p.$primary ? "none" : "1px solid #ddd")};
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface PdfDownloadButtonProps {
  order: any;
  invoiceNumber: string;
}

export default function PdfDownloadButton({
  order,
  invoiceNumber,
}: PdfDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF order={order} invoiceNumber={invoiceNumber} />}
      fileName={`${invoiceNumber}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ loading }: any) => (
        <Button $primary disabled={loading}>
          <Download size={16} /> {loading ? "Preparando..." : "Descargar PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
