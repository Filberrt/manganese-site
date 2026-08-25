# Design QA

Final result: passed.

Checked against the latest user screenshots:
- Hero video starts in preview, uses a 1.1 MB optimized MP4, and keeps the poster as a fallback.
- First-slide fact chips are restored as two polished client-facing groups.
- Product cards use large real material/quarry photos instead of tiny 3D poster thumbnails.
- 3D samples load from optimized single-file GLB assets; all three sample buttons were clicked and loaded successfully.
- Footer region is shown as "Республика Башкортостан, Россия" in a structured location block.
- Gallery heading is left-aligned and styled consistently with the rest of the site.
- Passport section has visible copy/table changes, not just alignment tweaks.

Verification:
- `npm run build` passed.
- `npm run lint` passed.
- Browser preview check passed with no failed network requests.
