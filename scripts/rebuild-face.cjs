const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.resolve(__dirname, "..", "public");
const PROFILE = path.join(PUBLIC, "abdullah-profile.jpg");
const OUT = path.join(PUBLIC, "hero-front-face.png");

async function run() {
  const pm = await sharp(PROFILE).metadata();
  const FW = 500, FH = 620;
  const cropH = Math.round(pm.height * 0.86);
  const cropTop = Math.round(pm.height * 0.01);

  const { data, info } = await sharp(PROFILE)
    .extract({ left: 0, top: cropTop, width: pm.width, height: cropH })
    .resize(FW, FH, { fit: "cover", position: "top" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data.buffer);

  for (let i = 0; i < pixels.length; i += info.channels) {
    const r = pixels[i], g = pixels[i+1], b = pixels[i+2];

    // Sky: high blue dominance + bright
    const isSky = b > r + 25 && b > 130 && b > g;
    // Light background (buildings, concrete)
    const isLightBG = g > r + 8 && b > r + 5 && r < 170 && r > 80;
    // Determine if it's a face/warm skin pixel
    const isSkin = r > 100 && r > g + 10 && r > b + 20;

    if (isSky) {
      pixels[i] = Math.round(r * 0.08);
      pixels[i+1] = Math.round(g * 0.06);
      pixels[i+2] = Math.round(b * 0.06);
    } else if (isLightBG && !isSkin) {
      // Buildings / lighter background — darken but leave slight warm tint
      pixels[i] = Math.round(r * 0.14);
      pixels[i+1] = Math.round(g * 0.1);
      pixels[i+2] = Math.round(b * 0.08);
    } else if (isSkin) {
      // Skin/face: preserve warmth, slight darkening for cinematic
      pixels[i] = Math.min(255, Math.round(r * 0.82));
      pixels[i+1] = Math.min(255, Math.round(g * 0.72));
      pixels[i+2] = Math.min(255, Math.round(b * 0.62));
    } else {
      // Hair, dark clothing etc — lightly darken
      pixels[i] = Math.round(r * 0.65);
      pixels[i+1] = Math.round(g * 0.58);
      pixels[i+2] = Math.round(b * 0.5);
    }
  }

  const processedBuf = await sharp(Buffer.from(pixels.buffer), {
    raw: { width: FW, height: FH, channels: info.channels }
  }).png().toBuffer();

  const maskSvg = `<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="rm" cx="50%" cy="35%" r="50%">
        <stop offset="0%" stop-color="white" stop-opacity="1"/>
        <stop offset="50%" stop-color="white" stop-opacity="1"/>
        <stop offset="68%" stop-color="white" stop-opacity="0.82"/>
        <stop offset="82%" stop-color="white" stop-opacity="0.45"/>
        <stop offset="93%" stop-color="white" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bt" x1="0" y1="0.48" x2="0" y2="1">
        <stop offset="0%" stop-color="white" stop-opacity="1"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <mask id="cm"><rect width="${FW}" height="${FH}" fill="url(#bt)"/></mask>
    </defs>
    <rect width="${FW}" height="${FH}" fill="url(#rm)" mask="url(#cm)"/>
  </svg>`;
  const maskBuf = await sharp(Buffer.from(maskSvg)).png().toBuffer();
  const masked = await sharp(processedBuf).ensureAlpha()
    .composite([{ input: maskBuf, blend: "dest-in" }]).toBuffer();

  const bgSvg = `<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="80%" r="90%">
        <stop offset="0%" stop-color="#110000"/>
        <stop offset="35%" stop-color="#080000"/>
        <stop offset="100%" stop-color="#020202"/>
      </radialGradient>
      <radialGradient id="rR" cx="94%" cy="40%" r="56%">
        <stop offset="0%" stop-color="#900000" stop-opacity="0.68"/>
        <stop offset="50%" stop-color="#4A0000" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="rL" cx="6%" cy="42%" r="48%">
        <stop offset="0%" stop-color="#4A0000" stop-opacity="0.32"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="tL" x1="0" y1="0" x2="0" y2="0.3">
        <stop offset="0%" stop-color="#2A0000" stop-opacity="0.38"/>
        <stop offset="100%" stop-color="transparent"/>
      </linearGradient>
    </defs>
    <rect width="${FW}" height="${FH}" fill="url(#bg)"/>
    <rect width="${FW}" height="${FH}" fill="url(#rR)"/>
    <rect width="${FW}" height="${FH}" fill="url(#rL)"/>
    <rect width="${FW}" height="${FH}" fill="url(#tL)"/>
  </svg>`;
  const bgBuf = await sharp(Buffer.from(bgSvg)).png().toBuffer();

  const composited = await sharp(bgBuf)
    .composite([{ input: masked, top: 0, left: 0, blend: "over" }]).toBuffer();

  const overlaySvg = `<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="vg" cx="50%" cy="43%" r="66%">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="68%" stop-color="rgba(2,2,2,0.12)"/>
        <stop offset="100%" stop-color="rgba(2,2,2,0.7)"/>
      </radialGradient>
      <radialGradient id="rg" cx="88%" cy="35%" r="38%">
        <stop offset="0%" stop-color="#E50914" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="fade" x1="0" y1="0.46" x2="0" y2="1">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="100%" stop-color="#020202" stop-opacity="0.96"/>
      </linearGradient>
    </defs>
    <rect width="${FW}" height="${FH}" fill="url(#vg)"/>
    <rect width="${FW}" height="${FH}" fill="url(#rg)"/>
    <rect width="${FW}" height="${FH}" fill="url(#fade)"/>
  </svg>`;
  const overlayBuf = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

  const final = await sharp(composited)
    .composite([{ input: overlayBuf, blend: "over" }])
    .png({ compressionLevel: 7 })
    .toBuffer();

  fs.writeFileSync(OUT, final);
  const m = await sharp(OUT).metadata();
  console.log("Final face:", m.width + "x" + m.height, Math.round(fs.statSync(OUT).size/1024) + "KB");
}
run().catch(e => { console.error(e); process.exit(1); });
