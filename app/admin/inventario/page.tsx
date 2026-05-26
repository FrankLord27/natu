"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Minus,
  History,
  Save,
  X,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getLowStockProducts,
  adjustInventory,
  getAdminProducts,
} from "@/lib/actions";
import { useRouter } from "next/navigation";

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

const KPIContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const KPICard = styled.div<{ $alert?: boolean }>`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border-left: 5px solid
    ${(p) => (p.$alert ? "#ff5252" : p.theme.colors.primary)};
  .value {
    font-size: 2.2rem;
    font-weight: 900;
    color: #333;
    margin-bottom: 5px;
  }
  .label {
    font-size: 0.85rem;
    color: #666;
    font-weight: 700;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LowStockGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const AlertCard = styled.div`
  background: #fff5f5;
  border: 1px solid #ffeeba;
  padding: 20px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .info {
    h4 {
      font-weight: 800;
      color: #c62828;
      margin-bottom: 4px;
    }
    p {
      font-size: 0.85rem;
      color: #b71c1c;
      font-weight: 600;
    }
  }
  button {
    background: white;
    border: 1px solid #ffcdd2;
    color: #c62828;
    padding: 8px 14px;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      background: #ffebee;
    }
  }
`;

const TableCard = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 18px 25px;
    background: #f8f9fa;
    font-weight: 800;
    font-size: 0.8rem;
    color: #666;
    text-transform: uppercase;
  }
  td {
    padding: 20px 25px;
    border-bottom: 1px solid #f1f1f1;
    font-size: 0.95rem;
    color: #333;
    font-weight: 500;
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

const BrandBadge = styled.span`
  background: #e3f2fd;
  color: #1565c0;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
`;

const StockBadge = styled.span<{ $level: number; $min: number }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 800;
  background: ${(p) =>
    p.$level === 0 ? "#ffebee" : p.$level <= p.$min ? "#fff8e1" : "#e8f5e9"};
  color: ${(p) =>
    p.$level === 0 ? "#c62828" : p.$level <= p.$min ? "#f57f17" : "#2e7d32"};
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 8px;
  border-radius: 8px;
  transition: 0.2s;
  &:hover {
    background: #f5f5f5;
    color: ${(p) => p.theme.colors.primary};
  }
`;

// Modal Components
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;
const Label = styled.label`
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #444;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 12px;
  font-size: 0.95rem;
  min-height: 80px;
  &:focus {
    outline: none;
    border-color: ${(p) => p.theme.colors.primary};
  }
`;

const TabGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  button {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    font-weight: 800;
    border: 2px solid transparent;
    cursor: pointer;
    &.in {
      background: #e8f5e9;
      color: #2e7d32;
      border-color: #2e7d32;
    }
    &.out {
      background: #ffebee;
      color: #c62828;
      border-color: #c62828;
    }
    &.inactive {
      background: #f5f5f5;
      color: #999;
      border: 2px solid #eee;
    }
  }
`;

export default function InventoryDashboard() {
  const router = useRouter();
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [adjustment, setAdjustment] = useState({
    type: "IN",
    quantity: 0,
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [lowRes, allRes] = await Promise.all([
      getLowStockProducts(),
      getAdminProducts({ limit: 50 }), // Fetch initial batch
    ]);

    if (lowRes.success) setLowStockProducts(lowRes.data || []);
    if (allRes.success) setAllProducts(allRes.data || []);
    setLoading(false);
  };

  const handleAdjustClick = (product: any) => {
    setSelectedProduct(product);
    setAdjustment({ type: "IN", quantity: 0, reason: "", notes: "" });
  };

  const submitAdjustment = async () => {
    if (!selectedProduct || adjustment.quantity <= 0) return;

    const newStock =
      adjustment.type === "IN"
        ? selectedProduct.stock + Number(adjustment.quantity)
        : selectedProduct.stock - Number(adjustment.quantity);

    if (newStock < 0) {
      alert("El stock no puede ser negativo.");
      return;
    }

    const res = await adjustInventory(
      selectedProduct.id,
      newStock,
      adjustment.reason,
      adjustment.notes,
    );
    if (res.success) {
      setSelectedProduct(null);
      fetchData(); // Refresh data
      router.refresh();
    } else {
      alert("Error al actualizar inventario");
    }
  };

  const outOfStockCount = lowStockProducts.filter((p) => p.stock === 0).length;

  return (
    <Page>
      <Header>
        <h1>Control de Inventario</h1>
        <button
          onClick={() => router.push("/admin/productos")}
          style={{
            background: "#f5f5f5",
            border: "none",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Gestionar Catálogo
        </button>
      </Header>

      <KPIContainer>
        <KPICard $alert={outOfStockCount > 0}>
          <div className="value">{outOfStockCount}</div>
          <div className="label">
            <AlertTriangle size={16} /> Productos Agotados
          </div>
        </KPICard>
        <KPICard $alert={lowStockProducts.length > 0}>
          <div className="value">{lowStockProducts.length}</div>
          <div className="label">
            <TrendingDown size={16} /> Alertas de Stock Bajo
          </div>
        </KPICard>
        <KPICard>
          <div className="value">
            {allProducts.reduce((sum, p: any) => sum + p.stock, 0)}
          </div>
          <div className="label">
            <Package size={16} /> Unidades Totales
          </div>
        </KPICard>
      </KPIContainer>

      {lowStockProducts.length > 0 && (
        <>
          <SectionTitle>
            <AlertTriangle size={20} color="#c62828" /> Atención Requerida
          </SectionTitle>
          <LowStockGrid>
            {lowStockProducts.map((p) => (
              <AlertCard key={p.id}>
                <div className="info">
                  <h4>{p.name}</h4>
                  <p>
                    Stock actual: {p.stock} (Min: {p.minStockLevel})
                  </p>
                </div>
                <button onClick={() => handleAdjustClick(p)}>
                  Reabastecer
                </button>
              </AlertCard>
            ))}
          </LowStockGrid>
        </>
      )}

      <SectionTitle>Inventario General</SectionTitle>
      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>
                  <BrandBadge>{p.sku || "N/A"}</BrandBadge>
                </td>
                <td>{p.category.name}</td>
                <td>{p.isActive ? "Activo" : "Inactivo"}</td>
                <td>
                  <StockBadge $level={p.stock} $min={p.minStockLevel || 5}>
                    {p.stock}
                  </StockBadge>
                </td>
                <td>
                  <ActionBtn
                    onClick={() => handleAdjustClick(p)}
                    title="Ajustar Stock"
                  >
                    <History size={18} />
                  </ActionBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>

      <AnimatePresence>
        {selectedProduct && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                  Ajustar Inventario
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <X />
                </button>
              </div>

              <div
                style={{
                  marginBottom: 20,
                  padding: 15,
                  background: "#f9f9f9",
                  borderRadius: 12,
                }}
              >
                <h4 style={{ fontWeight: 800, marginBottom: 5 }}>
                  {selectedProduct.name}
                </h4>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Stock Actual: <strong>{selectedProduct.stock}</strong>
                </p>
              </div>

              <TabGroup>
                <button
                  className={adjustment.type === "IN" ? "in" : "inactive"}
                  onClick={() => setAdjustment({ ...adjustment, type: "IN" })}
                >
                  <Plus
                    size={16}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />{" "}
                  Entrada
                </button>
                <button
                  className={adjustment.type === "OUT" ? "out" : "inactive"}
                  onClick={() => setAdjustment({ ...adjustment, type: "OUT" })}
                >
                  <Minus
                    size={16}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />{" "}
                  Salida/Pérdida
                </button>
              </TabGroup>

              <FormGroup>
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={adjustment.quantity}
                  onChange={(e) =>
                    setAdjustment({
                      ...adjustment,
                      quantity: parseInt(e.target.value),
                    })
                  }
                />
              </FormGroup>

              <FormGroup>
                <Label>Motivo</Label>
                <select
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 12,
                    border: "2px solid #eee",
                    fontSize: "1rem",
                  }}
                  value={adjustment.reason}
                  onChange={(e) =>
                    setAdjustment({ ...adjustment, reason: e.target.value })
                  }
                >
                  <option value="">Seleccionar motivo...</option>
                  <option value="Compra de Proveedor">
                    Compra a Proveedor
                  </option>
                  <option value="Devolución Cliente">
                    Devolución de Cliente
                  </option>
                  <option value="Ajuste de Inventario">
                    Corrección de Inventario
                  </option>
                  <option value="Dañado/Caducado">
                    Producto Dañado/Caducado
                  </option>
                  <option value="Uso Interno">Uso Interno</option>
                </select>
              </FormGroup>

              <FormGroup>
                <Label>Notas Adicionales</Label>
                <TextArea
                  placeholder="Detalles opcionales..."
                  value={adjustment.notes}
                  onChange={(e) =>
                    setAdjustment({ ...adjustment, notes: e.target.value })
                  }
                />
              </FormGroup>

              <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    border: "none",
                    background: "#f5f5f5",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={submitAdjustment}
                  style={{
                    flex: 1,
                    padding: 14,
                    borderRadius: 12,
                    border: "none",
                    background: "#1a1a1a",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Guardar Movimiento
                </button>
              </div>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
