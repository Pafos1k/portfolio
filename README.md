# Vlad's portfolio

React 18 + TypeScript + Vite migration of the existing Framer export. The original visual design, static assets, responsive breakpoints and generated section effects are retained.

## Development

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm test
```

Tests use installed Google Chrome; install Chrome before running them. Deploy `dist/` and configure the host to serve `index.html` for unknown paths so direct navigation to `/about`, `/works`, `/blog`, `/contact` and CMS detail pages works. Assets use root-relative URLs; serve this app at the domain root.

## Structure

- `src/main.tsx`, `src/App.tsx`: one React root and application error boundary.
- `src/components/hero`: typed heading, unchanged portrait and signature components.
- `src/components/gallery/CurvedGallery.tsx`: typed gallery with original cylindrical geometry, intro easing, automatic rotation, drag and momentum.
- `src/components/layout`: navigation adapter preserving the original responsive menu.
- `src/content/portfolio.ts`, `src/types/portfolio.ts`: typed identity and future feature configuration. Video intro is null and future project destinations are empty; no new playback or gallery links are enabled.
- `src/compatibility`: boundary to the original routes and page composition.
- `src/vendor/framer`: generated sections, CMS, routing, animation and font modules. This is deliberately retained compatibility code, not handwritten TypeScript. The original bundled React renderer has been replaced with imports from the application's React dependency.
- `src/styles/exported.css`: original exported layout and typography.
- `public/assets`: unchanged images, fonts, portrait mask, signature and homepage overrides.

## Preservation boundaries

This is a Vite/React application, not an iframe or an injected copy of the exported HTML. Some page sections and navigation still use the Framer compatibility runtime so their design and interactions remain intact. Removing that runtime would require a separate component-by-component rewrite and visual regression pass.

The original CMS and form integrations retain their existing external dependencies. Migration does not provision a new backend or change form recipients. Browser checks do not submit forms. The retained font registry produces a large-chunk build warning; this is not a build failure. No new video intro or clickable gallery project behavior has been implemented.

## Verification

`npm test` runs production-preview checks for desktop/tablet/mobile hero content, portrait loading, gallery rotation/drag/momentum, mobile navigation, FAQ expansion, existing project navigation and direct route reloads. Run `npm run build` first.

To compare the hero against the original export, serve an archive of commit `68019eb08177ff81fcf6efcc166970a183444b9d` on port 8001 and run the production preview on port 4173, then run `npm run test:visual`. Override `BASELINE_URL` and `SITE_URL` if needed. Screenshots and diffs are written to ignored `test-results/visual/`. The comparison pauses both galleries at the same rotation only in the test browser to avoid timing differences. Gallery motion is tested separately.

Migration validation: production build and TypeScript check pass; 176 static asset files match the original bytes. Screenshots were compared at 1524, 810 and 390px. Framer's existing motion preference is used so the migrated gallery matches the export's behavior, including its reduced-motion configuration.
