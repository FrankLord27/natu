import { getProducts, getCategories } from "@/lib/actions";
import { HomeClient } from "@/components/home/HomeClient";
import { Product, Category, Testimonial, Video } from "@/types";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Andrea Martínez",
    content:
      "El aceite de coco es de otro mundo, se nota la pureza. Mi piel nunca estuvo mejor.",
    rating: 5,
    isActive: true,
    order: 1,
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Roberto Gómez",
    content:
      "Las harinas son perfectas para mis recetas keto. ¡Por fin un proveedor confiable!",
    rating: 5,
    isActive: true,
    order: 2,
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Elena Paz",
    content:
      "Servicio impecable y productos de primera. El sérum facial es indispensable.",
    rating: 5,
    isActive: true,
    order: 3,
    createdAt: new Date(),
  },
];

const FALLBACK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Conoce Nuestros Productos",
    url: "#",
    description: "Descubre la calidad de nuestros productos naturales",
    order: 1,
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Testimonios de Clientes",
    url: "#",
    description: "Lo que dicen nuestros clientes",
    order: 2,
    isActive: true,
    createdAt: new Date(),
  },
];

export default async function Home() {
  const [prodRes, catRes, dbTestimonials, dbVideos] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(),
    prisma.testimonial
      .findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 3,
      })
      .catch(() => [] as Testimonial[]),
    prisma.video
      .findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        take: 2,
      })
      .catch(() => [] as Video[]),
  ]);

  const products = prodRes.success ? (prodRes.data as Product[]) : [];
  const categories = catRes.success ? (catRes.data as Category[]) : [];
  const testimonials =
    dbTestimonials.length > 0
      ? (dbTestimonials as unknown as Testimonial[])
      : FALLBACK_TESTIMONIALS;
  const videos =
    dbVideos.length > 0 ? (dbVideos as unknown as Video[]) : FALLBACK_VIDEOS;

  return (
    <HomeClient
      products={products}
      categories={categories}
      testimonials={testimonials}
      videos={videos}
    />
  );
}
