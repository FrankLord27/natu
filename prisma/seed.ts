import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding NaturaJM V3 database (Safe Mode)...");

  // Admin User
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@naturajm.com" },
    update: {},
    create: {
      email: "admin@naturajm.com",
      name: "Admin NaturaJM",
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log("✅ Admin user verified");

  // Categories
  const categoriesData = [
    {
      name: "Aceites",
      slug: "aceites",
      description: "Aceites naturales y orgánicos",
      icon: "🫒",
      imageUrl:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80",
    },
    {
      name: "Harinas",
      slug: "harinas",
      description: "Harinas integrales y especiales",
      icon: "🌾",
      imageUrl:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
    },
    {
      name: "Cosméticos",
      slug: "cosmeticos",
      description: "Cosméticos naturales y orgánicos",
      icon: "✨",
      imageUrl:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    },
    {
      name: "Suplementos",
      slug: "suplementos",
      description: "Suplementos naturales para tu bienestar",
      icon: "💊",
      imageUrl:
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=800&q=80",
    },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories.push(category);
  }
  console.log("✅ Categories verified");

  // Products
  // Map categories by slug for easy access
  const catMap = categories.reduce(
    (acc, cat) => ({ ...acc, [cat.slug]: cat.id }),
    {} as Record<string, string>,
  );

  const productData = [
    {
      name: "Aceite de Coco Orgánico",
      slug: "aceite-de-coco-organico",
      description:
        "Aceite de coco 100% orgánico, prensado en frío. Perfecto para cocinar, cuidado de la piel y el cabello.",
      price: 24.99,
      discountPrice: 19.99,
      stock: 50,
      categoryId: catMap["aceites"],
      imageUrls: [
        "https://images.unsplash.com/photo-1526315282806-cd2d7ca620fb?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Aceite de Oliva Extra Virgen",
      slug: "aceite-de-oliva-extra-virgen",
      description: "Aceite de oliva extra virgen de primera prensada en frío.",
      price: 29.99,
      stock: 35,
      categoryId: catMap["aceites"],
      imageUrls: [
        "https://images.unsplash.com/photo-1474979266404-7f28a0ba0334?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Aceite de Argán Puro",
      slug: "aceite-de-argan-puro",
      description:
        "Aceite de argán 100% puro para el cuidado de la piel y el cabello.",
      price: 34.99,
      discountPrice: 29.99,
      stock: 25,
      categoryId: catMap["aceites"],
      imageUrls: [
        "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Harina de Almendra",
      slug: "harina-de-almendra",
      description: "Harina de almendra natural, baja en carbohidratos.",
      price: 15.99,
      stock: 80,
      categoryId: catMap["harinas"],
      imageUrls: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Harina de Coco",
      slug: "harina-de-coco",
      description: "Harina de coco orgánica, sin gluten y alta en fibra.",
      price: 12.99,
      discountPrice: 9.99,
      stock: 60,
      categoryId: catMap["harinas"],
      imageUrls: [
        "https://images.unsplash.com/photo-1512185570821-8318458395e8?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Harina de Avena Integral",
      slug: "harina-de-avena-integral",
      description: "Harina de avena integral molida a piedra.",
      price: 8.99,
      stock: 100,
      categoryId: catMap["harinas"],
      imageUrls: [
        "https://images.unsplash.com/photo-1549419137-64906fd51f08?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Sérum Facial Vitamina C",
      slug: "serum-facial-vitamina-c",
      description: "Sérum facial con vitamina C concentrada.",
      price: 39.99,
      discountPrice: 34.99,
      stock: 40,
      categoryId: catMap["cosmeticos"],
      imageUrls: [
        "https://images.unsplash.com/photo-1620756236308-65c3ef5d25f3?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Crema Hidratante Natural",
      slug: "crema-hidratante-natural",
      description: "Crema hidratante con ingredientes 100% naturales.",
      price: 28.99,
      stock: 45,
      categoryId: catMap["cosmeticos"],
      imageUrls: [
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Proteína de Whey Natural",
      slug: "proteina-whey-natural",
      description: "Proteína de suero de leche sin saborizantes artificiales.",
      price: 44.99,
      discountPrice: 39.99,
      stock: 30,
      categoryId: catMap["suplementos"],
      imageUrls: [
        "https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
    {
      name: "Colágeno Hidrolizado",
      slug: "colageno-hidrolizado",
      description: "Colágeno hidrolizado en polvo.",
      price: 32.99,
      stock: 55,
      categoryId: catMap["suplementos"],
      imageUrls: [
        "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
      ],
      brand: "NaturaJM",
    },
  ];

  for (const data of productData) {
    if (data.categoryId) {
      await prisma.product.upsert({
        where: { slug: data.slug },
        update: {}, // Don't overwrite product details on existing products (preserves stock/price changes)
        create: data,
      });
    }
  }
  console.log("✅ Products verified");

  // Testimonials (Only add if empty to avoid duplicates on every deploy)
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Andrea Martínez",
          content:
            "El aceite de coco es de otro mundo, se nota la pureza. Mi piel nunca estuvo mejor.",
          rating: 5,
          order: 1,
        },
        {
          name: "Roberto Gómez",
          content:
            "Las harinas son perfectas para mis recetas keto. ¡Por fin un proveedor confiable!",
          rating: 5,
          order: 2,
        },
        {
          name: "Elena Paz",
          content:
            "Servicio impecable y productos de primera. El sérum facial es indispensable.",
          rating: 5,
          order: 3,
        },
        {
          name: "Carlos Hernández",
          content:
            "La proteína natural es la mejor que he probado. Sin saborizantes raros, pura calidad.",
          rating: 5,
          order: 4,
        },
        {
          name: "María Torres",
          content:
            "El colágeno hidrolizado realmente funciona. Mi cabello y uñas están más fuertes que nunca.",
          rating: 4,
          order: 5,
        },
      ],
    });
    console.log("✅ Testimonials created (was empty)");
  }

  // Videos (Only add if empty)
  const videoCount = await prisma.video.count();
  if (videoCount === 0) {
    await prisma.video.createMany({
      data: [
        {
          title: "Conoce Nuestros Productos",
          url: "https://www.youtube.com/watch?v=example1",
          description: "Descubre la calidad de nuestros productos naturales",
          order: 1,
        },
        {
          title: "Testimonios de Clientes",
          url: "https://www.youtube.com/watch?v=example2",
          description: "Lo que dicen nuestros clientes felices",
          order: 2,
        },
      ],
    });
    console.log("✅ Videos created (was empty)");
  }

  console.log("\n🎉 NaturaJM V3 database seeded successfully (Safe Mode)!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
