'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Mail, MessageSquare, CheckCircle, Trash2, Calendar, User, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/components/Pagination';

const Page = styled.div``;
const Header = styled.div`
  margin-bottom: 30px;
  h1 { font-size: 2rem; font-weight: 900; color: #333; }
`;

const SearchBar = styled.div`
  background: white; padding: 15px 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  margin-bottom: 25px; display: flex; align-items: center; gap: 10px;
  input { flex: 1; border: none; outline: none; font-size: 0.95rem; }
`;

const MessagesList = styled.div`display: flex; flex-direction: column; gap: 15px;`;

const MessageCard = styled(motion.div)<{ $responded: boolean }>`
  background: white; padding: 25px; border-radius: 16px; border-left: 5px solid ${p => p.$responded ? '#7BB32E' : '#FFB800'};
  box-shadow: 0 4px 15px rgba(0,0,0,0.03); display: grid; grid-template-columns: 1fr auto; gap: 20px;
  opacity: ${p => p.$responded ? 0.8 : 1};
`;

const MsgContent = styled.div`
  .meta { display: flex; gap: 20px; margin-bottom: 12px; font-size: 0.85rem; color: #999; font-weight: 600; }
  .name { color: #333; display: flex; align-items: center; gap: 6px; }
  .email { display: flex; align-items: center; gap: 6px; }
  .date { display: flex; align-items: center; gap: 6px; margin-left: auto; }
  .text { font-size: 1rem; color: #555; line-height: 1.5; white-space: pre-wrap; }
`;

const Actions = styled.div`display: flex; flex-direction: column; gap: 10px; justify-content: center;`;

const ActionBtn = styled.button<{ $primary?: boolean }>`
  display: flex; align-items: center; gap: 8px; padding: 10px 15px; border-radius: 10px; border: none;
  font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  background: ${p => p.$primary ? p.theme.colors.primaryPale : '#fff5f5'};
  color: ${p => p.$primary ? p.theme.colors.primary : '#ff5252'};
  &:hover { background: ${p => p.$primary ? p.theme.colors.primary : '#ff5252'}; color: white; }
`;

export default function AdminMensajes() {
  const [messages, setMessages] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 10);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?page=${page}&limit=10&search=${searchTerm}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        setPagination(data.pagination);
      } else {
        alert('Error al cargar mensajes');
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al cargar mensajes');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => { 
    fetchMessages(); 
  }, [fetchMessages]);

  const toggleResponded = async (m: any) => {
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: m.id, responded: !m.responded })
      });
      if (res.ok) {
        await fetchMessages();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al actualizar mensaje');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar mensaje?')) {
      try {
        const res = await fetch('/api/admin/messages', { 
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }) 
        });
        if (res.ok) {
          await fetchMessages();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || 'Error desconocido'}`);
        }
      } catch (err) {
        console.error(err);
        alert('Error de red al eliminar mensaje');
      }
    }
  };

  return (
    <Page>
      <Header>
        <h1>Bandeja de Mensajes</h1>
      </Header>

      <SearchBar>
        <Search size={18} color="#999" />
        <input placeholder="Buscar mensajes..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </SearchBar>

      {loading ? <p>Cargando mensajes...</p> : (
        <MessagesList>
          {messages.length === 0 ? <p style={{ textAlign: 'center', color: '#999', padding: 50 }}>No hay mensajes recibidos.</p> :
            messages.map(m => (
              <MessageCard key={m.id} $responded={m.responded} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <MsgContent>
                  <div className="meta">
                    <span className="name"><User size={14} /> {m.name}</span>
                    <span className="email"><Mail size={14} /> {m.email}</span>
                    <span className="date"><Calendar size={14} /> {new Date(m.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text">{m.message}</div>
                </MsgContent>
                <Actions>
                  <ActionBtn $primary onClick={() => toggleResponded(m)}>
                    <CheckCircle size={16} /> {m.responded ? 'Marcar Pendiente' : 'Marcar Respondido'}
                  </ActionBtn>
                  <ActionBtn onClick={() => handleDelete(m.id)}>
                    <Trash2 size={16} /> Eliminar
                  </ActionBtn>
                </Actions>
              </MessageCard>
            ))
          }
        </MessagesList>
      )}

      <Pagination 
        currentPage={page} 
        totalPages={pagination.totalPages} 
        onPageChange={goToPage} 
      />
    </Page>
  );
}
