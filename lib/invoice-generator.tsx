import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 20,
  },
  logoSection: { flexDirection: "column" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoBlock: { width: "45%" },
  infoLabel: {
    fontSize: 8,
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 4,
    fontWeight: "bold",
  },
  infoText: { fontSize: 10, color: "#333", marginBottom: 2 },

  table: { marginTop: 20 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tableCell: { fontSize: 9, color: "#666" },
  colDesc: { flex: 4 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },

  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },

  summarySection: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryTable: { width: "35%" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 10, color: "#666" },
  summaryValue: { fontSize: 10, fontWeight: "bold", color: "#1a1a1a" },
  totalRow: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  totalLabel: { fontSize: 12, fontWeight: "bold" },
  totalValue: { fontSize: 12, fontWeight: "bold", color: "#7BB32E" },

  footer: {
    position: "absolute",
    bottom: 40,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 20,
    textAlign: "center",
  },
  footerText: { fontSize: 8, color: "#999" },
});

interface InvoiceProps {
  order: any;
  invoiceNumber: string;
}

export const InvoicePDF = ({ order, invoiceNumber }: InvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <Text style={styles.title}>NaturaJM</Text>
          <Text style={styles.subtitle}>Elite Business Solutions</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={{ fontSize: 14, fontWeight: "bold", color: "#7BB32E" }}>
            FACTURA ELECTRÓNICA
          </Text>
          <Text style={{ fontSize: 10, color: "#666", marginTop: 4 }}>
            No: {invoiceNumber}
          </Text>
          <Text style={{ fontSize: 9, color: "#888" }}>
            Fecha: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* CUSTOMER & COMPANY INFO */}
      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>EMISOR</Text>
          <Text style={styles.infoText}>NaturaJM S.R.L.</Text>
          <Text style={styles.infoText}>RNC: 132-45678-9</Text>
          <Text style={styles.infoText}>Av. Principal #123, Santo Domingo</Text>
          <Text style={styles.infoText}>Tel: (809) 123-4567</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.infoLabel}>FACTURAR A</Text>
          <Text style={[styles.infoText, { fontWeight: "bold" }]}>
            {order.customerName || order.user?.name || "Cliente Particular"}
          </Text>
          <Text style={styles.infoText}>
            {order.customerEmail || order.user?.email || "Sin Email"}
          </Text>
          <Text style={styles.infoText}>
            {order.customerPhone || "Sin Teléfono"}
          </Text>
          <Text style={styles.infoText}>
            ID Pedido: #{order.id.slice(-6).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* ITEMS TABLE */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.colDesc]}>
            Descripción del Producto
          </Text>
          <Text style={[styles.tableCell, styles.colQty]}>Cant.</Text>
          <Text style={[styles.tableCell, styles.colPrice]}>Precio</Text>
          <Text style={[styles.tableCell, styles.colTotal]}>Total</Text>
        </View>

        {order.items.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colDesc]}>
              {item.product?.name || "Producto NaturaJM"}
            </Text>
            <Text style={[styles.tableCell, styles.colQty]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCell, styles.colPrice]}>
              ${item.price.toFixed(2)}
            </Text>
            <Text style={[styles.tableCell, styles.colTotal]}>
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* SUMMARY */}
      <View style={styles.summarySection}>
        <View style={styles.summaryTable}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Impuestos (ITBIS 0%)</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>TOTAL RD$</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Gracias por elegir NaturaJM para tu bienestar integral.
        </Text>
        <Text style={[styles.footerText, { marginTop: 5 }]}>
          Documento generado electrónicamente - Validez legal para fines
          internos.
        </Text>
      </View>
    </Page>
  </Document>
);
