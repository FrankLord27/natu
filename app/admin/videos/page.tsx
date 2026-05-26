"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  Plus,
  Video,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";

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

const VideosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 25px;
`;

const VideoCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
`;

const VideoThumb = styled.div`
  aspect-ratio: 16 / 9;
  background: #000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  iframe {
    border: none;
    width: 100%;
    height: 100%;
  }
`;

const VideoInfo = styled.div`
  padding: 20px;
  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #333;
    margin-bottom: 8px;
  }
  p {
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 15px;
  }
`;

const Badge = styled.span<{ $active: boolean }>`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  background: ${(p) => (p.$active ? "#7BB32E" : "#999")};
  color: white;
`;

const CardActions = styled.div`
  display: flex;
  gap: 10px;
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
  margin-bottom: 20px;
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

export default function AdminVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 6);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    url: "",
    description: "",
    order: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/videos?page=${page}&limit=6&search=${searchTerm}`,
      );
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos);
        setPagination(data.pagination);
      } else {
        alert("Error al cargar videos");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cargar videos");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSave = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...editData, id: editingId } : editData;
      const res = await fetch("/api/admin/videos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        await fetchVideos();
      } else {
        const data = await res.json();
        alert(`Error al guardar: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al guardar el video");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar video?")) {
      try {
        const res = await fetch("/api/admin/videos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          await fetchVideos();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || "Error desconocido"}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error de red al eliminar el video");
      }
    }
  };

  const toggleStatus = async (v: any) => {
    try {
      const res = await fetch("/api/admin/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: v.id, isActive: !v.isActive }),
      });
      if (res.ok) {
        await fetchVideos();
      } else {
        const data = await res.json();
        alert(`Error al cambiar estado: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cambiar estado");
    }
  };

  // Extract YouTube ID Helper
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/embed/")) return url;
    const idMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|user\/\S+|live\/))([^?&"'> ]+)/,
    );
    return idMatch ? `https://www.youtube.com/embed/${idMatch[1]}` : url;
  };

  return (
    <Page>
      <Header>
        <h1>Gestión de Videos</h1>
        <AddBtn
          onClick={() => {
            setEditingId(null);
            setEditData({
              title: "",
              url: "",
              description: "",
              order: 0,
              isActive: true,
            });
            setShowModal(true);
          }}
        >
          <Plus size={20} /> Nuevo Video
        </AddBtn>
      </Header>

      <SearchBar>
        <Search size={18} color="#999" />
        <input
          placeholder="Buscar videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      {loading ? (
        <p>Cargando videos...</p>
      ) : (
        <VideosGrid>
          {videos.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                gridColumn: "1 / -1",
                padding: "50px",
                color: "#999",
              }}
            >
              No se han añadido videos aún.
            </p>
          ) : (
            videos.map((v) => (
              <VideoCard
                key={v.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <VideoThumb>
                  <Badge $active={v.isActive}>
                    {v.isActive ? "Activo" : "Oculto"}
                  </Badge>
                  <iframe
                    src={getEmbedUrl(v.url)}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </VideoThumb>
                <VideoInfo>
                  <h3>{v.title}</h3>
                  <p>{v.description || "Sin descripción"}</p>
                  <CardActions>
                    <button
                      onClick={() => toggleStatus(v)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#999",
                      }}
                    >
                      {v.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(v.id);
                        setEditData({ ...v });
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
                    <button
                      onClick={() => handleDelete(v.id)}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#ff5252",
                        marginLeft: "auto",
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </CardActions>
                </VideoInfo>
              </VideoCard>
            ))
          )}
        </VideosGrid>
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
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontWeight: 900, marginBottom: 25 }}>
                {editingId ? "Editar Video" : "Añadir Video"}
              </h2>
              <FormGroup>
                <Label>Título del Video</Label>
                <Input
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>YouTube URL / Embed URL</Label>
                <Input
                  value={editData.url}
                  onChange={(e) =>
                    setEditData({ ...editData, url: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </FormGroup>
              <FormGroup>
                <Label>Descripción</Label>
                <Input
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
              </FormGroup>
              <div
                style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
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
