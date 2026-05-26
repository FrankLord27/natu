import { Metadata } from "next";
import { getProductBySlug } from "@/lib/actions";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const result = await getProductBySlug(params.slug);

  if (!result.success || !result.data) {
    return {
      title: "Producto no encontrado | NaturaJM",
      description: "El producto que buscas no está disponible actualmente.",
    };
  }

  const product = result.data;
  const description = product.description || "";

  return {
    title: `${product.name} | NaturaJM`,
    description: description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: description.substring(0, 160),
      images: product.imageUrls[0] ? [{ url: product.imageUrls[0] }] : [],
    },
  };
}

export default function ProductLayout({ children }: Props) {
  return <>{children}</>;
}
