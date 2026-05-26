"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  ShoppingBag,
  User,
  Phone,
  FileText,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 25px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  margin-bottom: 20px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
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

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;

  th {
    text-align: left;
    padding: 12px;
    font-size: 0.8rem;
    color: #888;
    text-transform: uppercase;
    border-bottom: 2px solid #f5f5f5;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f5f5f5;
  }
`;

const ProductSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
`;

const ActionBtn = styled.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  cursor: pointer;

  &.primary {
    background: ${(p) => p.theme.colors.primary};
    color: white;
    border: none;
    &:hover {
      filter: brightness(1.1);
    }
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.secondary {
    background: #f5f5f5;
    color: #666;
    border: none;
    &:hover {
      background: #eee;
    }
  }
`;

const TotalContainer = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  font-size: 1.4rem;
  font-weight: 900;
  color: #333;

  span {
    color: ${(p) => p.theme.colors.primary};
  }
`;

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export default function ManualSales() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<SaleItem[]>([
    { productId: "", quantity: 1, price: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/products?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Error fetching products:", data.error);
        }
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        toast.error("Error al cargar los productos");
      });
  }, []);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, key: keyof SaleItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };

    // If productId changed, auto-fill price
    if (key === "productId") {
      const product = products.find((p) => p.id === value);
      if (product) {
        newItems[index].price = product.price;
      }
    }

    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0,
    );
  };

  const handleSubmit = async () => {
    if (!customerName || items.some((item) => !item.productId)) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setSaving(true);
    const toastId = toast.loading("Registrando venta...");
    try {
      const res = await fetch("/api/admin/manual-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          notes,
          items,
        }),
      });

      if (res.ok) {
        toast.success("Venta registrada con éxito", { id: toastId });
        router.push("/admin/pedidos");
      } else {
        const data = await res.json();
        toast.error("Error: " + data.error, { id: toastId });
      }
    } catch {
      toast.error("Error de conexión al registrar la venta", { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Title>
        <ShoppingBag size={32} /> Registrar Venta WhatsApp
      </Title>

      <Card>
        <SectionTitle>
          <User size={18} /> Datos del Cliente
        </SectionTitle>
        <Grid>
          <FormGroup>
            <Label>Nombre del Cliente *</Label>
            <Input
              placeholder="Ej: Juan Pérez"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Teléfono / WhatsApp</Label>
            <Input
              placeholder="Ej: +1 809..."
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </FormGroup>
        </Grid>
        <FormGroup>
          <Label>Notas / Comentarios</Label>
          <Textarea
            placeholder="Detalles adicionales de la venta..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </FormGroup>
      </Card>

      <Card>
        <SectionTitle>
          <ShoppingBag size={18} /> Productos Vendidos
        </SectionTitle>
        <ItemsTable>
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Producto</th>
              <th style={{ width: "15%" }}>Cantidad</th>
              <th style={{ width: "20%" }}>Precio Unit.</th>
              <th style={{ width: "15%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>
                  <ProductSelect
                    value={item.productId}
                    onChange={(e) =>
                      updateItem(index, "productId", e.target.value)
                    }
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.stock} disponible)
                      </option>
                    ))}
                  </ProductSelect>
                </td>
                <td>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </td>
                <td>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      updateItem(index, "price", parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                    style={{
                      color: "#ff5252",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ItemsTable>

        <div style={{ marginTop: "20px" }}>
          <ActionBtn className="secondary" onClick={addItem}>
            <Plus size={18} /> Agregar otro producto
          </ActionBtn>
        </div>

        <TotalContainer>
          Total: <span>${calculateTotal().toFixed(2)}</span>
        </TotalContainer>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ActionBtn
          className="primary"
          onClick={handleSubmit}
          disabled={saving || !customerName || calculateTotal() === 0}
        >
          <Save size={18} /> {saving ? "Guardando..." : "Registrar Venta"}
        </ActionBtn>
      </div>
    </Page>
  );
}
