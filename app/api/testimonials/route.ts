import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch direct testimonials
    const manualTestimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // 2. Fetch featured reviews to promote them as testimonials
    const reviewTestimonials = await prisma.review.findMany({
      where: { isFeaturedTestimonial: true, isApproved: true },
      include: { user: true, product: true },
      orderBy: { testimonialOrder: "asc" },
    });

    // Map reviews to testimonial format
    const mappedReviews = reviewTestimonials.map((rev: any) => ({
      id: rev.id,
      name: rev.user?.name || "Cliente Verificado",
      content: rev.content,
      rating: rev.rating,
      imageUrl: rev.imageUrls[0] || rev.user?.avatarUrl || null,
      isActive: true,
      order: rev.testimonialOrder,
      isFromReview: true,
      productName: rev.product?.name,
    }));

    // Combine both and sort by order
    const combined = [...manualTestimonials, ...mappedReviews].sort(
      (a: any, b: any) => (a.order || 0) - (b.order || 0),
    );

    return NextResponse.json(combined);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const testimonial = await prisma.testimonial.create({ data: body });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
