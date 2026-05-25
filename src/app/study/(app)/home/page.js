// src/app/study/(app)/home/page.js
// Re-export de HomePage para que /study/home monte la misma pantalla que /
// (selección entre flujo directo e inverso) pero envuelta en /study/layout.js.
// Este es el "menú" al que vuelve el participante entre flujos del modo guiado.
// Patrón validado en P0 de Fase 4 M18.
export { default } from "@/components/pages/HomePage";
