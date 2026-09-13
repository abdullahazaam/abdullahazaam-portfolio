# Skills card refinement

Production changes are limited to `src/components/skills/Skills.tsx` plus the new `SkillCard.tsx` and `skill-cards.css` in that directory. Grid rules, section backgrounds, colors of skill icons, technology data, and other sections were not edited by this task.

The former spinning square and four corner dots are replaced with thin counter-moving perimeter arcs, two restrained light nodes (one on mobile), a rear glass layer, a soft pulse, and a rotating edge highlight. Front cards remain stable at rest. Fine pointers produce a maximum combined tilt below 5 degrees, icon lift, pointer lighting, and 1.35× orbit speed without restarting the animation. Touch disables pointer tilt; reduced motion disables decorative animation. Offscreen grid orbits pause.

Cards reveal in responsive row order using a single GSAP sequence. Pointer updates use refs and requestAnimationFrame instead of React state updates.

## Verification

- Actual-site visual captures: `after-1440.png`, `after-1024.png`, `after-768.png`, `after-390.png`, and `hover-1440.png`.
- `before.json` / `after.json`: section text, links, heights, card bounds and icons, console errors, and overflow.
- `source-before.json`: baseline source hashes. A later comparison detected concurrent external edits to `blueprint.css` and `PhotoHero.tsx`; this task did not edit those files.
- `interactions.mjs`: tests every card's idle motion and stable front, hover tilt/speed/icon/light, touch and reduced motion, plus preserved layout/content.
- `npm.cmd run build`: passed TypeScript and Vite production build.

The original component is retained under `qa/skills` only for reproducing a settled baseline with the same app and fonts. The original cards below the mobile viewport required scrolling into view before measuring their final geometry. QA pages are not linked into the site or included as production entries.
