"use client";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Printer, Download, ArrowLeft, Mail, Phone, Globe } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const Page = styled.div`
  background: #f5f5f5;
  min-height: 100vh;
  padding: 40px 20px;

  @media print {
    padding: 0;
    background: white;
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media print {
    display: none;
  }
`;

const BackBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: 0.3s;
  &:hover {
    color: #1a1a1a;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: ${(p) => (p.$primary ? p.theme.colors.primary : "white")};
  color: ${(p) => (p.$primary ? "white" : "#1a1a1a")};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const InvoicePaper = styled.div`
  background: white;
  padding: 80px;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;

  @media print {
    box-shadow: none;
    padding: 0;
    border-radius: 0;
    width: 100%;
    margin: 0;
    font-size: 11pt;
  }
`;

const BrandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;

  .brand {
    h2 {
      font-size: 2rem;
      font-weight: 950;
      color: #1a1a1a;
      margin-bottom: 15px;
    }
    p {
      color: #666;
      font-size: 0.9rem;
      line-height: 1.6;
      max-width: 250px;
    }
  }

  .meta {
    text-align: right;
    h1 {
      font-size: 2.5rem;
      font-weight: 900;
      color: #eee;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .number {
      font-size: 1.1rem;
      font-weight: 800;
      color: #1a1a1a;
    }
    .date {
      color: #888;
      font-size: 0.9rem;
      margin-top: 5px;
    }
  }
`;

const BillingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 60px;

  h4 {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    color: #999;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }
  .name {
    font-size: 1.1rem;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 5px;
  }
  .detail {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.6;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 40px;

  th {
    text-align: left;
    padding: 15px 0;
    border-bottom: 2px solid #f0f0f0;
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #999;
    font-weight: 800;
  }
  td {
    padding: 25px 0;
    border-bottom: 1px solid #f5f5f5;
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
  }

  .qty {
    width: 80px;
  }
  .price {
    width: 120px;
    text-align: right;
  }
  .total {
    width: 120px;
    text-align: right;
    font-weight: 800;
  }
`;

const Totals = styled.div`
  margin-left: auto;
  width: 300px;

  .row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    font-size: 0.95rem;
    color: #666;
    font-weight: 600;

    &.grand {
      border-top: 2px solid #1a1a1a;
      margin-top: 10px;
      padding-top: 20px;
      color: #1a1a1a;
      font-size: 1.3rem;
      font-weight: 900;
    }
  }
`;

const Footer = styled.div`
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  line-height: 1.6;
`;

export default function FacturaPage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoice = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`);
      const json = await res.json();
      if (json.success) setData(json.order);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  if (loading)
    return <Page style={{ background: "white" }}>Cargando factura...</Page>;
  if (!data)
    return <Page style={{ background: "white" }}>Pedido no encontrado</Page>;

  const subtotal = data.total / 1.18;
  const itbis = data.total - subtotal;

  return (
    <Page>
      <Container>
        <Actions>
          <BackBtn href={`/admin/pedidos/${params.id}`}>
            <ArrowLeft size={18} /> Volver al Pedido
          </BackBtn>
          <ActionButtons>
            <Button onClick={() => window.print()}>
              <Printer size={18} /> Imprimir
            </Button>
            <Button $primary>
              <Download size={18} /> Descargar PDF
            </Button>
          </ActionButtons>
        </Actions>

        <InvoicePaper id="invoice-paper">
          <BrandHeader>
            <div className="brand">
              <div
                style={{
                  color: "#7BB32E",
                  fontSize: "1.5rem",
                  fontWeight: 950,
                  marginBottom: 10,
                }}
              >
                NaturaJM
              </div>
              <h2>NaturaJM Elite</h2>
              <p>📍 Calle Principal #123, Santo Domingo, Rep. Dom.</p>
              <p>📞 +1 (809) 123-4567</p>
              <p>🌐 www.naturajm.com</p>
            </div>
            <div className="meta">
              <h1>Factura</h1>
              <div className="number">
                #FAC-{new Date(data.createdAt).getFullYear()}-
                {data.id.slice(-4).toUpperCase()}
              </div>
              <div className="date">
                {new Date(data.createdAt).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </BrandHeader>

          <BillingGrid>
            <div>
              <h4>Facturar a</h4>
              <div className="name">
                {data.user?.name || data.customerName || "Cliente Particular"}
              </div>
              <div className="detail">
                {data.user?.email || data.customerEmail || "Sin email"}
              </div>
              <div className="detail">
                {data.user?.phone || data.customerPhone || "Sin teléfono"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <h4>Estado del Pago</h4>
              <div
                className="name"
                style={{
                  color: data.status === "PAID" ? "#7BB32E" : "#f44336",
                }}
              >
                {data.status === "PAID" ? "PAGADO" : "PENDIENTE"}
              </div>
              <div className="detail">Método: {data.paymentMethod}</div>
              <div className="detail">Ref: {data.paymentId || "N/A"}</div>
            </div>
          </BillingGrid>

          <Table>
            <thead>
              <tr>
                <th>Descripción del Producto</th>
                <th className="qty">Cant.</th>
                <th className="price">Precio</th>
                <th className="total">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.product?.name || "Producto no disponible"}</td>
                  <td className="qty">{item.quantity}</td>
                  <td className="price">${item.price.toFixed(2)}</td>
                  <td className="total">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Totals>
            <div className="row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="row">
              <span>ITBIS (18%)</span>
              <span>${itbis.toFixed(2)}</span>
            </div>
            <div className="row grand">
              <span>Total RD$</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </Totals>

          <Footer>
            <p>Gracias por elegir NaturaJM para su bienestar integral.</p>
            <p>
              Esta es una factura generada electrónicamente y es válida para
              fines contables internos.
            </p>
          </Footer>
        </InvoicePaper>
      </Container>
    </Page>
  );
}
