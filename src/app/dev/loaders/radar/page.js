// Ruta de desarrollo — no enlazar en navegación pública
import { notFound } from "next/navigation";
import SingleLoaderPage from "@/components/dev/loaders/SingleLoaderPage";

export const metadata = {
  title: "Radar Star · Dev",
  robots: { index: false, follow: false },
};

export default function RadarDevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <SingleLoaderPage variantId="radar" title="Radar Star" />;
}
