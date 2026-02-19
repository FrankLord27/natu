import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { customerName, customerPhone, notes, items } = await req.json();

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Calcular el total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Crear la orden marcada como manual
    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        notes,
        total,
        status: 'PAID', // Suponemos que si es manual de WhatsApp, ya se coordinó el pago
        paymentMethod: 'WhatsApp',
        manualSale: true,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            costPrice: 0, // Se podría buscar el costPrice real aquí
          }))
        }
      },
      include: { items: true }
    });

    // Registrar en contabilidad con auditoría
    await prisma.accountingEntry.create({
      data: {
        type: 'INCOME',
        category: 'SALES',
        amount: total,
        description: `Venta Manual WhatsApp - Cliente: ${customerName}`,
        orderId: order.id,
        createdById: (session.user as any).id, // Audit
      }
    });

    // Registrar actividad en el log
    await prisma.activityLog.create({
      data: {
        action: 'CREATE_MANUAL_SALE',
        module: 'CAJA',
        adminId: (session.user as any).id,
        details: {
          orderId: order.id,
          customerName,
          total
        }
      }
    });

    // Actualizar stock de los productos
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Manual Sale Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
