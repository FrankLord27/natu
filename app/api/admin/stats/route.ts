import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [products, users, orders, views, messages, subscribers, testimonials, revenueData, costData, topProductsData, recentOrders, invoicesCount, recentAccounting] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.analytics.count({ where: { type: 'VIEW' } }),
      prisma.contactSubmission.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.testimonial.count({ where: { isActive: true } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ['CANCELLED', 'PENDING'] } }
      }),
      prisma.orderItem.aggregate({
        _sum: { costPrice: true },
        where: { order: { status: { notIn: ['CANCELLED', 'PENDING'] } } }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } }, invoice: true }
      }),
      prisma.invoice.count(),
      prisma.accountingEntry.findMany({
        take: 5,
        orderBy: { date: 'desc' }
      })
    ]);

    // Obtener nombres de los productos top
    const topProductsRaw = await Promise.all(
      topProductsData.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          name: product?.name || 'Producto Desconocido',
          sales: item._sum.quantity || 0
        };
      })
    );

    // Obtener ventas por día (últimos 7 días) para el gráfico
    const last7Days = await prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        status: { notIn: ['CANCELLED'] }
      },
      select: { createdAt: true, total: true }
    });

    const dailyStats = last7Days.reduce((acc: any, order: any) => {
      const date = new Date(order.createdAt).toLocaleDateString('es-ES', { weekday: 'short' });
      acc[date] = (acc[date] || 0) + order.total;
      return acc;
    }, {});

    const chartData = Object.keys(dailyStats).map((date: string) => ({ date, total: dailyStats[date] }));

    return NextResponse.json({ 
      products, 
      users, 
      orders, 
      views, 
      messages, 
      subscribers, 
      testimonials, 
      invoicesCount,
      revenue: revenueData._sum?.total || 0,
      cost: costData._sum?.costPrice || 0,
      profit: (revenueData._sum?.total || 0) - (costData._sum?.costPrice || 0),
      chartData,
      topProducts: topProductsRaw,
      recentOrders: recentOrders.map((o: any) => ({
        id: o.id,
        customer: o.customerName || o.user?.name || 'Cliente Invitado',
        total: o.total,
        status: o.status,
        date: o.createdAt,
        hasInvoice: !!o.invoice
      })),
      recentAccounting
    });
  } catch (error) {
    return NextResponse.json({ 
      products: 0, users: 0, orders: 0, views: 0, messages: 0, subscribers: 0, testimonials: 0, revenue: 0, chartData: [] 
    });
  }
}
