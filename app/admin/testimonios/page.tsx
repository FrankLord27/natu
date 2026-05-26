"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Plus, Search, Edit, Trash2, Star, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import SafeImage from "@/components/SafeImage";

const Page = styled.div``;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  h1 {
    font-size: 2rem;
    font-weight: 900;
    color: #333;
  }
`;

const AddBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s;
  &:hover {
    filter: brightness(1.1);
  }
`;

const SearchBar = styled.div`
  background: white;
  padding: 15px 25px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 0.95rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
`;

const TestimonialCard = styled(motion.div)`
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  border: 1px solid #f0f0f0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    background: #eee;
    position: relative;
  }
  .name {
    font-weight: 800;
    color: #333;
  }
`;

const Content = styled.p`
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
  font-style: italic;
  margin-bottom: 20px;
  &::before {
    content: '"';
  }
  &::after {
    content: '"';
  }
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
  color: #ffb800;
  margin-bottom: 15px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f5f5f5;
  padding-top: 15px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 24px;
  max-width: 500px;
  width: 100%;
  padding: 35px;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;
const Label = styled.label`
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #333;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 0.95rem;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
  }
`;

export default function AdminTestimonios() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    content: "",
    rating: 5,
    imageUrl: "",
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/testimonials?page=${page}&limit=10&search=${searchTerm}`,
      );
      const data = await res.json();
      if (data.success) {
        setTestimonials(data.testimonials);
        setPagination(data.pagination);
      } else {
        alert("Error al cargar testimonios");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cargar testimonios");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSave = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...editData, id: editingId } : editData;
      const res = await fetch("/api/admin/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        await fetchTestimonials();
      } else {
        const data = await res.json();
        alert(`Error al guardar: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al guardar el testimonio");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar testimonio?")) {
      try {
        const res = await fetch("/api/admin/testimonials", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          await fetchTestimonials();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || "Error desconocido"}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error de red al eliminar el testimonio");
      }
    }
  };

  const toggleActive = async (t: any) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, isActive: !t.isActive }),
      });
      if (res.ok) {
        await fetchTestimonials();
      } else {
        const data = await res.json();
        alert(`Error al cambiar estado: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cambiar estado");
    }
  };

  return (
    <Page>
      <Header>
        <h1>Gestión de Testimonios</h1>
        <AddBtn
          onClick={() => {
            setEditingId(null);
            setEditData({
              name: "",
              content: "",
              rating: 5,
              imageUrl: "",
              isActive: true,
            });
            setShowModal(true);
          }}
        >
          <Plus size={20} /> Nuevo Testimonio
        </AddBtn>
      </Header>

      <SearchBar>
        <Search size={18} color="#999" />
        <input
          placeholder="Buscar testimonios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Grid>
          {testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <UserInfo>
                <div className="avatar">
                  {t.imageUrl ? (
                    <SafeImage
                      src={t.imageUrl}
                      alt={t.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span>{t.name[0]}</span>
                  )}
                </div>
                <div className="name">{t.name}</div>
                {!t.isActive && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#ffebee",
                      color: "#c62828",
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontWeight: 700,
                    }}
                  >
                    OCULTO
                  </span>
                )}
              </UserInfo>
              <Stars>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < t.rating ? "#FFB800" : "none"}
                    stroke={i < t.rating ? "#FFB800" : "#ccc"}
                  />
                ))}
              </Stars>
              <Content>{t.content}</Content>
              <Actions>
                <div style={{ display: "flex", gap: 5 }}>
                  <button
                    onClick={() => toggleActive(t)}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: t.isActive ? "#999" : "#7BB32E",
                    }}
                  >
                    {t.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(t.id);
                      setEditData({ ...t });
                      setShowModal(true);
                    }}
                    style={{
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      color: "#999",
                    }}
                  >
                    <Edit size={18} />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(t.id)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    color: "#ff5252",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </Actions>
            </TestimonialCard>
          ))}
        </Grid>
      )}

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />

      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontWeight: 900, marginBottom: 25 }}>
                {editingId ? "Editar Testimonio" : "Nuevo Testimonio"}
              </h2>
              <FormGroup>
                <Label>Nombre del Cliente</Label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>Calificación (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={editData.rating}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      rating: parseInt(e.target.value),
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>Testimonio</Label>
                <Textarea
                  value={editData.content}
                  onChange={(e) =>
                    setEditData({ ...editData, content: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>URL de Imagen (Opcional)</Label>
                <Input
                  value={editData.imageUrl || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, imageUrl: e.target.value })
                  }
                />
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 20,
                }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    background: "#f5f5f5",
                    border: "none",
                    fontWeight: 700,
                    color: "#666",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    background: "#7BB32E",
                    border: "none",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  Guardar
                </button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
