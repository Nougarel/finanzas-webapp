// src/app/debug/dashboard-poc/page.js
// Maqueta de validación del grid 12-col del DashboardPanel (M37 Paso 0).
// Ruta efímera — solo para medir ancho real de col 2 antes de construir los componentes.
import DashboardPocClient from "./DashboardPocClient";

export const metadata = {
  title: "Dashboard POC — M37 Validación de layout",
};

export default function DashboardPocPage() {
  return <DashboardPocClient />;
}
