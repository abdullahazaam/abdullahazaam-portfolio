const sharp = require('sharp');

async function extractStates() {
  const workW = 852;
  const workH = 468;

  // 1. BACK STATE from seq-top.png
  // In seq-top.png (1212x535), the workstation is roughly from left: 360, top: 65, width: 852, height: 468
  const backWorkstation = await sharp('public/seq-top.png')
    .extract({ left: 360, top: 65, width: workW, height: workH })
    .toBuffer();

  const fadeLeftSvg = Buffer.from(`
    <svg width="${workW}" height="${workH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lf" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stop-color="#050505" stop-opacity="1"/>
          <stop offset="14%" stop-color="#050505" stop-opacity="0.95"/>
          <stop offset="28%" stop-color="#050505" stop-opacity="0.5"/>
          <stop offset="40%" stop-color="#050505" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${workW}" height="${workH}" fill="url(#lf)"/>
    </svg>
  `);

  await sharp(backWorkstation)
    .composite([{ input: fadeLeftSvg, blend: 'over' }])
    .png()
    .toFile('public/hero-state-01-back.png');

  // Copy our verified front composite to hero-state-04-front.png
  await sharp('public/hero-front-composite.png')
    .toFile('public/hero-state-04-front.png');

  // 2. TURN STATE 02 (from panel-02)
  // In panel-02 (width 303, height 295), crop the image content without the bottom text banner:
  // y from 0 to 225
  const p2Meta = await sharp('public/panel-02.png').metadata();
  const p2Crop = await sharp('public/panel-02.png')
    .extract({ left: 10, top: 10, width: p2Meta.width - 20, height: 215 })
    .resize(workW, workH, { fit: 'cover' })
    .toBuffer();

  await sharp(p2Crop)
    .composite([{ input: fadeLeftSvg, blend: 'over' }])
    .png()
    .toFile('public/hero-state-02-turn.png');

  // 3. PROFILE STATE 03 (from panel-03)
  const p3Meta = await sharp('public/panel-03.png').metadata();
  const p3Crop = await sharp('public/panel-03.png')
    .extract({ left: 10, top: 10, width: p3Meta.width - 20, height: 215 })
    .resize(workW, workH, { fit: 'cover' })
    .toBuffer();

  await sharp(p3Crop)
    .composite([{ input: fadeLeftSvg, blend: 'over' }])
    .png()
    .toFile('public/hero-state-03-profile.png');

  console.log("All 4 states generated successfully!");
}

extractStates().catch(console.error);
