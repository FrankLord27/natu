import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/favorites
 * Obtiene los favoritos del usuario
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "customer") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrls: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      favorites,
    });
  } catch (error: any) {
    console.error("Get favorites error:", error);
    return NextResponse.json(
      { error: "Error al obtener favoritos" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/user/favorites
 * Elimina un producto de favoritos
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "customer") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { productId } = await req.json();

    await prisma.favorite.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Producto eliminado de favoritos",
    });
  } catch (error: any) {
    console.error("Delete favorite error:", error);
    return NextResponse.json(
      { error: "Error al eliminar favorito" },
      { status: 500 },
    );
  }
}
