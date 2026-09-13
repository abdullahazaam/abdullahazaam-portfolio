const sharp = require('sharp');

async function makeCleanHead() {
  const headW = 540;
  const headH = 680;

  // Crop head from abdullah-profile.jpg
  const cropped = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .modulate({
      brightness: 0.88,
      saturation: 0.95
    })
    .toBuffer();

  // Create an SVG feathered mask of the head shape
  // Head center is cx=270, cy=340
  const svgMask = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="faceGrad" cx="50%" cy="46%" r="48%">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="65%" stop-color="white" stop-opacity="1"/>
          <stop offset="82%" stop-color="white" stop-opacity="0.85"/>
          <stop offset="93%" stop-color="white" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="70%" stop-color="white" stop-opacity="1"/>
          <stop offset="90%" stop-color="white" stop-opacity="0.3"/>
          <stop offset="98%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="0%" stop-color="white" stop-opacity="0"/>
          <stop offset="8%" stop-color="white" stop-opacity="0.3"/>
          <stop offset="18%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="1"/>
        </linearGradient>
        <mask id="comboMask">
          <rect width="${headW}" height="${headH}" fill="url(#faceGrad)"/>
          <rect width="${headW}" height="${headH}" fill="url(#bottomFade)" style="mix-blend-mode: multiply;"/>
          <rect width="${headW}" height="${headH}" fill="url(#topFade)" style="mix-blend-mode: multiply;"/>
        </mask>
      </defs>
      <rect width="${headW}" height="${headH}" fill="url(#faceGrad)" mask="url(#comboMask)"/>
    </svg>
  `);

  // Red rim light on right
  const svgRim = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="75%" stop-color="transparent"/>
          <stop offset="90%" stop-color="#E50914" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#FF4D4D" stop-opacity="0.75"/>
        </linearGradient>
      </defs>
      <rect width="${headW}" height="${headH}" fill="url(#rimGrad)"/>
    </svg>
  `);

  const masked = await sharp(cropped)
    .composite([
      { input: svgMask, blend: 'dest-in' },
      { input: svgRim, blend: 'over' }
    ])
    .png()
    .toFile('public/abdullah-head-clean.png');

  console.log("Clean head created successfully!");
}

makeCleanHead().catch(console.error);
