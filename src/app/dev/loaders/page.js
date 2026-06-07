// Ruta de desarrollo — no enlazar en navegación pública
import { notFound } from "next/navigation";
import LoaderComparisonPage from "@/components/dev/loaders/LoaderComparisonPage";

export const metadata = {
  title: "Comparador de loaders · Dev",
  robots: { index: false, follow: false },
};

export default function LoadersDevPage() {
  // Gating: solo accesible en desarrollo local
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <LoaderComparisonPage />;
}
