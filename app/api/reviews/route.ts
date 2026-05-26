import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "ProductId is required" },
      { status: 400 },
    );
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      include: {
        user: { select: { name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, rating, title, content, imageUrls } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) throw new Error("User not found");

    // Check for verified purchase
    const orderWithProduct = await prisma.order.findFirst({
      where: {
        userId: user.id,
        status: "DELIVERED",
        items: { some: { productId } },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: Number(rating),
        title,
        content,
        imageUrls: imageUrls || [],
        verifiedPurchase: !!orderWithProduct,
        isApproved: true, // Auto-approve for demo, usually false
      },
    });

    // Update product average rating (Simplified)
    const allReviews = await prisma.review.findMany({ where: { productId } });
    const avg =
      allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
      allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: avg,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
