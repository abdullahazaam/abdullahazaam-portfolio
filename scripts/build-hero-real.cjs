const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const PROFILE_SRC = path.join(PUBLIC, "abdullah-profile.jpg");
const OUT = path.join(PUBLIC, "abdullah-hero-real.png");

async function buildHeroComposite() {
  console.log("Reading profile image...");
  const profileMeta = await sharp(PROFILE_SRC).metadata();
  const sw = profileMeta.width;
  const sh = profileMeta.height;
  console.log("  Original size:", sw + "x" + sh);

  const CANVAS_W = 640;
  const CANVAS_H = 560;

  // Crop + resize portrait (focus on upper body/face)
  const cropH = Math.round(sh * 0.88);
  const portraitBuf = await sharp(PROFILE_SRC)
    .extract({ left: 0, top: 0, width: sw, height: cropH })
    .resize(CANVAS_W, Math.round(CANVAS_H * 0.92), { fit: "cover", position: "top" })
    .modulate({ brightness: 0.72, saturation: 0.55 })
    .gamma(1.2)
    .toBuffer();

  const pMeta = await sharp(portraitBuf).metadata();
  const PW = pMeta.width;
  const PH = pMeta.height;

  // Radial alpha mask
  const maskSvg = '<svg width="' + PW + '" height="' + PH + '" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="rm" cx="50%" cy="42%" r="58%"><stop offset="0%" stop-color="white" stop-opacity="1"/><stop offset="52%" stop-color="white" stop-opacity="0.97"/><stop offset="72%" stop-color="white" stop-opacity="0.75"/><stop offset="86%" stop-color="white" stop-opacity="0.35"/><stop offset="100%" stop-color="white" stop-opacity="0"/></radialGradient><linearGradient id="bf" x1="0" y1="0" x2="0" y2="1"><stop offset="55%" stop-color="white" stop-opacity="1"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient><mask id="cm"><rect width="' + PW + '" height="' + PH + '" fill="url(#bf)"/></mask></defs><rect width="' + PW + '" height="' + PH + '" fill="url(#rm)" mask="url(#cm)"/></svg>';

  const maskBuf = await sharp(Buffer.from(maskSvg)).png().toBuffer();
  const maskedPortraitBuf = await sharp(portraitBuf).ensureAlpha().composite([{ input: maskBuf, blend: "dest-in" }]).toBuffer();

  // Dark desk environment base
  const baseSvg = '<svg width="' + CANVAS_W + '" height="' + CANVAS_H + '" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="base" cx="50%" cy="100%" r="100%"><stop offset="0%" stop-color="#0A0000"/><stop offset="40%" stop-color="#060000"/><stop offset="100%" stop-color="#020202"/></radialGradient><radialGradient id="rr" cx="95%" cy="50%" r="60%"><stop offset="0%" stop-color="#5A0000" stop-opacity="0.7"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient><radialGradient id="dg" cx="50%" cy="100%" r="55%"><stop offset="0%" stop-color="#780000" stop-opacity="0.45"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient><radialGradient id="mg" cx="20%" cy="15%" r="45%"><stop offset="0%" stop-color="#400000" stop-opacity="0.5"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient></defs><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#base)"/><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#rr)"/><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#dg)"/><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#mg)"/></svg>';

  const baseBuf = await sharp(Buffer.from(baseSvg)).png().toBuffer();

  const leftOffset = Math.round((CANVAS_W - PW) / 2);
  const topOffset = Math.max(0, Math.round(CANVAS_H - PH));

  const compositedBuf = await sharp(baseBuf)
    .composite([{ input: maskedPortraitBuf, top: topOffset, left: leftOffset, blend: "over" }])
    .toBuffer();

  // Final vignette + bottom fade
  const vignetteSvg = '<svg width="' + CANVAS_W + '" height="' + CANVAS_H + '" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="vg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="transparent"/><stop offset="75%" stop-color="rgba(2,2,2,0.2)"/><stop offset="100%" stop-color="rgba(2,2,2,0.75)"/></radialGradient><radialGradient id="redr" cx="85%" cy="40%" r="45%"><stop offset="0%" stop-color="#E50914" stop-opacity="0.12"/><stop offset="100%" stop-color="transparent"/></radialGradient><linearGradient id="bb" x1="0" y1="0.55" x2="0" y2="1"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="#020202" stop-opacity="0.9"/></linearGradient></defs><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#vg)"/><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#redr)"/><rect width="' + CANVAS_W + '" height="' + CANVAS_H + '" fill="url(#bb)"/></svg>';

  const vignetteBuf = await sharp(Buffer.from(vignetteSvg)).png().toBuffer();
  const finalBuf = await sharp(compositedBuf).composite([{ input: vignetteBuf, blend: "over" }]).png({ compressionLevel: 8 }).toBuffer();

  fs.writeFileSync(OUT, finalBuf);
  const outMeta = await sharp(OUT).metadata();
  console.log("Done! Size:", outMeta.width + "x" + outMeta.height, Math.round(fs.statSync(OUT).size / 1024) + "KB");
}

buildHeroComposite().catch(err => { console.error("Error:", err); process.exit(1); });
