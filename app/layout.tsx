import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.scss";
import StyledComponentsRegistry from "@/lib/registry";
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Header } from "@/components/layout/Header";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://naturajm.com"),
  title: {
    default: "NaturaJM V3 - Tienda Online de Productos Naturales",
    template: "%s | NaturaJM",
  },
  description:
    "Aceites, harinas y cosméticos naturales para tu bienestar. Productos 100% naturales de la más alta calidad en República Dominicana.",
  keywords: [
    "productos naturales",
    "aceites naturales",
    "harinas integrales",
    "cosmética natural",
    "NaturaJM",
    "bajar de peso",
    "bienestar",
    "remedios caseros",
  ],
  openGraph: {
    title: "NaturaJM V3 - Productos Naturales",
    description:
      "Descubre el poder de la naturaleza con nuestros aceites, harinas y cosméticos artesanales.",
    url: "https://naturajm.com",
    siteName: "NaturaJM",
    locale: "es_DO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <StyledComponentsRegistry>
            <CartProvider>
              <OrderProvider>
                <WishlistProvider>
                  <Header />
                  <main>{children}</main>
                  <ConditionalFooter />
                  <WhatsAppButton />
                  <CartDrawer />
                  <Toaster richColors position="top-right" />
                </WishlistProvider>
              </OrderProvider>
            </CartProvider>
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
