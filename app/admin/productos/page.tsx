"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import SafeImage from "@/components/SafeImage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  LayoutGrid,
  List,
} from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/Pagination";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { getAdminProducts } from "@/lib/actions";
import { ProductGridSkeleton } from "@/components/admin/SkeletonLoaders";
import { toast } from "sonner";

const Page = styled.div``;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
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
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 0 14px;
  margin-bottom: 25px;
  max-width: 400px;
  &:focus-within {
    border-color: ${(p) => p.theme.colors.primary};
  }
  input {
    border: none;
    outline: none;
    padding: 12px 8px;
    flex: 1;
    font-size: 0.9rem;
  }
`;

const Table = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 100px 80px 120px;
  padding: 14px 20px;
  background: #f8f8f8;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #888;
  @media (max-width: 768px) {
    display: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 1fr 100px 80px 120px;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  transition: background 0.2s;
  &:hover {
    background: #fafafa;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ProductImg = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
`;

const ProductName = styled.div`
  h4 {
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 3px;
  }
  span {
    font-size: 0.8rem;
    color: #999;
  }
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $active }) => ($active ? "#e8f5e9" : "#ffeee8")};
  color: ${({ $active }) => ($active ? "#2e7d32" : "#c62828")};
`;

const ActionBtns = styled.div`
  display: flex;
  gap: 5px;
`;
const ActionIcon = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: #999;
  &:hover {
    background: #f0f0f0;
    color: #333;
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
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 35px;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;
const LabelStyled = styled.label`
  display: block;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 6px;
  color: #333;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
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
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  min-height: 80px;
  resize: vertical;
  &:focus {
    border-color: ${(p) => p.theme.colors.primary};
    outline: none;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
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
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  color: #666;
  background: #f5f5f5;
`;
const SaveBtn = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  color: white;
  background: ${(p) => p.theme.colors.primary};
  &:disabled {
    opacity: 0.5;
  }
`;

const Empty = styled.div`
  text-align: center;
  padding: 60px;
  color: #ccc;
  p {
    font-weight: 600;
    color: #999;
    margin-top: 10px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f0f0f0;
  border-radius: 10px;
  padding: 4px;
  gap: 2px;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => (p.$active ? "white" : "transparent")};
  color: ${(p) => (p.$active ? "#333" : "#999")};
  box-shadow: ${(p) => (p.$active ? "0 1px 4px rgba(0,0,0,0.1)" : "none")};
  transition: all 0.2s;
`;

const MosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 20px;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
`;

const CardImg = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
`;

const CardBody = styled.div`
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const CardName = styled.div`
  font-weight: 800;
  font-size: 0.9rem;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardCategory = styled.div`
  font-size: 0.75rem;
  color: #999;
  font-weight: 600;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const CardPrice = styled.div`
  font-weight: 900;
  font-size: 1.05rem;
  color: ${(p) => p.theme.colors.primary};
`;

const StockPill = styled.button<{ $level: "ok" | "low" | "out" }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: all 0.15s;
  background: ${(p) =>
    p.$level === "ok" ? "#e8f5e9" : p.$level === "low" ? "#fff8e1" : "#ffebee"};
  color: ${(p) =>
    p.$level === "ok" ? "#2e7d32" : p.$level === "low" ? "#f57f17" : "#c62828"};
  &:hover {
    filter: brightness(0.95);
  }
`;

const CardActions = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
  border-top: 1px solid #f5f5f5;
  padding-top: 10px;
`;

const CardActionBtn = styled.button<{ $danger?: boolean }>`
  flex: 1;
  padding: 7px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.2s;
  background: ${(p) => (p.$danger ? "#fff0f0" : "#f5f5f5")};
  color: ${(p) => (p.$danger ? "#c62828" : "#555")};
  &:hover {
    background: ${(p) => (p.$danger ? "#ffebee" : "#ebebeb")};
  }
`;

interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  costPrice: string;
  stock: string;
  categoryId: string;
  imageUrls: string[];
  isActive: boolean;
  brand: string;
  ingredients: string;
  howToUse: string;
}

const emptyProduct: ProductData = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  costPrice: "",
  stock: "",
  categoryId: "",
  imageUrls: [],
  isActive: true,
  brand: "",
  ingredients: "",
  howToUse: "",
};

export default function AdminProductos() {
  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const { page, goToPage } = usePagination(1, 12);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<ProductData>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [stockAdjust, setStockAdjust] = useState<{
    id: string;
    name: string;
    current: number;
    value: string;
  } | null>(null);
  const [savingStock, setSavingStock] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminProducts({
        page,
        limit,
        search,
      });
      if (res.success) {
        setProducts(res.data as any[]);
        setPagination(res.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setEditData(emptyProduct);
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (p: any) => {
    setEditData({
      name: p.name,
      description: p.description,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      costPrice: p.costPrice ? String(p.costPrice) : "",
      stock: String(p.stock),
      categoryId: p.categoryId,
      imageUrls: p.imageUrls || [],
      isActive: p.isActive,
      brand: p.brand || "",
      ingredients: p.ingredients || "",
      howToUse: p.howToUse || "",
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        setShowModal(false);
        await fetchProducts();
      } else {
        const data = await res.json();
        toast.error(`Error al guardar: ${data.error || "Error desconocido"}`);
      }
    } catch {
      toast.error("Error de red al intentar guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro de eliminar este producto?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
          await fetchProducts();
        } else {
          const data = await res.json();
          toast.error(
            `Error al eliminar: ${data.error || "Error desconocido"}`,
          );
        }
      } catch {
        toast.error("Error de red al intentar eliminar");
      }
    }
  };

  const toggleVisibility = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        await fetchProducts();
      } else {
        const data = await res.json();
        toast.error(
          `Error al cambiar visibilidad: ${data.error || "Error desconocido"}`,
        );
      }
    } catch {
      toast.error("Error de red al intentar cambiar visibilidad");
    }
  };

  const handleQuickStock = async () => {
    if (!stockAdjust) return;
    const newStock = parseInt(stockAdjust.value);
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Ingresa un número válido mayor o igual a 0");
      return;
    }
    setSavingStock(true);
    try {
      const res = await fetch(`/api/products/${stockAdjust.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        toast.success("Stock actualizado");
        setStockAdjust(null);
        await fetchProducts();
      } else {
        toast.error("Error al actualizar el stock");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSavingStock(false);
    }
  };

  const stockLevel = (stock: number, min = 5) =>
    stock === 0 ? "out" : stock <= min ? "low" : "ok";

  return (
    <Page>
      <Header>
        <h1>Productos</h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <ViewToggle>
            <ToggleBtn
              $active={viewMode === "list"}
              onClick={() => setViewMode("list")}
              title="Vista lista"
            >
              <List size={16} />
            </ToggleBtn>
            <ToggleBtn
              $active={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
              title="Vista mosaico"
            >
              <LayoutGrid size={16} />
            </ToggleBtn>
          </ViewToggle>
          <AddBtn onClick={openCreate}>
            <Plus size={18} /> Nuevo Producto
          </AddBtn>
        </div>
      </Header>

      <SearchBar>
        <Search size={18} color="#999" />
        <input
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            goToPage(1);
          }}
        />
      </SearchBar>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#666" }}>
          Mostrar:
        </span>
        <CustomDropdown
          options={[
            { value: "10", label: "10" },
            { value: "20", label: "20" },
            { value: "50", label: "50" },
          ]}
          value={limit.toString()}
          onChange={(val) => {
            setLimit(parseInt(val));
            goToPage(1);
          }}
          width="80px"
        />
      </div>

      {viewMode === "list" ? (
        <Table>
          <TableHead>
            <span>Imagen</span>
            <span>Producto</span>
            <span>Categoría</span>
            <span>Precio</span>
            <span>Estado</span>
            <span>Acciones</span>
          </TableHead>
          {loading ? (
            <ProductGridSkeleton rows={8} />
          ) : products.length === 0 ? (
            <Empty>
              <Package size={50} strokeWidth={1} />
              <p>No hay productos</p>
            </Empty>
          ) : (
            products.map((p: any) => (
              <TableRow key={p.id}>
                <ProductImg>
                  {p.imageUrls?.[0] && (
                    <SafeImage
                      src={p.imageUrls[0]}
                      alt={p.name}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="50px"
                    />
                  )}
                </ProductImg>
                <ProductName>
                  <h4>{p.name}</h4>
                  <span>
                    Stock:{" "}
                    <StockPill
                      $level={stockLevel(p.stock, p.minStockLevel)}
                      onClick={() =>
                        setStockAdjust({
                          id: p.id,
                          name: p.name,
                          current: p.stock,
                          value: String(p.stock),
                        })
                      }
                    >
                      {p.stock}
                    </StockPill>
                  </span>
                </ProductName>
                <span style={{ fontSize: "0.9rem", color: "#666" }}>
                  {p.category?.name || "—"}
                </span>
                <span style={{ fontWeight: 800, color: "#7BB32E" }}>
                  ${(p.price || 0).toFixed(2)}
                </span>
                <StatusBadge $active={p.isActive}>
                  {p.isActive ? "Activo" : "Inactivo"}
                </StatusBadge>
                <ActionBtns>
                  <ActionIcon
                    onClick={() => toggleVisibility(p.id, p.isActive)}
                    title={p.isActive ? "Ocultar" : "Mostrar"}
                  >
                    {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                  </ActionIcon>
                  <ActionIcon onClick={() => openEdit(p)}>
                    <Edit size={16} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => handleDelete(p.id)}
                    style={{ color: "#ff5252" }}
                  >
                    <Trash2 size={16} />
                  </ActionIcon>
                </ActionBtns>
              </TableRow>
            ))
          )}
        </Table>
      ) : loading ? (
        <ProductGridSkeleton rows={8} />
      ) : products.length === 0 ? (
        <Empty>
          <Package size={50} strokeWidth={1} />
          <p>No hay productos</p>
        </Empty>
      ) : (
        <MosaicGrid>
          {products.map((p: any) => (
            <ProductCard
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
            >
              <CardImg>
                {p.imageUrls?.[0] ? (
                  <SafeImage
                    src={p.imageUrls[0]}
                    alt={p.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="220px"
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#ccc",
                    }}
                  >
                    <Package size={40} strokeWidth={1} />
                  </div>
                )}
                {!p.isActive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.35)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        background: "#ff5252",
                        color: "white",
                        padding: "4px 10px",
                        borderRadius: 20,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                      }}
                    >
                      INACTIVO
                    </span>
                  </div>
                )}
              </CardImg>
              <CardBody>
                <CardName title={p.name}>{p.name}</CardName>
                <CardCategory>
                  {p.category?.name || "Sin categoría"}
                </CardCategory>
                <CardFooter>
                  <CardPrice>${(p.price || 0).toFixed(2)}</CardPrice>
                  <StockPill
                    $level={stockLevel(p.stock, p.minStockLevel)}
                    onClick={() =>
                      setStockAdjust({
                        id: p.id,
                        name: p.name,
                        current: p.stock,
                        value: String(p.stock),
                      })
                    }
                    title="Ajustar stock"
                  >
                    Stock: {p.stock}
                  </StockPill>
                </CardFooter>
                <CardActions>
                  <CardActionBtn onClick={() => openEdit(p)}>
                    <Edit size={13} /> Editar
                  </CardActionBtn>
                  <CardActionBtn $danger onClick={() => handleDelete(p.id)}>
                    <Trash2 size={13} /> Eliminar
                  </CardActionBtn>
                </CardActions>
              </CardBody>
            </ProductCard>
          ))}
        </MosaicGrid>
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontWeight: 900, marginBottom: 25 }}>
                {editingId ? "Editar Producto" : "Nuevo Producto"}
              </h2>

              <FormGroup>
                <LabelStyled>Nombre *</LabelStyled>
                <Input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <LabelStyled>Descripción *</LabelStyled>
                <Textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
              </FormGroup>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                <FormGroup>
                  <LabelStyled>Precio *</LabelStyled>
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData({ ...editData, price: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <LabelStyled>Costo</LabelStyled>
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.costPrice}
                    onChange={(e) =>
                      setEditData({ ...editData, costPrice: e.target.value })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <LabelStyled>Descuento</LabelStyled>
                  <Input
                    type="number"
                    step="0.01"
                    value={editData.discountPrice}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        discountPrice: e.target.value,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <LabelStyled>Stock</LabelStyled>
                  <Input
                    type="number"
                    value={editData.stock}
                    onChange={(e) =>
                      setEditData({ ...editData, stock: e.target.value })
                    }
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <LabelStyled>Categoría *</LabelStyled>
                <Select
                  value={editData.categoryId}
                  onChange={(e) =>
                    setEditData({ ...editData, categoryId: e.target.value })
                  }
                >
                  <option value="">Seleccionar...</option>
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <LabelStyled>Marca</LabelStyled>
                <Input
                  value={editData.brand}
                  onChange={(e) =>
                    setEditData({ ...editData, brand: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <LabelStyled>Ingredientes</LabelStyled>
                <Textarea
                  value={editData.ingredients}
                  onChange={(e) =>
                    setEditData({ ...editData, ingredients: e.target.value })
                  }
                />
              </FormGroup>
              <FormGroup>
                <LabelStyled>Modo de Uso</LabelStyled>
                <Textarea
                  value={editData.howToUse}
                  onChange={(e) =>
                    setEditData({ ...editData, howToUse: e.target.value })
                  }
                />
              </FormGroup>

              <FormGroup>
                <LabelStyled>Imágenes</LabelStyled>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                    marginBottom: 15,
                  }}
                >
                  {editData.imageUrls.map((url, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid #ddd",
                      }}
                    >
                      <SafeImage
                        src={url}
                        alt="preview"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        onClick={() =>
                          setEditData({
                            ...editData,
                            imageUrls: editData.imageUrls.filter(
                              (_, idx) => idx !== i,
                            ),
                          })
                        }
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          background: "rgba(255,82,82,0.8)",
                          color: "white",
                          borderRadius: "50%",
                          border: "none",
                          width: 20,
                          height: 20,
                          fontSize: 10,
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <label
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      border: "2px dashed #ddd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexFlow: "column",
                      fontSize: "0.7rem",
                      color: "#999",
                      gap: 5,
                    }}
                  >
                    <Plus size={20} />
                    Subir
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        try {
                          const res = await fetch("/api/admin/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.url)
                            setEditData({
                              ...editData,
                              imageUrls: [...editData.imageUrls, data.url],
                            });
                        } catch (err) {
                          alert("Error al subir imagen");
                        }
                      }}
                    />
                  </label>
                </div>
                <LabelStyled style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                  O ingresa URLs (una por línea):
                </LabelStyled>
                <Textarea
                  value={editData.imageUrls.join("\n")}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      imageUrls: e.target.value
                        .split("\n")
                        .map((u) => u.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="https://test.com/img.jpg"
                />
              </FormGroup>

              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>
                  Cancelar
                </CancelBtn>
                <SaveBtn
                  onClick={handleSave}
                  disabled={
                    saving ||
                    !editData.name ||
                    !editData.price ||
                    !editData.categoryId
                  }
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
                </SaveBtn>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stockAdjust && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStockAdjust(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 20,
                padding: 30,
                width: "100%",
                maxWidth: 380,
              }}
            >
              <h3
                style={{
                  fontWeight: 900,
                  marginBottom: 6,
                  fontSize: "1.2rem",
                }}
              >
                Ajustar Stock
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.88rem",
                  marginBottom: 20,
                }}
              >
                {stockAdjust.name}
              </p>
              <div
                style={{
                  background: "#f9f9f9",
                  borderRadius: 12,
                  padding: "12px 16px",
                  marginBottom: 20,
                  fontSize: "0.88rem",
                  color: "#666",
                  fontWeight: 600,
                }}
              >
                Stock actual:{" "}
                <strong style={{ color: "#1a1a1a" }}>
                  {stockAdjust.current}
                </strong>
              </div>
              <LabelStyled>Nuevo stock</LabelStyled>
              <Input
                type="number"
                min="0"
                value={stockAdjust.value}
                onChange={(e) =>
                  setStockAdjust({ ...stockAdjust, value: e.target.value })
                }
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleQuickStock()}
              />
              <ModalActions>
                <CancelBtn onClick={() => setStockAdjust(null)}>
                  Cancelar
                </CancelBtn>
                <SaveBtn
                  onClick={handleQuickStock}
                  disabled={savingStock || stockAdjust.value === ""}
                >
                  {savingStock ? "Guardando..." : "Guardar"}
                </SaveBtn>
              </ModalActions>
            </motion.div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
