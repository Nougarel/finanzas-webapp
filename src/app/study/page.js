// src/app/study/page.js
// Entry point del funnel pre-app /study. El StudyFunnel orquesta el state
// machine de PRE_APP_STEPS y delega en la pantalla correspondiente.
import StudyFunnel from "@/components/study/StudyFunnel";

export default function Page() {
  return <StudyFunnel />;
}
