# Design QA

Final result: passed.

Checked against the latest user screenshots:
- Hero video starts in preview, uses a 1.1 MB optimized MP4, and keeps the poster as a fallback.
- First-slide fact chips are redesigned as a compact four-column fact strip.
- Product cards use large real material/quarry photos instead of tiny 3D poster thumbnails.
- 3D samples load from optimized single-file GLB assets; all three sample buttons were clicked and loaded successfully.
- Footer region is shown as "Республика Башкортостан, Россия" in a structured location block.
- Footer location block is lowered into the footer grid, aligned with the materials column.
- Gallery heading is left-aligned with the same eyebrow/title structure as the other slides.
- The route intro sentence requested by the user was removed.
- Mobile header fits at 390px wide with a compact call button.
- Passport section has visible copy/table changes, not just alignment tweaks.

Verification:
- `npm run build` passed.
- `npm run lint` passed.
- Browser preview check passed with no failed network requests.
- Desktop Playwright check: 3D canvas appeared in 238 ms on direct `#sample` entry.
- Product images verified as loaded 900x540 WebP assets.
