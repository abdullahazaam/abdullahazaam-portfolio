# Journey and Contact refinement

Only Journey and Contact source components and their scoped styling were edited. The mountain background, five roadmap stages, contact details, links, and existing form handlers are preserved.

- Journey uses an SVG curved route, scroll drawing, travelling energy, floating glass milestones, and restrained particles.
- Contact uses larger glass cards, pointer lighting/tilt, a deeper form panel, and an orbital quote composition.
- Reduced motion disables continuous decorative animation; touch layouts use lighter effects.

## Verification

`before.json` and `after.json` record the original and final heights, text, links, and horizontal overflow at 1440, 1024, 768, and 390px. Heights match at every tested size. `after-*-journey.png` and `after-*-contact.png` are the visual captures.

`interactions.json` records passing energy animation, hover lighting, clipboard, existing form confirmation/reset, reduced-motion, height, and link checks. The form retains its pre-existing local confirmation behavior.

`preview.html` is an isolated development QA page used while an unrelated concurrent Hero edit temporarily prevented the whole application from compiling. It is not linked into the portfolio or included as a production entry.
`npm.cmd run build` passed (TypeScript and Vite production build). Final responsive captures were repeated successfully in the complete portfolio after the unrelated Hero edit compiled.
