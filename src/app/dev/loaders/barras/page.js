// Ruta de desarrollo — no enlazar en navegación pública
import { notFound } from "next/navigation";
import SingleLoaderPage from "@/components/dev/loaders/SingleLoaderPage";

export const metadata = {
  title: "Barras en ebullición · Dev",
  robots: { index: false, follow: false },
};

export default function BarrasDevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SingleLoaderPage variantId="barras" title="Barras en ebullición" />;
}
