## Changelog

### 2025-10-28

- **Performance: route-based code splitting**
  - Converted page routes to lazy-loaded chunks with `React.lazy` and `Suspense`.
  - Files: `src/App.tsx`.

- **Performance: memoized heavy UI components**
  - Wrapped charts and tables with `React.memo` to reduce unnecessary re-renders:
    - `src/components/ResponseTimeChart.tsx`
    - `src/components/FirstResponseTrendChart.tsx`
    - `src/components/OpenTicketTrendChart.tsx`
    - `src/components/TicketAgeTrendChart.tsx`
    - `src/components/TicketTable.tsx`
    - `src/components/AutomationSavingsCard.tsx`
    - `src/components/CategoryBreakdownCard.tsx`
  - Memoized computed datasets with `useMemo` where appropriate:
    - `src/pages/MasterDashboard.tsx` (critical lists and newest tickets)
    - `src/components/CurrentStateTicketsTable.tsx` (open tickets list)

- **UX: routing safety**
  - Replaced raw anchor with `Link` in `src/pages/NotFound.tsx` to preserve SPA navigation.

- **Build: Vite optimizations**
  - Added production-only `esbuild.drop` for `console`/`debugger`.
  - Tuned Rollup chunking via `manualChunks` to create clearer vendor splits: `react-vendor`, `recharts`, `radix`, `icons`, and general `vendor`.
  - Enabled `cssCodeSplit`, disabled source maps for prod, set `target: es2018`, and raised `chunkSizeWarningLimit`.
  - Pre-bundled frequent deps via `optimizeDeps.include` for faster dev builds.
  - File: `vite.config.ts`.

- **Notes**
  - No breaking changes expected. Lazy routes include a lightweight skeleton fallback.
  - These changes should reduce initial bundle size and re-render cost across charts/tables.
