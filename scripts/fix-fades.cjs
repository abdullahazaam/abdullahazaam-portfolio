const sharp = require('sharp');

async function fixFades() {
  const workW = 852;
  const workH = 468;

  // Stronger left edge fade to cover up to 24% of the left side seamlessly
  const fadeLeftSvg = Buffer.from(`
    <svg width="${workW}" height="${workH}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lf" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stop-color="#020202" stop-opacity="1"/>
          <stop offset="16%" stop-color="#020202" stop-opacity="1"/>
          <stop offset="26%" stop-color="#020202" stop-opacity="0.85"/>
          <stop offset="38%" stop-color="#020202" stop-opacity="0.3"/>
          <stop offset="48%" stop-color="#020202" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${workW}" height="${workH}" fill="url(#lf)"/>
    </svg>
  `);

  // Fix hero-state-01-back.png
  const backRaw = await sharp('public/seq-top.png')
    .extract({ left: 360, top: 65, width: workW, height: workH })
    .toBuffer();

  await sharp(backRaw)
    .composite([{ input: fadeLeftSvg, blend: 'over' }])
    .png()
    .toFile('public/hero-state-01-back.png');

  // Fix hero-state-04-front.png
  const frontRaw = await sharp('public/hero-front-composite.png')
    .toBuffer();

  await sharp(frontRaw)
    .composite([{ input: fadeLeftSvg, blend: 'over' }])
    .png()
    .toFile('public/hero-state-04-front.png');

  console.log("Fades updated cleanly!");
}

fixFades().catch(console.error);
