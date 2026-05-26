"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Mail, UserX, UserCheck, Trash2, Download, Search } from "lucide-react";
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

const ExportBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #333;
  color: white;
  border-radius: 12px;
  font-weight: 700;
  transition: all 0.3s;
  &:hover {
    background: #000;
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

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;
const Th = styled.th`
  text-align: left;
  padding: 18px 25px;
  background: #f8f8f8;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #888;
  border-bottom: 2px solid #eee;
`;
const Td = styled.td`
  padding: 18px 25px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 0.95rem;
`;

const Status = styled.span<{ $active: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 800;
  background: ${(p) => (p.$active ? "#e8f5e9" : "#fff3e0")};
  color: ${(p) => (p.$active ? "#2e7d32" : "#e67e22")};
`;

const ActionIcon = styled.button<{ $color?: string }>`
  border: none;
  background: none;
  cursor: pointer;
  color: ${(p) => p.$color || "#999"};
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover {
    background: #f5f5f5;
    color: ${(p) => p.$color || "#333"};
  }
`;

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 15);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/newsletter?page=${page}&limit=15&search=${searchTerm}`,
      );
      const data = await res.json();
      if (data.success) {
        setSubscribers(data.subscribers);
        setPagination(data.pagination);
      } else {
        alert("Error al cargar suscriptores");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cargar suscriptores");
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const toggleStatus = async (s: any) => {
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, isActive: !s.isActive }),
      });
      if (res.ok) {
        await fetchSubscribers();
      } else {
        const data = await res.json();
        alert(`Error al cambiar estado: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al cambiar estado");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar suscriptor?")) {
      try {
        const res = await fetch("/api/admin/newsletter", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (res.ok) {
          await fetchSubscribers();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || "Error desconocido"}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error de red al eliminar suscriptor");
      }
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Estado", "Fecha Registro"];
    const rows = subscribers.map((s) => [
      s.email,
      s.isActive ? "Activo" : "Inactivo",
      new Date(s.createdAt).toLocaleDateString(),
    ]);
    const content = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "suscriptores_newsletter.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Page>
      <Header>
        <h1>Suscriptores Newsletter</h1>
        <ExportBtn onClick={exportCSV} disabled={subscribers.length === 0}>
          <Download size={18} /> Exportar CSV
        </ExportBtn>
      </Header>

      <SearchBar>
        <Search size={18} color="#999" />
        <input
          placeholder="Buscar suscriptores..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>Email</Th>
              <Th>Estado</Th>
              <Th>Fecha</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                  Cargando...
                </Td>
              </tr>
            ) : subscribers.length === 0 ? (
              <tr>
                <Td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                  Sin suscriptores aún.
                </Td>
              </tr>
            ) : (
              subscribers.map((s) => (
                <tr key={s.id}>
                  <Td style={{ fontWeight: 700 }}>
                    <Mail
                      size={14}
                      style={{ marginRight: 8, verticalAlign: "middle" }}
                    />{" "}
                    {s.email}
                  </Td>
                  <Td>
                    <Status $active={s.isActive}>
                      {s.isActive ? "ACTIVO" : "INACTIVO"}
                    </Status>
                  </Td>
                  <Td>{new Date(s.createdAt).toLocaleDateString()}</Td>
                  <Td>
                    <div style={{ display: "flex", gap: 5 }}>
                      <ActionIcon
                        $color={s.isActive ? "#e67e22" : "#2e7d32"}
                        onClick={() => toggleStatus(s)}
                        title={s.isActive ? "Desactivar" : "Activar"}
                      >
                        {s.isActive ? (
                          <UserX size={18} />
                        ) : (
                          <UserCheck size={18} />
                        )}
                      </ActionIcon>
                      <ActionIcon
                        $color="#ff5252"
                        onClick={() => handleDelete(s.id)}
                      >
                        <Trash2 size={18} />
                      </ActionIcon>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={goToPage}
      />
    </Page>
  );
}
