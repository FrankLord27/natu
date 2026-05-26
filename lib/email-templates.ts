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

export const getInvoiceEmailHtml = ({
  orderId,
  customerName,
  total,
  items,
  invoiceUrl,
}: InvoiceEmailProps) => {
  const itemsHtml = items
    .map(
      (item, index) => `
    <tr style="border-bottom: ${index < items.length - 1 ? "1px solid #f5f5f5" : "none"}">
      <td style="padding: 10px 0">${item.name} <span style="color: #888">x${item.quantity}</span></td>
      <td style="padding: 10px 0; text-align: right">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="padding: 20px; text-align: center; background-color: #f8f9fa;">
        <h1 style="color: #7BB32E; margin: 0;">NaturaJM</h1>
      </div>
      <div style="padding: 40px 20px; background-color: #ffffff; border: 1px solid #e9ecef;">
        <h2 style="margin-top: 0;">¡Gracias por tu compra!</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Hola ${customerName},
        </p>
        <p style="font-size: 16px; line-height: 1.5;">
          Hemos recibido tu pedido correctamente. A continuación encontrarás los detalles y tu factura adjunta.
        </p>
        
        <div style="margin: 30px 0; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
          <h3 style="margin: 0 0 15px 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            Pedido #${orderId.slice(-6)}
          </h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="border-top: 2px solid #eee;">
                <td style="padding: 15px 0; font-weight: bold;">Total</td>
                <td style="padding: 15px 0; text-align: right; font-weight: bold; font-size: 1.2em; color: #7BB32E;">
                  $${total.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        ${
          invoiceUrl
            ? `
          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${invoiceUrl}"
              style="
                background-color: #333;
                color: #ffffff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                font-size: 16px;
              "
            >
              Descargar Factura PDF
            </a>
          </div>
        `
            : ""
        }

        <p style="font-size: 14px; color: #666;">
          Si tienes alguna pregunta sobre tu pedido, no dudes responder a este correo.
        </p>
      </div>
      <div style="padding: 20px; text-align: center; background-color: #f8f9fa; color: #999; font-size: 12px;">
        &copy; ${new Date().getFullYear()} NaturaJM Elite Business. Todos los derechos reservados.
      </div>
    </div>
  `;
};
