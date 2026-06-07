// registry.js — array central de variantes de loader.
// ESTE ARCHIVO NO DEBE SER EDITADO POR LOS AGENTES QUE IMPLEMENTEN VARIANTES.
// Cada agente trabaja únicamente en su archivo en variants/.

import { BaseLoader } from "./variants/base-loader";
import { BarrasLoader } from "./variants/barras-loader";
import { AnillosLoader } from "./variants/anillos-loader";
import { WireframeLoader } from "./variants/wireframe-loader";
import { LevelCurvesLoader } from "./variants/level-curves-loader";
import { RadarStarLoader } from "./variants/radar-star-loader";
import { LpvizLoader } from "./variants/lpviz-loader";
import { ParticlesLoader } from "./variants/particles-loader";
import { NetworkLoader } from "./variants/network-loader";

export const LOADER_VARIANTS = [
  {
    id: "base",
    name: "Base (actual)",
    description: "Texto + fases + barra de progreso. Referencia de producción.",
    Component: BaseLoader,
    fullChrome: true,
  },
  {
    id: "barras",
    name: "Barras en ebullición",
    description: "20 barras fluctuando + contador de distribuciones.",
    Component: BarrasLoader,
  },
  {
    id: "anillos",
    name: "Anillos orbitales",
    description: "Órbitas CSS 3D como dimensiones del espacio de soluciones.",
    Component: AnillosLoader,
  },
  {
    id: "wireframe",
    name: "Cross-polytope rotante",
    description: "Proyección wireframe de politopo de alta dimensión rotando.",
    Component: WireframeLoader,
  },
  {
    id: "level-curves",
    name: "Curvas de nivel",
    description: "Isocurvas de la función objetivo acercándose al óptimo.",
    Component: LevelCurvesLoader,
  },
  {
    id: "radar-star",
    name: "Radar Star",
    description: "20 ejes radiales (uno por categoría) convergiendo a la solución.",
    Component: RadarStarLoader,
  },
  {
    id: "lpviz",
    name: "Trayectoria 3D",
    description: "Convergencia isométrica de la función objetivo a cero.",
    Component: LpvizLoader,
  },
  {
    id: "particles",
    name: "Partículas convergentes",
    description: "Partículas dispersas que convergen al centro del espacio.",
    Component: ParticlesLoader,
  },
  {
    id: "network",
    name: "Grafo de categorías",
    description: "20 nodos (uno por categoría) iluminándose al converger.",
    Component: NetworkLoader,
  },
];
