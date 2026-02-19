import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export default resend;

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (payload: EmailPayload) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is not set. Email not sent:', payload);
    return { success: false, error: 'API Key missing' };
  }

  try {
    const data = await resend.emails.send({
      from: 'NaturaJM <onboarding@resend.dev>', // Update with verified domain in prod
      ...payload
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const getOrderConfirmationTemplate = (order: any) => {
  const itemsHtml = order.items.map((item: any) => `
    <div style="padding: 10px; border-bottom: 1px solid #eee;">
      <strong>${item.product.name}</strong> x ${item.quantity} - $${item.price.toFixed(2)}
    </div>
  `).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #7BB32E;">¡Gracias por tu compra!</h1>
      <p>Hola ${order.user?.name || order.customerName || 'Cliente'},</p>
      <p>Hemos recibido tu pedido correctamente. Aquí tienes los detalles:</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Pedido #${order.orderNumber}</h3>
        ${itemsHtml}
        <div style="margin-top: 15px; font-weight: bold; font-size: 1.1em;">
          Total: $${order.total.toFixed(2)}
        </div>
      </div>

      <p>Te notificaremos cuando tu pedido sea enviado.</p>
      <p style="font-size: 0.9rem; color: #666;">Si tienes alguna duda, contáctanos.</p>
    </div>
  `;
};
