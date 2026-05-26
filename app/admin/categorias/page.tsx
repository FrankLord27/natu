"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Plus, Edit2, Trash2, Tag, Search } from "lucide-react";
import { getCategories } from "@/lib/actions";
import { Category } from "@/types";
import SafeImage from "@/components/SafeImage";

const Page = styled.div`
  padding: 30px;
`;

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
  padding: 12px 24px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    filter: brightness(1.1);
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 18px 20px;
  background: #f8f8f8;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #666;
  border-bottom: 2px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.95rem;
`;

const ActionBtn = styled.button<{ $color?: string }>`
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${(p) => p.$color || "#999"};
  &:hover {
    background: #f5f5f5;
    color: ${(p) => p.$color || p.theme.colors.primary};
  }
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
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  padding: 35px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;
const Label = styled.label`
  display: block;
  font-weight: 800;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #333;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
  }
`;
const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #eee;
  border-radius: 10px;
  font-size: 0.95rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
`;
const CancelBtn = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  color: #888;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
`;
const SaveBtn = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  color: white;
  border: none;
  cursor: pointer;
  background: ${(p) => p.theme.colors.primary};
  &:disabled {
    opacity: 0.5;
  }
`;

import { motion, AnimatePresence } from "framer-motion";

export default function CategoriasAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const res = await getCategories();
    if (res.success) setCategories(res.data as Category[]);
    setLoading(false);
  };

  const openCreate = () => {
    setEditData({ name: "", slug: "", description: "", imageUrl: "" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || "",
    });
    setEditingId(cat.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const endpoint = "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...editData, id: editingId } : editData;

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowModal(false);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(`Error al guardar: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al guardar la categoría");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "¿Estás seguro de eliminar esta categoría? Se desvincularán los productos asociados.",
      )
    ) {
      try {
        const res = await fetch("/api/categories", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          fetchCategories();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || "Error desconocido"}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error de red al intentar eliminar la categoría");
      }
    }
  };

  return (
    <Page>
      <Header>
        <h1>Gestión de Categorías</h1>
        <AddBtn onClick={openCreate}>
          <Plus size={20} /> Nueva Categoría
        </AddBtn>
      </Header>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>Imagen</Th>
              <Th>Categoría</Th>
              <Th>Slug</Th>
              <Th>Productos</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                  Cargando...
                </Td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <Td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                  No hay categorías aún
                </Td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  <Td>
                    {cat.imageUrl ? (
                      <SafeImage
                        src={cat.imageUrl}
                        alt={cat.name}
                        width={40}
                        height={40}
                        style={{ borderRadius: 8, objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 8,
                          background: "#f0f0f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ccc",
                        }}
                      >
                        <Tag size={20} />
                      </div>
                    )}
                  </Td>
                  <Td style={{ fontWeight: 700 }}>{cat.name}</Td>
                  <Td style={{ color: "#999" }}>{cat.slug}</Td>
                  <Td>{cat._count?.products || 0}</Td>
                  <Td>
                    <div style={{ display: "flex", gap: 10 }}>
                      <ActionBtn onClick={() => openEdit(cat)}>
                        <Edit2 size={16} />
                      </ActionBtn>
                      <ActionBtn
                        $color="#ff5252"
                        onClick={() => handleDelete(cat.id)}
                      >
                        <Trash2 size={16} />
                      </ActionBtn>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2
                style={{
                  fontWeight: 900,
                  marginBottom: 25,
                  fontSize: "1.5rem",
                }}
              >
                {editingId ? "Editar Categoría" : "Nueva Categoría"}
              </h2>

              <FormGroup>
                <Label>Nombre de la Categoría</Label>
                <Input
                  value={editData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^\w-]+/g, "");
                    setEditData({ ...editData, name, slug });
                  }}
                  placeholder="Ej: Aceites Esenciales"
                />
              </FormGroup>

              <FormGroup>
                <Label>Slug (URL)</Label>
                <Input
                  value={editData.slug}
                  readOnly
                  style={{ background: "#f9f9f9", color: "#999" }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Imagen (URL)</Label>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Input
                    value={editData.imageUrl}
                    onChange={(e) =>
                      setEditData({ ...editData, imageUrl: e.target.value })
                    }
                    placeholder="https://..."
                  />
                  {editData.imageUrl && (
                    <SafeImage
                      src={editData.imageUrl}
                      alt="preview"
                      width={45}
                      height={45}
                      style={{ borderRadius: 8, objectFit: "cover" }}
                    />
                  )}
                </div>
              </FormGroup>

              <FormGroup>
                <Label>Descripción (Opcional)</Label>
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  placeholder="Breve descripción de la categoría..."
                />
              </FormGroup>

              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>
                  Cancelar
                </CancelBtn>
                <SaveBtn
                  onClick={handleSave}
                  disabled={saving || !editData.name}
                >
                  {saving
                    ? "Guardando..."
                    : editingId
                      ? "Actualizar"
                      : "Crear Categoría"}
                </SaveBtn>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
