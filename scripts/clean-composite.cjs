const sharp = require('sharp');

async function cleanComposite() {
  const headW = 540;
  const headH = 680;

  // 1. Abdullah head crop with warm studio grading
  const cropped = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .modulate({
      brightness: 0.94,
      saturation: 1.15
    })
    .toBuffer();

  // 2. Head contour mask with feathered edges
  const svgMask = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9"/>
        </filter>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="68%" stop-color="white" stop-opacity="1"/>
          <stop offset="85%" stop-color="white" stop-opacity="0.8"/>
          <stop offset="95%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="
        M 270 75
        C 340 65, 405 105, 420 165
        C 435 215, 425 285, 415 335
        C 405 385, 385 445, 350 485
        C 320 535, 298 575, 270 580
        C 242 575, 220 535, 190 485
        C 155 445, 135 385, 125 335
        C 115 285, 105 215, 120 165
        C 135 105, 200 65, 270 75
        Z
      " fill="url(#bottomFade)" filter="url(#feather)"/>
    </svg>
  `);

  // 3. Smooth red rim light INSIDE the head contour
  const svgRim = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="72%" stop-color="transparent"/>
          <stop offset="88%" stop-color="#E50914" stop-opacity="0.4"/>
          <stop offset="96%" stop-color="#FF3333" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="transparent"/>
        </linearGradient>
      </defs>
      <rect width="${headW}" height="${headH}" fill="url(#rimGrad)"/>
    </svg>
  `);

  // First apply rim light to cropped, THEN apply mask so rim light NEVER extends past the mask!
  const rimmed = await sharp(cropped)
    .composite([
      { input: svgRim, blend: 'over' }
    ])
    .toBuffer();

  const maskedHead = await sharp(rimmed)
    .composite([
      { input: svgMask, blend: 'dest-in' }
    ])
    .png()
    .toBuffer();

  // Target size to match the AI body:
  const targetW = 186;
  const targetH = 234;

  const resizedHead = await sharp(maskedHead)
    .resize(targetW, targetH, { fit: 'fill' })
    .toBuffer();

  // Workstation crop from seq-bot
  const workstation = await sharp('public/seq-bot.png')
    .extract({ left: 360, top: 0, width: 852, height: 468 })
    .toBuffer();

  // Position:
  // Center is at x = 398, y = 112
  // posX = 398 - (targetW / 2) = 398 - 93 = 305
  // posY = 112 - (targetH / 2) = 112 - 117 = -5
  const posX = 305;
  const posY = -5;

  const fadeLeftSvg = Buffer.from(`
    <svg width="852" height="468" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lf" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stop-color="#050505" stop-opacity="1"/>
          <stop offset="14%" stop-color="#050505" stop-opacity="0.95"/>
          <stop offset="28%" stop-color="#050505" stop-opacity="0.5"/>
          <stop offset="40%" stop-color="#050505" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="852" height="468" fill="url(#lf)"/>
    </svg>
  `);

  await sharp(workstation)
    .composite([
      { input: resizedHead, left: posX, top: posY, blend: 'over' },
      { input: fadeLeftSvg, blend: 'over' }
    ])
    .png()
    .toFile('public/hero-front-composite.png');

  console.log("cleanComposite completed!");
}

cleanComposite().catch(console.error);
