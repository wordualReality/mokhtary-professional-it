/**
 * @file src/data/asset-paths.ts
 * @summary Zentrale Pfade für wiederkehrende Mockup- und Hero-Assets.
 * Produktive Hero-Clips + Poster liegen unter `/images/mockups/` (saubere Namen).
 * Originale und Iterationen: `/images/_archive/`.
 * Semantische Governance: siehe launchMediaManifest.ts
 */

export const MOCKUP_IT_CONSULTING = '/images/mockup-it-consulting.jpg';
export const MOCKUP_SICHTBARKEIT = '/images/mockup-sichtbarkeit.jpg';
export const MOCKUP_SOCIAL = '/images/mockup-social.jpg';

/** KI-Automation (Systeme-Cluster) — Startframe = erster Videoframe */
export const MOCKUP_KI_AUTOMATION = '/images/mockups/ki-automation-startframe.jpeg';
export const MOCKUP_SYSTEME_KI = MOCKUP_KI_AUTOMATION;
export const VIDEO_KI_AUTOMATION_HERO = '/images/mockups/ki-automation-hero.mp4';
export const VIDEO_SYSTEME_KI_HERO = VIDEO_KI_AUTOMATION_HERO;

/** Software-Prototyping / Tool-Prototyp */
export const MOCKUP_SOFTWARE_PROTOTYPING_POSTER_SOURCE =
  '/images/Clean_2D_flat_vector_illustration_202606232201.jpeg';
export const VIDEO_SOFTWARE_PROTOTYPING_HERO_SOURCE =
  '/images/Gen-4_5 - Locked-off static camera, zero camera movement_ High-end 2D flat vector motion graphics an.gen-4_5 - locked-off static camera, zero camera movement_ high-end 2d flat vector motion graphics an.mp4';
export const MOCKUP_SOFTWARE_PROTOTYPING = '/images/mockups/software-prototyping-poster.jpeg';
export const MOCKUP_SOFTWARE_PROTOTYPING_DASHBOARD =
  '/images/mockups/software-prototyping-dashboard.jpeg';
export const MOCKUP_SOFTWARE_PROTOTYPING_FINTECH =
  '/images/mockups/software-prototyping-fintech.jpeg';
export const VIDEO_SOFTWARE_PROTOTYPING_HERO = '/images/mockups/software-prototyping-hero.mp4';
export const VIDEO_SYSTEME_KI_TOOL_HIGHLIGHT = VIDEO_SOFTWARE_PROTOTYPING_HERO;

/** KI-Assistent (internes Wissen — eigenes Thema, nicht Prototyping-UI) */
export const MOCKUP_KI_ASSISTANT = MOCKUP_SOFTWARE_PROTOTYPING_DASHBOARD;
export const VIDEO_KI_ASSISTANT = '/images/mockups/ki-assistant-hero.mp4';

/** Professional IT — Poster = Ingredient-Still aus clean-2d-stills (Requirements-Oktagon-Flow) */
export const MOCKUP_PROFESSIONAL_IT_HERO_POSTER_SOURCE =
  '/images/_archive/gen4-iterations/clean-2d-stills/Abstract_high-end_2D_vector_graphic_202606231513.jpeg';
export const MOCKUP_PROFESSIONAL_IT_HERO_POSTER =
  '/images/mockups/professional-it-hero-poster.jpeg';
export const VIDEO_PROFESSIONAL_IT_HERO = '/images/mockups/professional-it-hero.mp4';

/** Professional IT — Bio „Woher die Ruhe im Projekt kommt“ (Planning → Deployment) */
export const MOCKUP_PROFESSIONAL_IT_BIO_POSTER_SOURCE = '/images/RuheImProjekt2.jpeg';
export const VIDEO_PROFESSIONAL_IT_BIO_HERO_SOURCE = '/images/RuheImProjektAnimiert2.mp4';
export const MOCKUP_PROFESSIONAL_IT_BIO_POSTER = '/images/mockups/professional-it-bio-poster.jpeg';
export const VIDEO_PROFESSIONAL_IT_BIO_HERO = '/images/mockups/professional-it-bio-hero.mp4';

/** Professional IT — Stakeholder / C-Level (Executive IT Strategic) */
export const MOCKUP_PROFESSIONAL_IT_STAKEHOLDER_POSTER_SOURCE =
  '/images/Executive IT Strategic1.jpeg';
export const VIDEO_PROFESSIONAL_IT_STAKEHOLDER_HERO_SOURCE =
  '/images/Executive IT StrategicAnimiert.mp4';
export const MOCKUP_PROFESSIONAL_IT_STAKEHOLDER_POSTER =
  '/images/mockups/professional-it-stakeholder-poster.jpeg';
export const VIDEO_PROFESSIONAL_IT_STAKEHOLDER_HERO =
  '/images/mockups/professional-it-stakeholder-hero.mp4';

/** @deprecated Use VIDEO_KI_ASSISTANT */
export const VIDEO_KI_ASSISTANT_HERO = VIDEO_KI_ASSISTANT;

/** Social / Wachstum (Addons) */
export const VIDEO_SOCIAL_WORKFLOW_HERO = '/images/mockups/webdesign-addon-social.mp4';
export const VIDEO_WACHSTUM_HERO = '/images/mockups/wachstum-hero.mp4';
export const VIDEO_WACHSTUM_SOCIAL_HERO = '/images/mockups/wachstum-social-hero.mp4';
