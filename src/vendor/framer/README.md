# Generated Framer compatibility modules

These files originate from the existing export on main (`68019eb`). Keep their generated identifiers and layout definitions stable when changing authored components. Source filenames were recovered from the original source-map references so relative imports resolve through Vite.

Migration changes are limited to root-relative asset URLs, the React adapter in `react.BNsJAPhr.mjs`, removal of the old auto-mount bootstrap from `script_main.CmnDAcsZ.mjs`, and integration of the typed hero/gallery/navigation components. Original routes, CMS loaders, lower sections, lightboxes and animation runtime remain here.

`react.BNsJAPhr.mjs` forwards the export's symbol aliases to npm React 18.2 and ReactDOM. It removes generated layout-only metadata only when an element is a native DOM element, avoiding React development warnings while preserving props passed to Framer components. There is one application React root in `src/main.tsx`.
