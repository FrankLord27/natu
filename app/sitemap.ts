import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://naturajm.com";

  // 1. Static Routes
  const routes = [
    "",
    "/tienda",
    "/nosotros",
    "/contacto",
    "/faq",
    "/recuperar-contraseña",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Fetch Dynamic Data
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const categories = await prisma.category.findMany({
    select: { name: true, id: true }, // Assuming category pages use name or slugs
  });

  // 3. Product URLs
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 4. Category URLs
  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/tienda?category=${encodeURIComponent(cat.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...productUrls, ...categoryUrls];
}
