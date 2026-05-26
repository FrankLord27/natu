import { getProductBySlug } from "@/lib/actions";
import { ProductDetail } from "@/components/products/ProductDetail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const res = await getProductBySlug(params.slug);
  if (!res.success || !res.data) return {};
  const p = res.data as Product;
  return {
    title: p.name,
    description: p.description,
    openGraph: {
      images: p.imageUrls?.[0] ? [p.imageUrls[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const res = await getProductBySlug(params.slug);
  if (!res.success || !res.data) notFound();

  const product = res.data as Product;

  return (
    <>
      <ProductDetail product={product} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image:
              product.imageUrls?.[0] || "https://naturajm.com/placeholder.jpg",
            description: product.description,
            brand: { "@type": "Brand", name: "NaturaJM" },
            offers: {
              "@type": "Offer",
              url: `https://naturajm.com/productos/${product.slug}`,
              priceCurrency: "DOP",
              price: product.price,
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            aggregateRating:
              product.averageRating > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: product.averageRating,
                    reviewCount: product.reviewCount,
                  }
                : undefined,
          }),
        }}
      />
    </>
  );
}
