# Historical cinematic portfolio QA

The current website.png redesign and its verification are documented in [website/README.md](website/README.md). The chair-based implementation described below has been removed; these earlier checks are retained only as history.

The existing section text, project data, screenshot paths, links, and contact details were compared against `content-before.json` and preserved.

## Browser checks

Local Chrome passed at 1440×900, 1024×768, 768×1024, and 390×844. Screenshots in this directory show the back, turning, and front poses, section styling, and the direct transition into About.

`final-report.json` records the final assertions:

- ScrollTrigger pins the full-screen hero throughout its scroll range.
- Idle scroll progress stays unchanged; upward scrolling reverses the pose.
- Hero text remains inside the viewport throughout the sequence.
- Hero-to-About gap and document horizontal overflow are both zero.
- One WebGL canvas is mounted; no image sequences are used.
- The hero project link, tablet navigation, cursor lighting, and card tilt work.
- Reduced motion removes hero pinning and ambient animation.
- A CSS workstation renders when WebGL cannot be created.
- No uncaught browser errors in the four standard viewport runs.

`npm.cmd run build` passed. Vite reports a size advisory for the lazy-loaded Three.js room chunk (approximately 224 kB gzip); it is separate from the main application chunk. WebGL uses demand rendering and capped pixel density, with lower-resolution shadows and no shadow casting on small scene viewports.

The developer is a procedural, stylized 3D model, not a photographic reconstruction of the references. All room rotation and depth changes derive from scroll progress.

To repeat browser QA, start the Vite server on port 3000, install Playwright locally with `npm.cmd install --no-save --package-lock=false playwright`, then run `node qa/final-check.mjs`. The runner uses the installed Chrome executable and closes its browser in a `finally` block.
