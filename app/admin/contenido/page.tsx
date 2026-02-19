'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, Trash2, Plus, Info, Globe, Layout, Search, Sparkles, Home, Phone, ShieldCheck } from 'lucide-react';

// Catálogo de Secciones Predefinidas (Presets)
const SECTION_PRESETS: any = {
  homepage_hero: {
    name: 'Sección de Bienvenida (Inicio)',
    description: 'El primer texto que ven los usuarios al entrar a la tienda.',
    icon: <Home size={20} />,
    default: { title: 'Bienvenidos a NaturaJM', subtitle: 'Productos naturales para tu bienestar', buttonText: 'Explorar Tienda' }
  },
  seo_global: {
    name: 'Optimización para Google (SEO)',
    description: 'Palabras clave y títulos que ayudan a que tu sitio aparezca en búsquedas.',
    icon: <Globe size={20} />,
    default: { siteTitle: 'NaturaJM - Tienda Natural', metaDescription: 'La mejor selección de productos naturales y orgánicos.', keywords: 'natural, salud, bienestar, tienda' }
  },
  contact_info: {
    name: 'Información de Contacto',
    description: 'Datos visibles en el pie de página y página de contacto.',
    icon: <Phone size={20} />,
    default: { whatsapp: '+123456789', email: 'contacto@naturajm.com', address: 'Calle Principal #123' }
  },
  legal_notice: {
    name: 'Avisos Legales & Privacidad',
    description: 'Textos para términos y condiciones.',
    icon: <ShieldCheck size={20} />,
    default: { privacyPolicy: 'Tu privacidad es importante para nosotros...', terms: 'Al usar este sitio aceptas...' }
  }
};

const Page = styled.div``;
const Header = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;
  h1 { font-size: 2rem; font-weight: 900; color: #333; }
`;

const AddBtn = styled.button`
  display: flex; align-items: center; gap: 8px; padding: 12px 24px;
  background: ${p => p.theme.colors.primary}; color: white; border-radius: 12px;
  font-weight: 700; transition: all 0.3s;
  &:hover { filter: brightness(1.1); }
`;

const ContentGrid = styled.div`
  display: flex; flex-direction: column; gap: 15px;
`;

const ContentCard = styled(motion.div)`
  background: white; border-radius: 16px; padding: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #f5f5f5;
`;

const CardHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
  .key { font-family: monospace; font-weight: 800; color: ${p => p.theme.colors.primary}; font-size: 0.9rem; background: #f9f9f9; padding: 4px 10px; border-radius: 6px; }
  .meta { font-size: 0.75rem; color: #999; }
`;

const FieldLabel = styled.label`display: block; font-weight: 700; font-size: 0.8rem; margin-bottom: 6px; color: #666;`;
const Input = styled.input`
  width: 100%; padding: 12px; border: 2px solid #f0f0f0; border-radius: 10px; font-size: 0.95rem; margin-bottom: 12px;
  &:focus { outline: none; border-color: ${p => p.theme.colors.primary}; }
`;
const Textarea = styled.textarea`
  width: 100%; padding: 12px; border: 2px solid #f0f0f0; border-radius: 10px; font-size: 0.95rem; min-height: 80px; resize: vertical; margin-bottom: 12px;
  &:focus { outline: none; border-color: ${p => p.theme.colors.primary}; }
`;

const CardActions = styled.div`
  display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;
`;

const SaveBtn = styled.button`
  padding: 8px 18px; border-radius: 8px; background: ${p => p.theme.colors.primary}; color: white; border: none; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DelIcon = styled.button`
  background: none; border: none; color: #ff5252; cursor: pointer; padding: 8px; border-radius: 8px; &:hover { background: #fff5f5; }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 3000;
  display: flex; align-items: center; justify-content: center; padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white; border-radius: 24px; max-width: 500px; width: 100%; padding: 35px;
`;

export default function AdminContenido() {
  const [contentList, setContentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [editingValues, setEditingValues] = useState<any>({});

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      if (data.success) {
        setContentList(data.content);
        const vals: any = {};
        data.content.forEach((c: any) => { vals[c.id] = c.value; });
        setEditingValues(vals);
      }
    } catch (err) {
      console.error(err);
      alert('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string, key: string) => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ key, value: editingValues[id] })
      });
      if (res.ok) {
        alert('Contenido guardado exitosamente');
        fetchContent();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al guardar contenido');
    }
  };

  const handleCreate = async (key: string) => {
    const preset = SECTION_PRESETS[key];
    if (!preset) return;
    
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ key, value: preset.default })
      });
      if (res.ok) {
        setShowModal(false);
        fetchContent();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de red al crear');
    }
  };

  const initializeWorkspace = async () => {
    if (!confirm('Esto creará las secciones básicas del sitio. ¿Continuar?')) return;
    setLoading(true);
    try {
      for (const key of Object.keys(SECTION_PRESETS)) {
        await fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: SECTION_PRESETS[key].default })
        });
      }
      fetchContent();
    } catch (err) {
      alert('Error al inicializar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar esta clave de contenido?')) {
      try {
        const res = await fetch('/api/admin/content', {
          method: 'DELETE', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ id })
        });
        if (res.ok) {
          fetchContent();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || 'Error desconocido'}`);
        }
      } catch (err) {
        console.error(err);
        alert('Error de red al eliminar');
      }
    }
  };

  return (
    <Page>
      <Header>
        <h1>Contenido Dinámico & SEO</h1>
        <AddBtn onClick={() => setShowModal(true)}>
          <Plus size={20} /> Nueva Clave
        </AddBtn>
      </Header>

      <div style={{ background: 'white', padding: '30px', borderRadius: '16px', marginBottom: 25, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: '5px solid #7BB32E' }}>
        <div style={{ display: 'flex', gap: 15, alignItems: 'center', marginBottom: 10 }}>
          <Sparkles size={24} color="#7BB32E" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Guía ràpida del Editor</h2>
        </div>
        <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Usa esta herramienta para cambiar textos de tu web sin tocar código. 
          Selecciona una sección del <strong>Catálogo</strong> o inicializa las secciones recomendadas.
        </p>
      </div>

      {loading ? <p>Cargando contenido...</p> : (
        <ContentGrid>
          {contentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: 20 }}>
              <Layout size={60} color="#ddd" strokeWidth={1} style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: 10 }}>Editor Vacío</h3>
              <p style={{ color: '#999', marginBottom: 30 }}>Parece que no has configurado tus secciones. Haz clic abajo para lanzar las automáticas.</p>
              <SaveBtn onClick={initializeWorkspace} style={{ margin: '0 auto', padding: '15px 30px' }}>
                <Sparkles size={20} /> Lanzar Secciones Predeterminadas
              </SaveBtn>
            </div>
          ) : (
            contentList.map(item => {
              const preset = SECTION_PRESETS[item.key];
              return (
                <ContentCard key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <CardHeader>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: '#7BB32E' }}>{preset?.icon || <Globe size={18} />}</span>
                      <strong style={{ fontSize: '1rem' }}>{preset?.name || item.key}</strong>
                    </div>
                    <span className="meta">ID Tecnico: <code>{item.key}</code></span>
                  </CardHeader>
                  
                  {preset && <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 15 }}>{preset.description}</p>}
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 15 }}>
                    {Object.keys(item.value).map(field => (
                      <div key={field}>
                        <FieldLabel>{field.replace(/([A-Z])/g, ' $1').toUpperCase()}</FieldLabel>
                        {item.value[field].length > 60 ? (
                          <Textarea 
                            value={editingValues[item.id]?.[field] || ''} 
                            onChange={e => setEditingValues({ ...editingValues, [item.id]: { ...editingValues[item.id], [field]: e.target.value } })}
                          />
                        ) : (
                          <Input 
                            value={editingValues[item.id]?.[field] || ''} 
                            onChange={e => setEditingValues({ ...editingValues, [item.id]: { ...editingValues[item.id], [field]: e.target.value } })}
                          />
                        )}
                      </div>
                    ))}
                  </div>

              <CardActions>
                <DelIcon onClick={() => handleDelete(item.id)}><Trash2 size={16} /></DelIcon>
                <SaveBtn onClick={() => handleSave(item.id, item.key)}>
                  <Save size={16} /> Guardar Cambios
                </SaveBtn>
              </CardActions>
                </ContentCard>
              );
            })
          )}
        </ContentGrid>
      )}

      <AnimatePresence>
        {showModal && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}>
            <ModalContent initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontWeight: 900, marginBottom: 15 }}>Añadir Nueva Sección</h2>
              <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 20 }}>Selecciona una sección del catálogo para empezar a editarla.</p>
              
              <div style={{ display: 'grid', gap: 10 }}>
                {Object.keys(SECTION_PRESETS).map(key => {
                  const isExisting = contentList.some(c => c.key === key);
                  return (
                    <button 
                      key={key} 
                      disabled={isExisting}
                      onClick={() => handleCreate(key)}
                      style={{ 
                        padding: '15px', borderRadius: 12, border: '2px solid #f0f0f0', background: 'white', 
                        display: 'flex', alignItems: 'center', gap: 12, cursor: isExisting ? 'not-allowed' : 'pointer',
                        opacity: isExisting ? 0.5 : 1, textAlign: 'left', transition: 'all 0.2s'
                      }}
                    >
                      <span style={{ color: '#7BB32E' }}>{SECTION_PRESETS[key].icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{SECTION_PRESETS[key].name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#999' }}>{isExisting ? 'Ya añadida' : SECTION_PRESETS[key].description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 25 }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '12px 20px', borderRadius: 12, background: '#f5f5f5', border: 'none', fontWeight: 700, color: '#666', cursor: 'pointer' }}>Cerrar</button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
