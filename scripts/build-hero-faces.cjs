/**
 * Build two hero scene composites:
 * 1. back-scene.png  — dark cinematic dev studio scene (back view placeholder background)
 * 2. front-face.png  — Abdullah front-facing, dark cinematic graded, used for reveal
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.resolve(__dirname, "..", "public");
const PROFILE = path.join(PUBLIC, "abdullah-profile.jpg");

async function run() {
  const pm = await sharp(PROFILE).metadata();
  console.log("Profile:", pm.width + "x" + pm.height);

  // ── FRONT FACE: Dark-graded version of real profile for final reveal ──────
  // Crop to portrait aspect (focus on face + upper torso)
  const FW = 520, FH = 640;
  const cropW = pm.width;
  const cropH = Math.round(pm.width * (FH / FW)); // maintain ratio
  const cropTop = Math.max(0, Math.round((pm.height - cropH) * 0.08)); // slight upper crop

  // Process portrait with cinematic dark grading
  const portraitBuf = await sharp(PROFILE)
    .extract({ left: 0, top: cropTop, width: cropW, height: Math.min(cropH, pm.height - cropTop) })
    .resize(FW, FH, { fit: "cover", position: "top" })
    .modulate({ brightness: 0.68, saturation: 0.5 })
    .gamma(1.15)
    .toBuffer();

  // Radial alpha mask (feather edges, keep face center fully opaque)
  const fMask = `<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="m" cx="50%" cy="38%" r="52%">
        <stop offset="0%" stop-color="white" stop-opacity="1"/>
        <stop offset="58%" stop-color="white" stop-opacity="0.98"/>
        <stop offset="78%" stop-color="white" stop-opacity="0.65"/>
        <stop offset="90%" stop-color="white" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bt" x1="0" y1="0.6" x2="0" y2="1">
        <stop offset="0%" stop-color="white" stop-opacity="1"/>
        <stop offset="100%" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <mask id="cm">
        <rect width="${FW}" height="${FH}" fill="url(#bt)"/>
      </mask>
    </defs>
    <rect width="${FW}" height="${FH}" fill="url(#m)" mask="url(#cm)"/>
  </svg>`;

  const fMaskBuf = await sharp(Buffer.from(fMask)).png().toBuffer();
  const maskedFace = await sharp(portraitBuf).ensureAlpha()
    .composite([{ input: fMaskBuf, blend: "dest-in" }]).toBuffer();

  // Dark cinematic background for front face
  const fbg = `<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg" cx="50%" cy="80%" r="90%">
        <stop offset="0%" stop-color="#0D0000"/>
        <stop offset="50%" stop-color="#060000"/>
        <stop offset="100%" stop-color="#020202"/>
      </radialGradient>
      <radialGradient id="rimR" cx="92%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#7A0000" stop-opacity="0.65"/>
        <stop offset="70%" stop-color="#3A0000" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="rimL" cx="8%" cy="45%" r="50%">
        <stop offset="0%" stop-color="#400000" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <radialGradient id="top" cx="50%" cy="0%" r="60%">
        <stop offset="0%" stop-color="#300000" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect width="${FW}" height="${FH}" fill="url(#bg)"/>
    <rect width="${FW}" height="${FH}" fill="url(#rimR)"/>
    <rect width="${FW}" height="${FH}" fill="url(#rimL)"/>
    <rect width="${FW}" height="${FH}" fill="url(#top)"/>
  </svg>`;

  const fbgBuf = await sharp(Buffer.from(fbg)).png().toBuffer();
  const faceLeft = Math.round((FW - 520) / 2);
  const faceTop = 0;

  // Vignette overlay
  const fvgn = `<svg width="${FW}" height="${FH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="v" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="72%" stop-color="rgba(2,2,2,0.15)"/>
        <stop offset="100%" stop-color="rgba(2,2,2,0.7)"/>
      </radialGradient>
      <radialGradient id="rr" cx="88%" cy="35%" r="40%">
        <stop offset="0%" stop-color="#E50914" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      <linearGradient id="bb" x1="0" y1="0.6" x2="0" y2="1">
        <stop offset="0%" stop-color="transparent"/>
        <stop offset="100%" stop-color="#020202" stop-opacity="0.88"/>
      </linearGradient>
    </defs>
    <rect width="${FW}" height="${FH}" fill="url(#v)"/>
    <rect width="${FW}" height="${FH}" fill="url(#rr)"/>
    <rect width="${FW}" height="${FH}" fill="url(#bb)"/>
  </svg>`;
  const fvgnBuf = await sharp(Buffer.from(fvgn)).png().toBuffer();

  const frontFace = await sharp(fbgBuf)
    .composite([
      { input: maskedFace, top: faceTop, left: faceLeft, blend: "over" },
      { input: fvgnBuf, blend: "over" },
    ])
    .png({ compressionLevel: 8 })
    .toBuffer();

  fs.writeFileSync(path.join(PUBLIC, "hero-front-face.png"), frontFace);
  const ffm = await sharp(path.join(PUBLIC, "hero-front-face.png")).metadata();
  console.log("front-face:", ffm.width + "x" + ffm.height, Math.round(fs.statSync(path.join(PUBLIC, "hero-front-face.png")).size/1024) + "KB");
}

run().catch(e => { console.error(e); process.exit(1); });
