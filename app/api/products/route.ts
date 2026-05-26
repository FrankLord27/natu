import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "newest";

    const where: any = { isActive: true, deletedAt: null };
    if (category && category !== "all") {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any =
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : sort === "rating"
            ? { averageRating: "desc" }
            : { createdAt: "desc" };

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const all = searchParams.get("all") === "true";

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        ...(all ? {} : { skip, take: limit }),
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        description: body.description,
        price: parseFloat(body.price),
        discountPrice: body.discountPrice
          ? parseFloat(body.discountPrice)
          : null,
        costPrice: body.costPrice ? parseFloat(body.costPrice) : 0,
        stock: parseInt(body.stock) || 0,
        categoryId: body.categoryId,
        imageUrls: body.imageUrls || [],
        isActive: body.isActive ?? true,
        brand: body.brand,
        sku: body.sku,
        weight: body.weight,
        dimensions: body.dimensions,
        ingredients: body.ingredients,
        howToUse: body.howToUse,
        warnings: body.warnings,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create product" },
      { status: 500 },
    );
  }
}
