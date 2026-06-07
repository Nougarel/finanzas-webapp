import { notFound } from "next/navigation";
import PolytopeFinalPage from "@/components/dev/loaders/polytope/PolytopeFinalPage";

export const metadata = {
  title: "Grand Tour 20D · Dev",
  robots: { index: false, follow: false },
};

export default function PolytopeFinalDevPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PolytopeFinalPage />;
}
