const sharp = require('sharp');

async function fixHair() {
  const headW = 540;
  const headH = 680;

  // Let's create an SVG mask that starts directly at the top of the hair (y=110)
  // so no blue sky above the hair is ever included!
  const cropped = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: headW, height: headH })
    .modulate({
      brightness: 0.94,
      saturation: 1.15
    })
    .png()
    .toBuffer();

  // Head contour mask with feathered edges, cutting right at the top of the hair
  // The hair top starts at y=115.
  const svgMask = Buffer.from(`
    <svg width="${headW}" height="${headH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="feather" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7"/>
        </filter>
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="100%">
          <stop offset="68%" stop-color="white" stop-opacity="1"/>
          <stop offset="85%" stop-color="white" stop-opacity="0.8"/>
          <stop offset="95%" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="
        M 270 120
        C 335 115, 385 135, 400 180
        C 415 220, 410 285, 400 335
        C 390 385, 370 445, 340 485
        C 315 535, 295 575, 270 580
        C 245 575, 225 535, 200 485
        C 170 445, 150 385, 140 335
        C 130 285, 125 220, 140 180
        C 155 135, 205 115, 270 120
        Z
      " fill="url(#bottomFade)" filter="url(#feather)"/>
    </svg>
  `);

  // Smooth red rim light INSIDE the head contour
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

  const targetW = 186;
  const targetH = 234;

  const resizedHead = await sharp(maskedHead)
    .resize(targetW, targetH, { fit: 'fill' })
    .toBuffer();

  // Workstation crop from seq-bot
  const workstation = await sharp('public/seq-bot.png')
    .extract({ left: 360, top: 0, width: 852, height: 468 })
    .toBuffer();

  const posX = 305;
  const posY = 15; // Shift down slightly so top of hair aligns with hair in photo

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

  console.log("Updated hero-front-composite.png with clean hair!");
}

fixHair().catch(console.error);
