import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        order: { select: { customerName: true, total: true, createdAt: true } },
      },
      orderBy: { issuedAt: "desc" },
    });
    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener facturas" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { orderId, dueDate } = await req.json();
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { invoice: true },
    });

    if (!order)
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 },
      );
    if (order.invoice)
      return NextResponse.json(
        { error: "Ya existe una factura para esta orden" },
        { status: 400 },
      );

    const invoiceNumber = `FAC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId,
        subtotal: order.total,
        total: order.total,
        dueDate: dueDate
          ? new Date(dueDate)
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días por defecto
      },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (error) {
    console.error("Invoice Error:", error);
    return NextResponse.json(
      { error: "Error al generar factura" },
      { status: 500 },
    );
  }
}
