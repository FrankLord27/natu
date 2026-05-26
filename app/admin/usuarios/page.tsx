"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  User,
  Mail,
  Calendar,
  Hash,
  Search,
  ArrowRight,
  Edit,
  Trash2,
  Phone,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Loader } from "@/components/ui/Loader";

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

const SearchBar = styled.div`
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 2px solid #f0f0f0;
  border-radius: 10px;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
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
  font-size: 0.9rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${(p) => p.theme.colors.primaryPale};
    color: ${(p) => p.theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.8rem;
  }
  .details {
    .name {
      font-weight: 700;
      color: #333;
    }
    .email {
      font-size: 0.8rem;
      color: #999;
    }
  }
`;

const OrderCount = styled.span`
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #666;
`;

const ActionBtn = styled.button<{ $color?: string }>`
  border: none;
  background: none;
  cursor: pointer;
  color: ${(p) => p.$color || "#999"};
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
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
  border-radius: 24px;
  max-width: 450px;
  width: 100%;
  padding: 35px;
  h2 {
    font-weight: 900;
    margin-bottom: 25px;
  }
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

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
`;
const CancelBtn = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  background: #f5f5f5;
  border: none;
  font-weight: 700;
  color: #666;
  cursor: pointer;
`;
const SaveBtn = styled.button`
  padding: 12px 20px;
  border-radius: 12px;
  background: ${(p) => p.theme.colors.primary};
  color: white;
  border: none;
  font-weight: 700;
  cursor: pointer;
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  border-bottom: 1px solid #f0f0f0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 20px;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  background: none;
  color: ${(p) => (p.$active ? p.theme.colors.primary : "#999")};
  border-bottom: 2px solid
    ${(p) => (p.$active ? p.theme.colors.primary : "transparent")};
  transition: all 0.2s;
  &:hover {
    color: ${(p) => p.theme.colors.primary};
  }
`;

export default function UsuariosAdmin() {
  const [userType, setUserType] = useState<"customer" | "admin">("customer");
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editData, setEditData] = useState({ name: "", email: "", phone: "" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?page=${page}&limit=10&search=${searchTerm}&type=${userType}`,
      );
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, userType]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setEditData({
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingUser.id,
          type: userType,
          ...editData,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        await fetchUsers();
      } else {
        const data = await res.json();
        alert(`Error al editar: ${data.error || "Error desconocido"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al intentar editar usuario");
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "¿Eliminar este usuario permanentemente? Esto no afectará sus pedidos históricos pero no podrá volver a entrar.",
      )
    ) {
      try {
        const res = await fetch("/api/admin/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, type: userType }),
        });
        if (res.ok) {
          await fetchUsers();
        } else {
          const data = await res.json();
          alert(`Error al eliminar: ${data.error || "Error desconocido"}`);
        }
      } catch (err) {
        console.error(err);
        alert("Error de red al intentar eliminar usuario");
      }
    }
  };

  return (
    <Page>
      <Header>
        <h1>Gestión de Usuarios</h1>
      </Header>

      <Tabs>
        <Tab
          $active={userType === "customer"}
          onClick={() => setUserType("customer")}
        >
          Clientes
        </Tab>
        <Tab
          $active={userType === "admin"}
          onClick={() => setUserType("admin")}
        >
          Administradores
        </Tab>
      </Tabs>

      <SearchBar>
        <Search size={20} color="#999" />
        <SearchInput
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchBar>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <Th>Usuario</Th>
              <Th>Teléfono</Th>
              <Th>Pedidos</Th>
              <Th>Registrado en</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <Td colSpan={5} style={{ padding: 60 }}>
                  <Loader size={10} />
                </Td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <Td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                  No se encontraron usuarios
                </Td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id}>
                  <Td>
                    <UserInfo>
                      <div className="avatar">
                        {(user.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="details">
                        <div className="name">{user.name || "Sin nombre"}</div>
                        <div className="email">{user.email}</div>
                      </div>
                    </UserInfo>
                  </Td>
                  <Td>{user.phone || "N/A"}</Td>
                  <Td>
                    <OrderCount>{user._count?.orders || 0}</OrderCount>
                  </Td>
                  <Td>
                    {new Date(user.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Td>
                  <Td>
                    <div style={{ display: "flex", gap: 8 }}>
                      {userType === "customer" && (
                        <Link
                          href={`/admin/pedidos?userId=${user.id}`}
                          title="Ver Pedidos"
                        >
                          <ActionBtn>
                            <ArrowRight size={18} />
                          </ActionBtn>
                        </Link>
                      )}
                      <ActionBtn
                        onClick={() => handleEdit(user)}
                        title="Editar"
                      >
                        <Edit size={18} />
                      </ActionBtn>
                      <ActionBtn
                        onClick={() => handleDelete(user.id)}
                        $color="#ff5252"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </ActionBtn>
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
              <h2>Editar Perfil de Usuario</h2>
              <FormGroup>
                <Label>Nombre Completo</Label>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>Correo Electrónico</Label>
                <Input
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label>Teléfono</Label>
                <Input
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                />
              </FormGroup>
              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>
                  Cancelar
                </CancelBtn>
                <SaveBtn onClick={handleSave}>Guardar Cambios</SaveBtn>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
