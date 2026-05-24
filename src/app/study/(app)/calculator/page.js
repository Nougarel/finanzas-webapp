// src/app/study/(app)/calculator/page.js
// Re-export de CalculatorPage para que /study/calculator monte el mismo
// componente que /calculator, pero envuelto en el layout /study/layout.js.
// Patrón validado en P0 de Fase 4 M18.
export { default } from "@/components/pages/CalculatorPage";
