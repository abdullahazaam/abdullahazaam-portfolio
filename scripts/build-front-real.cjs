const sharp = require('sharp');
const fs = require('fs');

async function buildFrontWithRealAbdullah() {
  // 1. In seq-bot.png (1212x468), let's crop the right workstation area (x: 360 to 1212, width: 852, height: 468)
  // Let's also check the exact head coordinates in seq-bot.png:
  // Earlier we extracted left: 680, top: 40, width: 180, height: 220 and the head was right there!
  // In the cropped workstation (left: 360):
  // The head position is at x = 680 - 360 = 320, y = 40.

  // First, let's extract the full workstation from seq-bot.png:
  const workWidth = 852;
  const workHeight = 468;
  const workLeft = 360;

  const botWorkstation = await sharp('public/seq-bot.png')
    .extract({ left: workLeft, top: 0, width: workWidth, height: workHeight })
    .toBuffer();

  // Now, let's process abdullah-profile.jpg (1178x1160)
  // Let's inspect abdullah-profile.jpg to crop his head and face accurately.
  const profMeta = await sharp('public/abdullah-profile.jpg').metadata();
  console.log("Profile meta:", profMeta.width, profMeta.height);

  // Abdullah's face in abdullah-profile.jpg is centered:
  // Head is roughly from left: 320, top: 220, width: 540, height: 680
  const headCrop = await sharp('public/abdullah-profile.jpg')
    .extract({ left: 320, top: 200, width: 540, height: 680 })
    .toBuffer();

  // In seq-bot, the head is approximately width: 140px, height: 180px.
  // Let's resize Abdullah's head to width 136, height 172.
  // Then apply color grading:
  // - Reduce bright daylight/sky
  // - Enhance contrast
  // - Add red rim light from right side
  // - Feather mask so hair and neck blend seamlessly into the hoodie

  const targetW = 140;
  const targetH = 176;

  const resizedHead = await sharp(headCrop)
    .resize(targetW, targetH, { fit: 'cover' })
    .modulate({
      brightness: 0.85,
      saturation: 0.95
    })
    .toBuffer();

  // Create an alpha mask for the head (oval feather)
  const maskSvg = Buffer.from(`
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="fade" cx="50%" cy="45%" r="48%">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="70%" stop-color="white" stop-opacity="0.95"/>
          <stop offset="85%" stop-color="white" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${targetW}" height="${targetH}" fill="url(#fade)"/>
    </svg>
  `);

  // Red rim overlay on right edge
  const rimSvg = Buffer.from(`
    <svg width="${targetW}" height="${targetH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="transparent"/>
          <stop offset="75%" stop-color="transparent"/>
          <stop offset="92%" stop-color="#E50914" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#FF4D4D" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect width="${targetW}" height="${targetH}" fill="url(#rim)"/>
    </svg>
  `);

  const maskedHead = await sharp(resizedHead)
    .composite([
      { input: maskSvg, blend: 'dest-in' },
      { input: rimSvg, blend: 'over' }
    ])
    .png()
    .toBuffer();

  // Position on workstation:
  // In seq-bot.png, head center is around x=770, y=140.
  // On cropped workstation (workLeft=360):
  // head left = 770 - 360 - (targetW / 2) = 410 - 70 = 340.
  // head top = 140 - (targetH / 2) = 140 - 88 = 52.
  const headX = 338;
  const headY = 56;

  // Composite real head onto workstation
  const frontWorkstation = await sharp(botWorkstation)
    .composite([
      { input: maskedHead, left: headX, top: headY, blend: 'over' }
    ])
    .toBuffer();

  // Create a smooth left-edge black gradient fade on the workstation so it blends seamlessly into #050505
  const fadeLeftSvg = Buffer.from(`
    <svg width="${workWidth}" height="${workHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leftFade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#050505" stop-opacity="1"/>
          <stop offset="12%" stop-color="#050505" stop-opacity="0.95"/>
          <stop offset="25%" stop-color="#050505" stop-opacity="0.5"/>
          <stop offset="35%" stop-color="#050505" stop-opacity="0"/>
          <stop offset="100%" stop-color="#050505" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${workWidth}" height="${workHeight}" fill="url(#leftFade)"/>
    </svg>
  `);

  await sharp(frontWorkstation)
    .composite([{ input: fadeLeftSvg, blend: 'over' }])
    .toFile('public/hero-room-front.png');

  console.log("Built hero-room-front.png successfully!");
}

buildFrontWithRealAbdullah().catch(console.error);
