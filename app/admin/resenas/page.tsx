'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Search, Package, User, MessageCircle } from 'lucide-react';
import SafeImage from '@/components/SafeImage';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/Pagination';

const Page = styled.div``;
const Header = styled.div`
  margin-bottom: 30px;
  h1 { font-size: 2rem; font-weight: 900; color: #333; }
`;

const SearchBar = styled.div`
  background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  margin-bottom: 25px; display: flex; align-items: center; gap: 10px;
`;

const Input = styled.input`
  flex: 1; padding: 12px; border: 2px solid #f0f0f0; border-radius: 10px; font-size: 0.95rem;
  &:focus { outline: none; border-color: ${p => p.theme.colors.primary}; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px;
`;

const ReviewCard = styled(motion.div)<{ $isApproved: boolean }>`
  background: white; border-radius: 24px; padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid ${p => p.$isApproved ? '#e8f5e9' : '#fff3e0'};
  display: flex; flex-direction: column;
  position: relative;
  &::before {
    content: ''; position: absolute; top: 20px; right: 20px; width: 12px; height: 12px; border-radius: 50%;
    background: ${p => p.$isApproved ? '#4caf50' : '#ff9800'};
  }
`;

const AdminControls = styled.div`
  margin-top: 20px; padding-top: 20px; border-top: 1px dashed #eee;
  display: flex; gap: 10px; align-items: center;
`;

const AppBtn = styled.button<{ $approved: boolean }>`
  padding: 10px 20px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; cursor: pointer; border: none;
  background: ${p => p.$approved ? '#e8f5e9' : '#1a1a1a'};
  color: ${p => p.$approved ? '#2e7d32' : 'white'};
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: scale(1.02); }
`;

const DeleteBtn = styled.button`
  width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
  background: #fff0f0; color: #ff5252; border: none; cursor: pointer; transition: 0.3s;
  &:hover { background: #ff5252; color: white; }
`;

const ProductHeader = styled.div`
  display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px;
  .info {
    .name { font-weight: 900; font-size: 1.1rem; color: #333; margin-bottom: 4px; }
    .slug { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #999; letter-spacing: 1px; }
  }
`;

const UserMeta = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 15px;
  font-size: 0.85rem; font-weight: 700; color: #555;
  .name { color: #333; }
  .date { color: #999; margin-left: auto; font-weight: 600; }
`;

const Rating = styled.div`
  display: flex; gap: 4px; margin-bottom: 15px;
`;

const Content = styled.p`
  font-size: 0.95rem; color: #666; line-height: 1.6; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
`;

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleToggleApprove = async (id: string, current: boolean) => {
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isApproved: !current })
      });
      if (res.ok) fetchReviews();
    } catch (err) { alert('Error al actualizar'); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar reseña?')) {
      await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' });
      fetchReviews();
    }
  };

  const filtered = reviews.filter(r => 
    r.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Page>
      <Header>
        <h1>Gestión de Reseñas Elite</h1>
        <p style={{ color: '#666', fontWeight: 600 }}>Modera y responde a tus clientes para mejorar el SEO.</p>
      </Header>

      <SearchBar>
        <Search size={20} color="#999" />
        <Input placeholder="Filtrar por contenido o producto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </SearchBar>

      {loading ? <p>Cargando...</p> : (
        <Grid>
          {filtered.map(r => (
            <ReviewCard key={r.id} $isApproved={r.isApproved} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <ProductHeader>
                <div className="info">
                  <div className="name">{r.product.name}</div>
                  <div className="slug">{r.isApproved ? 'Publicada' : 'Pendiente de aprobación'}</div>
                </div>
              </ProductHeader>
              
              <UserMeta>
                <User size={14} color="#7BB32E" />
                <span className="name">{r.user?.name || 'Cliente'}</span>
                <span className="date">{new Date(r.createdAt).toLocaleDateString()}</span>
              </UserMeta>

              <Rating>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < r.rating ? '#FFB800' : 'none'} stroke={i < r.rating ? '#FFB800' : '#ccc'} />
                ))}
              </Rating>

              <Content>{r.content}</Content>

              <AdminControls>
                <div style={{ display: 'flex', gap: 10 }}>
                  <AppBtn $approved={r.isApproved} onClick={() => handleToggleApprove(r.id, r.isApproved)}>
                    {r.isApproved ? '✓ Aprobada' : 'Aprobar Reseña'}
                  </AppBtn>
                  <DeleteBtn onClick={() => handleDelete(r.id)}><Trash2 size={14} /></DeleteBtn>
                </div>
              </AdminControls>
            </ReviewCard>
          ))}
        </Grid>
      )}
    </Page>
  );
}
