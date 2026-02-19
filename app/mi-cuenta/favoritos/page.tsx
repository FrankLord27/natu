'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import SafeImage from '@/components/SafeImage';

const Page = styled.div`
  min-height: 100vh;
  background: ${p => p.theme.colors.background};
  padding: 60px 5%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 35px;
  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: ${p => p.theme.colors.text};
    margin-bottom: 5px;
  }
  p {
    color: ${p => p.theme.colors.textLight};
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.03);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(123,179,46,0.15);
    border-color: ${({ theme }) => theme.colors.primaryPale};
  }
`;

const ImageWrapper = styled(Link)`
  display: block;
  position: relative;
  padding-top: 100%;
  overflow: hidden;
  background: #f0f0f0;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  transition: all 0.3s;

  &:hover {
    background: #ffebee;
    color: #c62828;
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 20px;
`;

const ProductName = styled(Link)`
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  text-decoration: none;
  margin-bottom: 8px;
  line-height: 1.3;

  &:hover {
    color: ${p => p.theme.colors.primary};
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: ${p => p.theme.colors.primary};
`;

const Stock = styled.span<{ $inStock: boolean }>`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${p => p.$inStock ? '#2E7D32' : '#C62828'};
`;

const AddToCartBtn = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px;
  background: ${p => p.disabled ? '#ccc' : p.theme.colors.primary};
  color: white;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};

  &:hover {
    background: ${p => p.disabled ? '#ccc' :p.theme.colors.primaryDark};
    transform: ${p => p.disabled ? 'none' : 'translateY(-2px)'};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;

  .icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: ${p => p.theme.colors.primaryPale};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: ${p => p.theme.colors.text};
    margin-bottom: 10px;
  }

  p {
    color: ${p => p.theme.colors.textLight};
    margin-bottom: 25px;
  }

  a {
    display: inline-block;
    padding: 14px 30px;
    background: ${p => p.theme.colors.primary};
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.3s;

    &:hover {
      background: ${p => p.theme.colors.primaryDark};
      transform: translateY(-2px);
    }
  }
`;

interface FavoriteProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrls: string[];
    stock: number;
  };
}

export default function Favoritos() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchFavorites();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/user/favorites');
      const data = await res.json();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      const res = await fetch('/api/user/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        setFavorites(favorites.filter(f => f.productId !== productId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const { addToCart } = useCart();

  const handleAddToCart = (product: FavoriteProduct['product']) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrls[0] || '/placeholder.jpg'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  if (loading) {
    return <Page><Container>Cargando favoritos...</Container></Page>;
  }

  if (favorites.length === 0) {
    return (
      <Page>
        <Container>
          <Header>
            <h1>Mis Favoritos</h1>
            <p>Productos guardados</p>
          </Header>
          <EmptyState>
            <div className="icon">
              <Heart size={40} color="#E91E63" />
            </div>
            <h3>No tienes favoritos aún</h3>
            <p>Explora nuestra tienda y guarda tus productos favoritos</p>
            <Link href="/tienda">Ir a la Tienda</Link>
          </EmptyState>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <h1>Mis Favoritos</h1>
          <p>{favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}</p>
        </Header>

        <AnimatePresence>
          <Grid
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {favorites.map(fav => (
              <Card 
                key={fav.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
              >
                <ImageWrapper href={`/producto/${fav.product.id}`}>
                  <SafeImage 
                    src={fav.product.imageUrls[0] || '/placeholder.jpg'} 
                    alt={fav.product.name}
                    fill
                  />
                </ImageWrapper>
              <RemoveBtn onClick={() => removeFavorite(fav.productId)} title="Quitar de favoritos">
                <Trash2 size={18} />
              </RemoveBtn>
              <CardContent>
                <ProductName href={`/producto/${fav.product.id}`}>
                  {fav.product.name}
                </ProductName>
                <PriceRow>
                  <Price>${fav.product.price.toFixed(2)}</Price>
                  <Stock $inStock={fav.product.stock > 0}>
                    {fav.product.stock > 0 ? 'En stock' : 'Agotado'}
                  </Stock>
                </PriceRow>
                <AddToCartBtn 
                  onClick={() => handleAddToCart(fav.product)}
                  disabled={fav.product.stock === 0}
                >
                  <ShoppingCart size={18} />
                  Agregar al Carrito
                </AddToCartBtn>
              </CardContent>
              </Card>
            ))}
          </Grid>
        </AnimatePresence>
      </Container>
    </Page>
  );
}
