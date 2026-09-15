const sharp = require('sharp');

async function makePerfectHead() {
  const headW = 540;
  const headH = 680;

  // Crop head from abdullah-profile.jpg
  const cropped = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .modulate({
      brightness: 0.86,
      saturation: 0.95
    })
    .toBuffer();

  // Create SVG mask that traces head and hair contour:
  // Top of hair starts at x=270, y=90
  // Hair peaks: x=240,y=80 to x=360,y=100
  // Right side of hair: x=400, y=200 down to right ear at x=395, y=340
  // Right jawline: x=370, y=440 down to chin at x=270, y=570
  // Left jawline: x=175, y=440 up to left ear at x=145, y=340
  // Left side of hair: x=140, y=200 up to x=220, y=100
  const svgMask = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6"/>
        </filter>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="65%" stop-color="white" stop-opacity="1"/>
          <stop offset="85%" stop-color="white" stop-opacity="0.8"/>
          <stop offset="96%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <!-- Head contour path -->
      <path d="
        M 270 95
        C 330 85, 380 120, 395 180
        C 410 230, 400 300, 390 340
        C 385 390, 360 450, 335 490
        C 310 535, 290 575, 270 580
        C 250 575, 230 535, 205 490
        C 180 450, 155 390, 150 340
        C 140 300, 130 230, 145 180
        C 160 120, 210 85, 270 95
        Z
      " fill="url(#bottomFade)" filter="url(#feather)"/>
    </svg>
  `);

  // Red rim overlay
  const svgRim = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="78%" stop-color="transparent"/>
          <stop offset="92%" stop-color="#E50914" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#FF3333" stop-opacity="0.8"/>
        </linearGradient>
      </defs>
      <rect width="${headW}" height="${headH}" fill="url(#rimGrad)"/>
    </svg>
  `);

  await sharp(cropped)
    .composite([
      { input: svgMask, blend: 'dest-in' },
      { input: svgRim, blend: 'over' }
    ])
    .png()
    .toFile('public/abdullah-head-perfect.png');

  console.log("Perfect head created!");
}

makePerfectHead().catch(console.error);
