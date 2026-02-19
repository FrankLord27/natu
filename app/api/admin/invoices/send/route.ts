import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import resend from '@/lib/email';
import { getInvoiceEmailHtml } from '@/lib/email-templates';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // 1. Fetch Order with full details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        },
        user: true,
        invoice: true
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const emailTo = order.user?.email || (order as any).customerEmail;

    if (!emailTo) {
      return NextResponse.json(
        { error: 'No email address found for this order' },
        { status: 400 }
      );
    }

    // 2. Check Resend Client
    if (!resend) {
      console.warn('RESEND_API_KEY is not set. Email not sent.');
      return NextResponse.json({ 
        success: true, 
        message: 'Simulation: Email would be sent (No API Key configured)' 
      });
    }

    // 3. Send Email
    const emailHtml = getInvoiceEmailHtml({
      orderId: order.id,
      customerName: order.user?.name || (order as any).customerName || 'Cliente',
      total: order.total,
      items: order.items.map((item: any) => ({
        name: (item.product as any).name,
        quantity: item.quantity,
        price: item.price
      })),
      invoiceUrl: order.invoice?.pdfUrl || `${process.env.NEXT_PUBLIC_APP_URL}/admin/pedidos/${order.id}/factura`
    });

    const { data, error } = await resend.emails.send({
      from: 'NaturaJM <onboarding@resend.dev>',
      to: [emailTo],
      subject: `Factura de Pedido #${order.id.slice(-6)} - NaturaJM`,
      html: emailHtml
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json(
        { error: 'Failed to send email via Resend' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });

  } catch (error: any) {
    console.error('Error resending invoice:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
