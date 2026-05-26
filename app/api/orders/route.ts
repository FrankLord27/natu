import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      notes,
      items,
      total,
    } = body;

    if (!firstName || !email || !items?.length || !total) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    // Verify stock and get cost prices
    const productIds = items.map((i: any) => i.id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, stock: true, costPrice: true, name: true },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.id);
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado: ${item.id}` },
          { status: 400 },
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para: ${product.name}` },
          { status: 400 },
        );
      }
    }

    const userId = session?.user
      ? (session.user as any).userType === "customer"
        ? (session.user as any).id
        : null
      : null;

    // Create order and items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          customerPhone: phone,
          notes: [address, city, notes].filter(Boolean).join(" | "),
          total,
          status: "PENDING",
          paymentMethod: "Transferencia",
          manualSale: false,
          items: {
            create: items.map((item: any) => {
              const product = products.find((p) => p.id === item.id)!;
              return {
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                costPrice: product.costPrice ?? 0,
              };
            }),
          },
        },
      });

      // Decrement stock for each product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout order error:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 },
    );
  }
}
