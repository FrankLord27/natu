import React from "react";

interface InvoiceEmailProps {
  orderId: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  invoiceUrl?: string;
}

export const InvoiceEmail: React.FC<InvoiceEmailProps> = ({
  orderId,
  customerName,
  total,
  items,
  invoiceUrl,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      color: "#333",
    }}
  >
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1 style={{ color: "#7BB32E", margin: "0" }}>NaturaJM</h1>
    </div>
    <div
      style={{
        padding: "40px 20px",
        backgroundColor: "#ffffff",
        border: "1px solid #e9ecef",
      }}
    >
      <h2 style={{ marginTop: "0" }}>¡Gracias por tu compra!</h2>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        Hola {customerName},
      </p>
      <p style={{ fontSize: "16px", lineHeight: "1.5" }}>
        Hemos recibido tu pedido correctamente. A continuación encontrarás los
        detalles y tu factura adjunta.
      </p>

      <div
        style={{
          margin: "30px 0",
          border: "1px solid #eee",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            margin: "0 0 15px 0",
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Pedido #{orderId.slice(-6)}
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                style={{
                  borderBottom:
                    index < items.length - 1 ? "1px solid #f5f5f5" : "none",
                }}
              >
                <td style={{ padding: "10px 0" }}>
                  {item.name}{" "}
                  <span style={{ color: "#888" }}>x{item.quantity}</span>
                </td>
                <td style={{ padding: "10px 0", textAlign: "right" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "2px solid #eee" }}>
              <td style={{ padding: "15px 0", fontWeight: "bold" }}>Total</td>
              <td
                style={{
                  padding: "15px 0",
                  textAlign: "right",
                  fontWeight: "bold",
                  fontSize: "1.2em",
                  color: "#7BB32E",
                }}
              >
                ${total.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {invoiceUrl && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <a
            href={invoiceUrl}
            style={{
              backgroundColor: "#333",
              color: "#ffffff",
              padding: "12px 24px",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Descargar Factura PDF
          </a>
        </div>
      )}

      <p style={{ fontSize: "14px", color: "#666" }}>
        Si tienes alguna pregunta sobre tu pedido, no dudes responder a este
        correo.
      </p>
    </div>
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        color: "#999",
        fontSize: "12px",
      }}
    >
      &copy; {new Date().getFullYear()} NaturaJM Elite Business. Todos los
      derechos reservados.
    </div>
  </div>
);
