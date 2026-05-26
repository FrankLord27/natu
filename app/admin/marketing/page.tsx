"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Users, Mail, Download, Search, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma"; // Only works in server components, we need a client fetch or server component
// Since this is a client component ('use client'), we need to fetch data via API or Server Action.
// Let's use a Server Action approach for simplicity if possible, or API.
// Updated plan: Create a server action to fetch subscribers.

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  .value {
    font-size: 2.2rem;
    font-weight: 900;
    color: ${(p) => p.theme.colors.primary};
    margin-bottom: 5px;
  }
  .label {
    font-size: 0.85rem;
    color: #666;
    font-weight: 700;
    text-transform: uppercase;
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
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

export default function MarketingPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data
    fetch("/api/admin/marketing/subscribers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSubscribers(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Email,Source,Joined\n" +
      subscribers
        .map(
          (s) =>
            `${s.email},${s.source},${new Date(s.createdAt).toLocaleDateString()}`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers_naturajm.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Page>
      <Header>
        <h1>Marketing & Leads</h1>
        <button
          onClick={downloadCSV}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#1a1a1a",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <Download size={18} /> Exportar CSV
        </button>
      </Header>

      <StatsGrid>
        <StatCard>
          <div className="value">{subscribers.length}</div>
          <div className="label">Total Suscriptores</div>
        </StatCard>
        <StatCard>
          <div className="value">
            {subscribers.filter((s) => s.source === "footer").length}
          </div>
          <div className="label">Desde Footer</div>
        </StatCard>
      </StatsGrid>

      <TableCard>
        <Table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Origen</th>
              <th>Fecha Suscripción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  Cargando...
                </td>
              </tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id}>
                  <td>{sub.email}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {sub.source || "N/A"}
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span
                      style={{
                        background: "#e8f5e9",
                        color: "#2e7d32",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                      }}
                    >
                      Activo
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableCard>
    </Page>
  );
}
