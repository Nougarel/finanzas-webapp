// src/app/study/expired/page.js
// Entry point para la pantalla de timeout. Hereda el StudyProvider del
// layout /study, pero la pantalla no consume el contexto.
import ExpiredScreen from "@/components/study/screens/ExpiredScreen";

export default function Page() {
  return <ExpiredScreen />;
}
