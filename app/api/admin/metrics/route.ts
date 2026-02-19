import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const [orders, accountingEntries, categories, products] = await Promise.all([
      prisma.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo }, status: { notIn: ['CANCELLED'] } },
        include: { items: true },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.accountingEntry.findMany({
        where: { date: { gte: sixMonthsAgo } },
        orderBy: { date: 'asc' },
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
      }),
      prisma.product.findMany({
        select: { id: true, name: true, stock: true, minStockLevel: true },
      })
    ]);

    // Calcular Revenue, Cost y Profit por mes
    const monthlyStats = orders.reduce((acc: any, order: any) => {
      const month = new Date(order.createdAt).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      if (!acc[month]) acc[month] = { revenue: 0, cost: 0, profit: 0, orders: 0 };
      
      acc[month].revenue += order.total;
      acc[month].orders += 1;
      const orderCost = order.items.reduce((sum: number, item: any) => sum + (item.costPrice * item.quantity), 0);
      acc[month].cost += orderCost;
      acc[month].profit = acc[month].revenue - acc[month].cost;
      
      return acc;
    }, {});

    const chartData = Object.keys(monthlyStats).map(month => ({
      month,
      ...monthlyStats[month]
    }));

    // Distribución por Categoría (Productos)
    const categoryDistribution = categories.map((cat: any) => ({
      name: cat.name,
      value: cat._count.products,
    }));

    // Stock Alertas
    const stockAlerts = products.filter((p: any) => p.stock <= p.minStockLevel).map((p: any) => ({
      id: p.id,
      name: p.name,
      stock: p.stock,
      min: p.minStockLevel,
    }));

    return NextResponse.json({
      success: true,
      chartData,
      categoryDistribution,
      stockAlerts,
      overview: {
        totalRevenue: chartData.reduce((sum: number, d: any) => sum + d.revenue, 0),
        totalProfit: chartData.reduce((sum: number, d: any) => sum + d.profit, 0),
        totalOrders: chartData.reduce((sum: number, d: any) => sum + d.orders, 0),
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
