const sharp = require('sharp');

async function makeProfile() {
  const workW = 852;
  const workH = 468;

  // In seq-mid.png, panel 03 is from x=606 to x=909, y=0 to y=295
  // Panel 3 has width 303, height 295.
  // The workstation content is from y=0 to y=225.
  // Let's composite it into the 852x468 widescreen canvas centered on the chair:
  // First, let's take hero-state-01-back as the base background
  const baseBack = await sharp('public/hero-state-01-back.png').toBuffer();

  // Extract the chair and 3/4 person from panel-03:
  // In panel-03, the person is from x=40 to x=280, y=20 to y=220 (width 240, height 200)
  const p3Person = await sharp('public/panel-03.png')
    .extract({ left: 35, top: 20, width: 245, height: 205 })
    .resize(340, 285)
    .toBuffer();

  // Create feather mask for p3Person
  const p3Mask = Buffer.from(`
    <svg width="340" height="285" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="p3g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="70%" stop-color="white" stop-opacity="0.95"/>
          <stop offset="90%" stop-color="white" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="340" height="285" fill="url(#p3g)"/>
    </svg>
  `);

  const maskedP3 = await sharp(p3Person)
    .composite([{ input: p3Mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // In baseBack, the chair center is at x=395, y=200
  // Place maskedP3 at left: 395 - (340 / 2) = 225, top: 40
  const profileComposited = await sharp(baseBack)
    .composite([{ input: maskedP3, left: 230, top: 48, blend: 'over' }])
    .png()
    .toFile('public/hero-state-03-profile.png');

  console.log("hero-state-03-profile.png created with seamless background!");
}

makeProfile().catch(console.error);
