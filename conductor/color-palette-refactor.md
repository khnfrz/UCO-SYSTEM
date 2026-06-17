# Color Palette Refactor Implementation Plan

## Objective
The goal is to establish a cohesive, maintainable color palette for the `admin-dashboard` by centralizing color definitions in `tailwind.config.mjs` and refactoring components to use these semantic names instead of hardcoded hex values or disparate utility classes.

## Scope & Impact
This change will affect all components in `@admin-dashboard/src/components` and pages in `@admin-dashboard/src/pages` that rely on manual color definitions.

## Proposed Solution

1.  **Define Centralized Palette in `tailwind.config.mjs`:**
    *   Define a custom theme that includes:
        *   `primary`: (e.g., brand-blue `#0A1C5C`)
        *   `secondary`: (e.g., brand-indigo)
        *   `status-success`: (e.g., `#48bb78`)
        *   `status-warning`: (e.g., amber colors)
        *   `status-error`: (e.g., rose/red colors)
        *   `neutral`: (use standard Tailwind `slate` for consistency)
2.  **Refactor Components:**
    *   Replace hardcoded hex codes (e.g., `bg-[#0A1C5C]`) with the new semantic classes (e.g., `bg-primary`).
    *   Ensure consistent usage of `slate` levels across the project.

## Implementation Steps

1.  **Define Theme:** Update `tailwind.config.mjs` to include the new palette in `theme.extend.colors`.
2.  **Audit:** Identify all hardcoded colors (grep for `#`).
3.  **Refactor:**
    *   `src/components/AdminSidebar.astro`: Replace `#48bb78` with `bg-status-success`.
    *   `src/components/DashboardContent.jsx`: Replace `chartColors` and hardcoded status classes with theme colors.
    *   `src/components/LoginForm.jsx`: Replace `#0A1C5C` with `bg-primary`.
    *   `src/components/SettingsContent.jsx`: Clean up any remaining hardcoded hexes.
    *   `src/components/submission/index.astro`: Update status badge logic to use theme colors.
4.  **Verification:** Verify no layout breakage in `npm run dev`.

## Verification
-   Visual check of the dashboard, sidebar, login page, and submission details for color consistency.
-   Ensure no hardcoded hex codes remain that represent brand or status colors.

## Alternatives Considered
-   Keep hardcoded colors: Inconsistent and hard to maintain.
-   Just redefine existing classes: Risky, might break existing Tailwind usage. Extending is safer.
