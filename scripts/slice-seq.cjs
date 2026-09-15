const sharp = require('sharp');
const fs = require('fs');

async function slice() {
  const meta = await sharp('public/sequence.png').metadata();
  const W = meta.width; // 1212
  const H = meta.height; // 1298

  // Middle row is roughly y=540 to y=830
  // Let's crop each of the 4 middle boxes:
  // Total width 1212 / 4 = 303 roughly
  // Let's extract them:
  // Panel 01: x: 0 to 303, y: 535 to 830
  // Panel 02: x: 303 to 606, y: 535 to 830
  // Panel 03: x: 606 to 909, y: 535 to 830
  // Panel 04: x: 909 to 1212, y: 535 to 830

  // Also let's inspect the top workstation:
  // Top right workstation: x: 420 to 1212, y: 50 to 520
  // Bottom right workstation: x: 350 to 1212, y: 640 to 1298 (or around y=830 to 1298)

  await sharp('public/sequence.png')
    .extract({ left: 0, top: 0, width: 1212, height: 535 })
    .toFile('public/seq-top.png');

  await sharp('public/sequence.png')
    .extract({ left: 0, top: 535, width: 1212, height: 295 })
    .toFile('public/seq-mid.png');

  await sharp('public/sequence.png')
    .extract({ left: 0, top: 830, width: 1212, height: 468 })
    .toFile('public/seq-bot.png');

  console.log("Slices created successfully");
}
slice();
