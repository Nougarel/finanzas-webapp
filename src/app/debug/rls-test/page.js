import { notFound } from "next/navigation";
import DebugRlsTestPage from "@/components/pages/DebugRlsTestPage";

export default function Page() {
  // Gating: solo en dev (defense in depth además del cleanup post-cierre)
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <DebugRlsTestPage />;
}
