// Ruta de desarrollo — no enlazar en navegación pública
import { notFound } from "next/navigation";
import SingleLoaderPage from "@/components/dev/loaders/SingleLoaderPage";

export const metadata = {
  title: "Cross-polytope rotante · Dev",
  robots: { index: false, follow: false },
};

export default function WireframeDevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SingleLoaderPage variantId="wireframe" title="Cross-polytope rotante" />;
}
