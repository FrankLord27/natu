import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/orders/[id]
 * Obtiene detalles de un pedido específico (admin only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrls: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Error al obtener pedido" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/orders/[id]
 * Actualiza el estado de un pedido
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { status } = await req.json();

    const validStatuses = [
      "PENDING",
      "PAID",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    // Automatización: Si el pedido se marca como pagado, procesar factura y contabilidad
    if (status === "PAID") {
      const { processOrderPayment } = await import("@/lib/actions");
      await processOrderPayment(params.id);
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 },
    );
  }
}
