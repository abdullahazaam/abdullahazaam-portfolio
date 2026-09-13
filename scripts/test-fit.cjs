const sharp = require('sharp');

async function testFit() {
  // Let's crop seq-bot.png to get the right workstation (width 852, height 468, left: 360)
  const workstation = await sharp('public/seq-bot.png')
    .extract({ left: 360, top: 0, width: 852, height: 468 })
    .toBuffer();

  // In seq-bot, the face area on the body:
  // Head width in seq-bot is ~145px, height is ~180px.
  // In our cropped workstation (left: 360):
  // Head center is at x = 768 - 360 = 408, y = 142.
  // Our abdullah-head-perfect is 540x680.
  // Let's resize abdullah-head-perfect to:
  // width: 142, height: 178
  const headW = 144;
  const headH = 182;

  const resizedHead = await sharp('public/abdullah-head-perfect.png')
    .resize(headW, headH, { fit: 'fill' })
    .toBuffer();

  // Position:
  // Center is x=408, y=142.
  // Left = 408 - (headW / 2) = 408 - 72 = 336.
  // Top = 142 - (headH / 2) = 142 - 91 = 51.
  const posX = 336;
  const posY = 51;

  // Let's also add smooth left-edge black fade on the workstation
  const fadeLeftSvg = Buffer.from(`
    <svg width="852" height="468" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lf" x1="0" y1="0" x2="100%" y2="0">
          <stop offset="0%" stop-color="#050505" stop-opacity="1"/>
          <stop offset="15%" stop-color="#050505" stop-opacity="0.95"/>
          <stop offset="30%" stop-color="#050505" stop-opacity="0.5"/>
          <stop offset="42%" stop-color="#050505" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="852" height="468" fill="url(#lf)"/>
    </svg>
  `);

  const composited = await sharp(workstation)
    .composite([
      { input: resizedHead, left: posX, top: posY, blend: 'over' },
      { input: fadeLeftSvg, blend: 'over' }
    ])
    .png()
    .toFile('public/hero-front-composite.png');

  console.log("hero-front-composite.png created!");
}

testFit().catch(console.error);
