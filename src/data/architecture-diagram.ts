/**
 * @file src/data/architecture-diagram.ts
 * @summary Modus für das Architektur-Mockup im Profil-Hero.
 */

export type ArchDiagramMode = 'hybrid' | 'svg' | 'raster' | 'static';

/**
 * hybrid = Original-JPG + animierte SVG-Linien (empfohlen).
 * svg = vollständige SVG-Illustration.
 * raster = PNG-Layer.
 * static = nur JPG.
 */
export const ARCH_DIAGRAM_MODE: ArchDiagramMode = 'hybrid';

export const ARCH_DIAGRAM_LAYERS_ENABLED = ARCH_DIAGRAM_MODE === 'raster';
