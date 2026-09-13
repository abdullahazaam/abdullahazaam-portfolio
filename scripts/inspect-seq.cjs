const sharp = require('sharp');
async function run() {
  const meta = await sharp('public/sequence.png').metadata();
  console.log("Width:", meta.width, "Height:", meta.height);
  // Let's check vertical slices
  // Top banner seems to be roughly top 0 to 520px
  // Middle 4 panels seem to be roughly 520px to 840px
  // Bottom banner seems to be roughly 840px to 1298px
}
run();
