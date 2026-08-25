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
- Footer location is split into a separate "Работаем в" footer column with a "Башкортостан" plaque below.
- Hero fact slogans share the same baseline.
- Gallery eyebrow and title start on the same left line; captions are 12px and placed in the lower-left corner.
- The route intro sentence requested by the user was removed.
- Mobile header fits at 390px wide with a compact call button.
- First 3D sample is preloaded from HTML and pre-initialized in the background after page start.
- A lightweight procedural WebGL rock appears while the exact GLB file is still downloading.
- Passport section has visible copy/table changes, not just alignment tweaks.

Verification:
- `npm run build` passed.
- `npm run lint` passed.
- Browser preview check passed with no failed network requests.
- Desktop Playwright check: after normal landing-page entry, 3D was already loaded before the click and canvas appeared in 15 ms on `#sample`.
- Cold direct `#sample` preview entry reached visible WebGL rendering in 444 ms and loaded the first GLB in 551 ms.
- With the first GLB artificially delayed by 12 seconds, the procedural WebGL fallback stayed visible instead of a blank theater.
- Product images verified as loaded 900x540 WebP assets.
