import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener reseñas" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const {
      id,
      isApproved,
      adminComment,
      isFeaturedTestimonial,
      testimonialOrder,
    } = await req.json();

    const updateData: any = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (adminComment !== undefined) updateData.adminComment = adminComment;
    if (isFeaturedTestimonial !== undefined)
      updateData.isFeaturedTestimonial = isFeaturedTestimonial;
    if (testimonialOrder !== undefined)
      updateData.testimonialOrder = testimonialOrder;

    const review = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    // Si se aprueba, recalculamos el rating del producto (opcional, pero profesional)
    if (isApproved) {
      const product = await prisma.product.findUnique({
        where: { id: review.productId },
        include: { reviews: { where: { isApproved: true } } },
      });

      if (product) {
        const avg =
          product.reviews.length > 0
            ? product.reviews.reduce(
                (acc: number, r: any) => acc + r.rating,
                0,
              ) / product.reviews.length
            : 0;

        await prisma.product.update({
          where: { id: product.id },
          data: { averageRating: avg, reviewCount: product.reviews.length },
        });
      }
    }

    return NextResponse.json({ success: true, review });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar reseña" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json({ error: "ID requerido" }, { status: 400 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar reseña" },
      { status: 500 },
    );
  }
}
