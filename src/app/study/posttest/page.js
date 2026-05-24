// src/app/study/posttest/page.js
// Entry point del funnel posttest /study/posttest. Hereda el StudyProvider
// del layout /study (sin desmontar entre rutas).
import StudyPosttestFunnel from "@/components/study/StudyPosttestFunnel";

export default function Page() {
  return <StudyPosttestFunnel />;
}
