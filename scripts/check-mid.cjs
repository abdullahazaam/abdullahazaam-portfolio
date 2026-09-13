const sharp = require('sharp');

async function checkPanels() {
  const meta = await sharp('public/seq-mid.png').metadata();
  console.log("seq-mid dimensions:", meta.width, "x", meta.height);
  // Total width 1212.
  // There are thin borders between the 4 panels.
  // Let's crop each panel:
  // Width of each panel is approx 300px, height is 295px.
  // Let's inspect the panel widths.
  for (let i = 0; i < 4; i++) {
    const left = Math.round(i * (1212 / 4));
    const width = Math.round(1212 / 4);
    await sharp('public/seq-mid.png')
      .extract({ left, top: 0, width, height: meta.height })
      .toFile(`public/panel-0${i+1}.png`);
  }
  console.log("Panels 1-4 extracted");
}
checkPanels();
