// src/app/debug/dashboard-demo/page.js
// Demo completo del DashboardPanel en los 3 modos + skeleton (M37 F2).
// Ruta de debug — no enlazar desde la app principal.
import DashboardPanelDemo from "@/components/study/DashboardPanelDemo";

export const metadata = {
  title: "DashboardPanel Demo — M37",
};

export default function DashboardDemoPage() {
  return <DashboardPanelDemo />;
}
