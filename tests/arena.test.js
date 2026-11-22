// Prüft das Kampfspiel im simulierten Handy (Playwright, ohne Grafikkarte).
// Vorher im Ordner des Spiels starten:  python3 -m http.server 8766
// Aufruf:  node tests/arena.test.js
// Liegt das Spiel in einem Unterordner, die Adresse mitgeben: ARENA_URL=http://localhost:8766/arena/index.html
// Ohne Grafikkarte läuft das Spiel langsam. Die Prüfungen warten deshalb auf Ergebnisse statt auf feste Zeiten,
// und ganze Kämpfe laufen mit ?tempo= beschleunigt und mit einem Computer-Spieler (?auto).
const { chromium } = require('playwright');
const path = require('path');
const URL = process.env.ARENA_URL || 'http://localhost:8766/index.html';
const SHOTS = path.join(__dirname, 'screenshots');
let fehler = 0; const ok = (bed, text) => { console.log((bed ? '  ✓ ' : '  ✗ ') + text); if (!bed) fehler++; };

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const neu = async (query, dsf = 1) => { const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: dsf });
    const page = await ctx.newPage(); page.fehler = []; page.on('pageerror', e => page.fehler.push(e.message)); page.on('console', m => { if (m.type() === 'error') page.fehler.push(m.text()); });
    await page.goto(URL + '?' + query); await page.waitForFunction('window.AR && AR.bereit', null, { timeout: 90000 }); return page; };
  const info = page => page.evaluate(() => AR.info());
  const warte = (page, f, arg, ms = 60000) => page.waitForFunction(f, arg, { timeout: ms }).then(() => true).catch(() => false);
  const bild = (page, name) => page.screenshot({ path: path.join(SHOTS, name + '.png'), timeout: 90000 });

  console.log('Start');
  let page = await neu('neu');
  ok(page.fehler.length === 0, 'keine Fehler beim Laden' + (page.fehler.length ? ': ' + page.fehler[0] : ''));
  ok((await page.evaluate(() => AR.fehlend.length)) === 0, 'alle Figuren geladen');
  ok(await page.isVisible('#los'), 'Menü mit Start-Knopf erscheint');
  await page.click('[data-char=maedchen]'); await page.click('[data-modus=wellen]');
  ok(await page.evaluate(() => AR.stand.char === 'maedchen' && AR.stand.modus === 'wellen'), 'Kämpfer und Modus lassen sich wählen');
  await page.click('[data-char=junge]'); await page.click('[data-modus=duell]'); await page.click('#los');
  ok((await info(page)).läuft && (await info(page)).modus === 'duell', 'Kampf startet');
  ok(await warte(page, () => AR.info().phase === 'play'), 'nach dem Herunterzählen geht es los');

  console.log('Bedienung');
  // Gegner für die Prüfungen stillstellen: sein Computer-Gehirn abschalten
  await page.evaluate(() => { AR.app.match.bots[1] = null; });
  const a = await info(page);
  await page.mouse.move(100, 600); await page.mouse.down(); await page.mouse.move(100, 530, { steps: 4 });
  ok(await page.evaluate(() => !!AR.eingabe.joy), 'Finger links startet den Steuerkreis');
  ok(await warte(page, z0 => AR.info().ich.z < z0 - 0.8, a.ich.z), 'Figur läuft nach oben auf den Gegner zu');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  ok(await page.evaluate(() => AR.eingabe.joy === null), 'Fokus-Verlust lässt die Lenkung nicht hängen');
  await page.mouse.up();
  // Direkt vor den Gegner stellen und zuschlagen
  await page.evaluate(() => { const k = AR.app.match.kampf, ich = k.k[0], g = k.k[1]; ich.x = g.x; ich.z = g.z + 1.1; ich.r = Math.PI; ich.mx = ich.mz = 0; });
  const l0 = (await info(page)).gegner[0].leben;
  await page.dispatchEvent('#kAngriff', 'pointerdown'); await page.dispatchEvent('#kAngriff', 'pointerup');
  ok(await warte(page, l => AR.info().gegner[0].leben < l, l0), 'Angriff trifft und zieht dem Gegner Leben ab');
  ok((await info(page)).ich.energie > 0, 'Treffer füllen die Spezial-Leiste');
  // Ausweichen macht unverwundbar: Gegner schlägt, während wir rollen
  await page.evaluate(() => { const k = AR.app.match.kampf, ich = k.k[0], g = k.k[1]; g.zustand = 'frei'; g.schutz = 0; ich.zustand = 'frei'; ich.rollePause = 0; ich.x = g.x; ich.z = g.z + 1.0; });
  const m0 = (await info(page)).ich.leben;
  await page.evaluate(() => { const k = AR.app.match.kampf; k.k[0].wunsch.rolle = true; k.k[1].r = 0; k.k[1].wunsch.angriff = true; });
  await warte(page, () => AR.info().ich.zustand === 'rolle', null, 10000); await page.waitForTimeout(600);
  ok((await info(page)).ich.leben === m0, 'Ausweichen: der Schlag des Gegners geht ins Leere');
  // Spezial bei voller Leiste
  await page.evaluate(() => { const ich = AR.app.match.kampf.k[0]; ich.zustand = 'frei'; ich.energie = 100; });
  await page.dispatchEvent('#kSpezial', 'pointerdown'); await page.dispatchEvent('#kSpezial', 'pointerup');
  ok(await warte(page, () => AR.info().ich.spezial > 0), 'Spezial verwandelt bei voller Leiste');
  await page.waitForTimeout(300); await bild(page, 'test-spezial');
  ok(page.fehler.length === 0, 'keine Fehler während des Kampfes' + (page.fehler.length ? ': ' + page.fehler[0] : ''));
  await page.context().close();

  console.log('Ganzes Duell und Wellen (Computer spielt, beschleunigt)');
  page = await neu('neu&start&auto&tempo=6&modus=duell&stufe=1&spielerStufe=9&seed=11');
  ok(await warte(page, () => AR.info().phase === 'over', null, 240000), 'Duell läuft bis zum Ende');
  ok((await info(page)).gewonnen === true && await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 10000), 'starker Spieler gewinnt gegen Stufe 1, Ergebnis erscheint');
  ok(await page.evaluate(() => AR.stand.stufe === 2), 'nach dem Sieg steigt die Stufe des Computers');
  await page.click('#zumMenü'); ok(await page.isVisible('#los'), 'zurück ins Menü');
  await page.context().close();
  page = await neu('neu&start&auto&tempo=6&modus=wellen&stufe=3&spielerStufe=9&seed=104');
  ok(await warte(page, () => AR.info().phase === 'over', null, 300000), 'Wellen-Lauf läuft bis zum Ende');
  const w = await info(page); ok(w.gewonnen !== null, `Wellen-Ergebnis steht fest (${w.gewonnen ? 'gewonnen' : 'verloren in Welle ' + (w.welle + 1)})`);
  await page.context().close();

  console.log('Fehlende Modelle');
  page = await neu('neu&start&ohne=modelle');
  ok((await page.evaluate(() => AR.fehlend.length)) > 0 && (await info(page)).läuft && page.fehler.length === 0, 'Spiel startet mit Ersatzfiguren');
  await page.context().close();

  console.log('Bilder in doppelter Auflösung (bitte ansehen: tests/screenshots/)');
  page = await neu('neu', 2); await page.waitForTimeout(1500); await bild(page, '1-menue');
  await page.click('#los'); await warte(page, () => AR.info().phase === 'play'); await page.waitForTimeout(700); await bild(page, '2-kampf');
  await page.context().close();
  page = await neu('neu&start&auto&modus=duell&stufe=5&spielerStufe=6&seed=3', 2);
  await warte(page, () => AR.info().gegner[0].zustand === 'taumel', null, 90000); await bild(page, '3-treffer');
  await warte(page, () => AR.info().ich.spezial > 0, null, 120000); await page.waitForTimeout(500); await bild(page, '4-steinriese');
  await page.context().close();
  page = await neu('neu&start&auto&modus=wellen&stufe=3&spielerStufe=8&seed=104', 2);
  await warte(page, () => AR.info().phase === 'play' && AR.info().zeit > 1.2, null, 90000); await bild(page, '5-wellen');
  await page.context().close();
  page = await neu('neu&start&auto&tempo=6&modus=duell&stufe=1&spielerStufe=9&seed=11', 2);
  await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 240000); await page.waitForTimeout(400); await bild(page, '6-ergebnis');
  await browser.close();
  console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles grün');
  process.exit(fehler ? 1 : 0);
})();
