import { redirect } from "next/navigation";

export default function InventarioRedirect() {
  redirect("/admin/productos");
}
