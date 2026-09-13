const sharp = require('sharp');

async function testFace() {
  const botMeta = await sharp('public/seq-bot.png').metadata();
  console.log("seq-bot.png dimensions:", botMeta.width, "x", botMeta.height);

  // In seq-bot.png (1212 x 468):
  // Let's locate the head of the developer.
  // The developer is centered around x=750, y=70 to 180 roughly.
  // Let's crop a box around the head in seq-bot to inspect the exact head dimensions!
  await sharp('public/seq-bot.png')
    .extract({ left: 680, top: 40, width: 180, height: 220 })
    .toFile('public/test-bot-head.png');

  console.log("Extracted test-bot-head.png");
}
testFace();
