# Hero-only viewport repair

Changed `src/components/hero/PhotoHero.tsx` and added its scoped `hero-room.css`. No other existing source file was modified. The approved `/public/seq-hero.png` is unchanged.

The hero measures the fixed navbar using ResizeObserver and sets its height to `100svh` minus that measurement. The section spans the page width and meets About without a spacer. The approved workstation is composited into a continuous room backdrop sampled from the same image; native HTML reproduces the existing text, stats, and CTA links so the baked text does not become unreadable on narrow screens.

The portrait layer remains untransformed. Small masked monitor and desk regions move at different speeds. The surrounding wall, floor perspective, halo, and text respond to scroll and fine pointers. Light sweep and particles sit behind the portrait. Reduced motion disables these effects; off-screen hero animation pauses.

`report.json` records checks at 1440×900, 1024×768, 768×1024, and 390×844: exact navbar adjacency, full viewport width/height, immediate About boundary, image loading, preserved links, no horizontal overflow, no page errors, independent parallax speeds, and a stable portrait transform. The matching hero and scroll screenshots were inspected visually.

Production validation: `npm.cmd run build` (TypeScript and Vite).
