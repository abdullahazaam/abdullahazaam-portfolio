# website.png redesign verification

The existing portfolio was restyled against the left-hand website in `public/website.png`. Its annotation panel was excluded from the UI. The previous chair, procedural avatar, WebGL room, pinning, and image-sequence code were removed.

The supplied `abdullah-profile.jpg` is the identity source for the front-facing photographic hero composite. The original photo remains unchanged. See [asset notes and exact imagegen prompts](asset-notes.md) for source/output paths and the image-editing workflow.

All five original projects and all eighteen technologies remain. Their counts exceed the reference's four project cards and sixteen skill cards, so the desktop grids retain the reference's compact styling while accommodating the complete existing content. Section copy, project descriptions/data, screenshots, links, contact details, and footer text were preserved.

## Checks

- Chrome screenshots for every section at 1440×900, 1024×768, 768×1024, and 390×844.
- No horizontal document overflow, clipped text, missing images, or uncaught browser errors.
- No WebGL canvases, hero pins, image swapping, or blank spacer after the hero.
- Hero and mobile-menu anchor navigation work.
- Cursor lighting, card tilt, hover reset, and the progressive Journey line work.
- Reduced motion disables hero parallax and ambient/orbit animation.
- Contact highlights correctly in navigation at the bottom of the page.
- `npm.cmd run build` completes successfully; the previous Three.js chunk is no longer shipped.

`report.json` contains viewport measurements and content/link checks. `interactions.json` contains behavioral assertions. PNG screenshots are stored alongside them. The two working source PNGs are QA artifacts; the website loads optimized WebP assets.

To repeat: run the local Vite server on port 3000, then `node qa/website/check.mjs` and `node qa/website/interactions.mjs`. These scripts use the installed Chrome browser through Playwright.
