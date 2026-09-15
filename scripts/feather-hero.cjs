const fs = require('fs');
const sharp = require('sharp');

async function processHero() {
  const metadata = await sharp('public/abdullah-hero-desk.png').metadata();
  const width = metadata.width;
  const height = metadata.height;

  // We create an SVG mask with a rectangular fade only at the outer 8% perimeter
  const maskSvg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeX" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="6%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="94%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="fadeY" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="6%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="92%" stop-color="#ffffff" stop-opacity="1" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <mask id="fadeCombined">
          <rect width="100%" height="100%" fill="url(#fadeX)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#fadeY)" mask="url(#fadeCombined)" />
    </svg>
  `;

  const maskBuffer = await sharp(Buffer.from(maskSvg)).png().toBuffer();

  await sharp('public/abdullah-hero-desk.png')
    .ensureAlpha()
    .composite([{ input: maskBuffer, blend: 'dest-in' }])
    .png()
    .toFile('public/abdullah-hero-cinematic.png');

  console.log('Successfully created refined public/abdullah-hero-cinematic.png');
}

processHero().catch(console.error);
