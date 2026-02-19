import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/**
 * GET /api/user/stats
 * Retorna estadísticas del usuario (pedidos, favoritos, reseñas)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== 'customer') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Obtener estadísticas
    const [ordersCount, favoritesCount, reviewsCount] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.favorite.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
    ]);

    return NextResponse.json({
      orders: ordersCount,
      favorites: favoritesCount,
      reviews: reviewsCount,
    });
  } catch (error: any) {
    console.error('User stats error:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
