// Ruta de desarrollo — no enlazar en navegación pública
import { notFound } from "next/navigation";
import PolytopeComparisonPage from "@/components/dev/loaders/polytope/PolytopeComparisonPage";

export const metadata = {
  title: "Comparación de politopos · Dev",
  robots: { index: false, follow: false },
};

export default function PolytopeComparePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PolytopeComparisonPage />;
}
