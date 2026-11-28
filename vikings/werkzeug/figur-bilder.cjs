// Bilder einer neuen Figur zum Prüfen, bevor sie ins Spiel kommt: vorn, Seite, hinten, ganz nah, dazu Hände und
// Beine vergrößert und eine Collage für den User. Benutzt die Ansichts-Seite (figur.html?datei=…).
// Voraussetzung: Prüf-Server auf Port 8766 im Repo-Ordner; die Datei liegt unter vikings/ (zum Ansehen kurz nach
// modelle/_probe/ legen und danach wieder entfernen). Braucht playwright und sharp.
// Aufruf: NODE_PATH=$(npm root -g) node figur-bilder.cjs <pfad unter vikings/, z. B. modelle/_probe/x-600k.glb> <zielordner> [name]
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const [DATEI, OUT, NAME = 'figur'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const fehler = [];
  async function bild(name, query, w = 390, h = 780) {
    const page = await (await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })).newPage();
    page.on('pageerror', e => fehler.push(e.message));
    await page.goto(`http://localhost:8766/vikings/figur.html?datei=${DATEI}&still&${query}`); await page.waitForFunction('window.VF && VF.bereit', null, { timeout: 240000 });
    await page.waitForTimeout(1500); await page.screenshot({ path: `${OUT}/${name}.png`, timeout: 180000 });
    const info = await page.evaluate(() => VF.info()); await page.context().close(); return info;
  }
  const info = await bild('vorn', 'dreh=0'); await bild('seite', 'dreh=1.5708'); await bild('hinten', 'dreh=3.1416'); await bild('nah', 'dreh=0&ansicht=nah');
  await bild('gross-vorn', 'dreh=0', 1100, 2200); await bild('gross-hinten', 'dreh=3.1416', 1100, 2200);
  await b.close();
  // Ausschnitte aus den großen Bildern (2200 × 4400): Hände, Beine, Rücken
  const aus = (von, name, x, y, w, h) => sharp(`${OUT}/${von}.png`).extract({ left: Math.round(2200 * x), top: Math.round(4400 * y), width: Math.round(2200 * w), height: Math.round(4400 * h) }).toFile(`${OUT}/${name}.png`);
  await aus('gross-vorn', 'hand-links', 0.13, 0.34, 0.26, 0.13); await aus('gross-vorn', 'hand-rechts', 0.61, 0.34, 0.26, 0.13);
  await aus('gross-vorn', 'beine', 0.28, 0.43, 0.44, 0.28); await aus('gross-hinten', 'ruecken', 0.25, 0.12, 0.5, 0.33);
  // Collage: vorn, Seite, hinten, ganz nah (ohne die Knöpfe der Seite)
  const teil = (n, top) => sharp(`${OUT}/${n}.png`).extract({ left: 90, top, width: 600, height: 940 }).toBuffer();
  await sharp({ create: { width: 1200, height: 1880, channels: 3, background: '#1c2632' } })
    .composite([{ input: await teil('vorn', 170), left: 0, top: 0 }, { input: await teil('seite', 170), left: 600, top: 0 }, { input: await teil('hinten', 170), left: 0, top: 940 }, { input: await teil('nah', 150), left: 600, top: 940 }])
    .jpeg({ quality: 88 }).toFile(`${OUT}/${NAME}-ansichten.jpg`);
  console.log(NAME, `${info.dreiecke} Dreiecke, ${info.mb.toFixed(1)} MB`, 'Fehler:', fehler.length ? fehler : 'keine');
})();
