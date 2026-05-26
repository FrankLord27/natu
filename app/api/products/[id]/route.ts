import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!product)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();

    // Convert string values to appropriate types
    const updateData: any = {};
    if (body.name) updateData.name = body.name;
    if (body.description) updateData.description = body.description;
    if (body.price) updateData.price = parseFloat(body.price);
    if (body.discountPrice !== undefined) {
      updateData.discountPrice = body.discountPrice
        ? parseFloat(body.discountPrice)
        : null;
    }
    if (body.costPrice !== undefined) {
      updateData.costPrice = body.costPrice ? parseFloat(body.costPrice) : 0;
    }
    if (body.stock !== undefined) updateData.stock = parseInt(body.stock);
    if (body.categoryId) updateData.categoryId = body.categoryId;
    if (body.imageUrls) updateData.imageUrls = body.imageUrls;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.brand !== undefined) updateData.brand = body.brand;
    if (body.ingredients !== undefined)
      updateData.ingredients = body.ingredients;
    if (body.howToUse !== undefined) updateData.howToUse = body.howToUse;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/lib/auth");
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).userType !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Soft Delete: Actualizar deletedAt en lugar de borrar físicamente
    await prisma.product.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: "SOFT_DELETE_PRODUCT",
        module: "PRODUCTOS",
        adminId: (session.user as any).id,
        details: { productId: params.id },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Producto archivado correctamente",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
