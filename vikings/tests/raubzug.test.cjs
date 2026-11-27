// Prüft den Probekampf im simulierten Handy (Playwright, ohne Grafikkarte).
// Vorher im Repo-Ordner starten:  python3 -m http.server 8766
// Aufruf:  node vikings/tests/raubzug.test.cjs
// Ohne Grafikkarte läuft das Spiel langsam. Die Prüfungen warten deshalb auf Ergebnisse statt auf feste Zeiten,
// und ganze Kämpfe laufen beschleunigt (?tempo=) mit einem Computer-Spieler (?auto).
const { chromium } = require('playwright');
const path = require('path');
const URL = process.env.VK_URL || 'http://localhost:8766/vikings/index.html';
const SHOTS = path.join(__dirname, 'screenshots');
let fehler = 0; const ok = (bed, text) => { console.log((bed ? '  ✓ ' : '  ✗ ') + text); if (!bed) fehler++; };

(async () => {
  const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const neu = async (query, groesse = { width: 390, height: 780 }, dsf = 1) => { const ctx = await browser.newContext({ viewport: groesse, deviceScaleFactor: dsf });
    const page = await ctx.newPage(); page.fehler = []; page.on('pageerror', e => page.fehler.push(e.message)); page.on('console', m => { if (m.type() === 'error') page.fehler.push(m.text()); });
    await page.goto(URL + '?' + query + (/grafik=/.test(query) ? '' : '&grafik=hoch')); await page.waitForFunction('window.VK && VK.bereit', null, { timeout: 90000 }); return page; };
  const info = page => page.evaluate(() => VK.info());
  const warte = (page, f, arg, ms = 60000) => page.waitForFunction(f, arg, { timeout: ms }).then(() => true).catch(() => false);
  const bild = (page, name) => page.screenshot({ path: path.join(SHOTS, name + '.png'), timeout: 90000 });
  const punkt = (page, x, z) => page.evaluate(([x, z]) => VK.weltZuBild(x, z), [x, z]);
  const tippe = async (page, x, z) => { const p = await punkt(page, x, z); await page.mouse.click(p.x, p.y); };
  const ohneFehler = (page, text) => ok(page.fehler.length === 0, text + (page.fehler.length ? ': ' + page.fehler[0] : ''));

  console.log('Start');
  let page = await neu('seed=5', undefined, 2);
  const SZ = await page.evaluate(() => VK.K.TIEFE / 2 - VK.K.STRAND / 2);      // Mitte des Strands
  ohneFehler(page, 'keine Fehler beim Laden');
  ok((await page.evaluate(() => VK.fehlend.length)) === 0, 'alle Figuren geladen');
  ok(await page.isVisible('#start') && await page.isEnabled('#los') && !(await page.isVisible('#karten')), 'Startfenster mit Knopf, Karten noch verborgen');
  await bild(page, '1-start');
  await page.click('#los');
  let i = await info(page);
  ok(i.läuft && await page.isVisible('#karten') && (await page.$$('.kk')).length === 4 && !(await page.isVisible('#start')), 'nach dem Start: vier Karten unten');
  ok(i.vorrat.schild === 2 && i.vorrat.axt === 6 && i.vorrat.anfuehrer === 1 && i.vorrat.bogen === 4, 'Truppe: 2 Schildträger, 6 Axtkämpfer, 1 Anführer, 4 Bogenschützen');
  ok(!(await page.isVisible('#schrei')), 'ohne Anführer kein Kriegsschrei-Knopf');

  console.log('Krieger absetzen');
  await page.click('[data-karte=axt]');
  ok((await info(page)).karte === 'axt' && await page.evaluate(() => document.querySelector('[data-karte=axt]').classList.contains('an')), 'Karte wählen: Axtkämpfer ist markiert');
  await tippe(page, 0, 2);
  i = await info(page);
  ok(i.eigene === 0 && i.vorrat.axt === 6 && await page.evaluate(() => document.getElementById('hinweis').classList.contains('falsch')), 'Tipp ins Dorf setzt niemanden ab und zeigt einen Hinweis');
  await tippe(page, -2, SZ);
  i = await info(page);
  ok(i.eigene === 1 && i.vorrat.axt === 5 && await page.textContent('[data-karte=axt] i') === '5', 'Tipp auf den Strand setzt einen Axtkämpfer ab, die Karte zählt herunter');
  const p = await punkt(page, 2, SZ); await page.mouse.move(p.x, p.y); await page.mouse.down();
  ok(await warte(page, () => VK.info().eigene >= 4, null, 30000), 'Finger halten setzt mehrere nacheinander ab');
  await page.mouse.up(); const n1 = (await info(page)).eigene; await page.waitForTimeout(700);
  ok((await info(page)).eigene === n1, 'nach dem Loslassen kommt niemand mehr dazu');
  await page.click('[data-karte=bogen]'); await tippe(page, 0, SZ + 1);
  ok((await info(page)).vorrat.bogen === 3, 'andere Karte, anderer Krieger: ein Bogenschütze');
  await bild(page, '2-abgesetzt');

  console.log('Anführer und Kriegsschrei');
  await page.click('[data-karte=anfuehrer]'); await tippe(page, 0, SZ);
  ok(await warte(page, () => getComputedStyle(document.getElementById('schrei')).display !== 'none', null, 10000) && (await info(page)).schreiMoeglich, 'mit dem Anführer erscheint der Kriegsschrei-Knopf');
  ok(await page.evaluate(() => document.querySelector('[data-karte=anfuehrer]').disabled), 'die Anführer-Karte ist verbraucht');
  // den Rest der Truppe absetzen und schneller laufen lassen
  await page.evaluate(sz => { const r = VK.app.r; let k = 0; for (const typ of ['schild', 'axt', 'bogen']) while (r.vorrat[typ] > 0) VK.absetzenWelt(typ, -5 + (k++ % 9) * 1.2, sz + (typ === 'bogen' ? 1.2 : -0.6)); VK.app.tempo = 4; }, SZ);
  ok((await info(page)).eigene === 13 && (await page.$$('.kk:disabled')).length === 4, 'alle 13 Krieger stehen auf dem Feld, alle Karten sind leer');
  ok(await warte(page, () => VK.info().zeit > 7, null, 90000), 'die Krieger laufen los');
  await bild(page, '3-anmarsch');
  await page.click('#schrei', { force: true });
  i = await info(page);
  ok(i.schreiAktiv && !i.schreiMoeglich && await page.textContent('#banner') === 'Kriegsschrei!', 'Kriegsschrei ausgelöst');
  ok(await warte(page, () => getComputedStyle(document.getElementById('schrei')).display === 'none', null, 10000), 'der Knopf verschwindet, den Schrei gibt es nur einmal');
  await bild(page, '4-kriegsschrei');
  ok(await warte(page, () => VK.info().bauten.some(b => b.leben < b.max), null, 120000), 'die Krieger beschädigen ein Gebäude');
  ok(await warte(page, () => VK.info().bauten.some(b => b.zerstoert), null, 180000) && (await info(page)).prozent > 0, 'ein Gebäude stürzt ein, die Zerstörung zählt hoch');
  await bild(page, '5-kampf');

  console.log('Beenden und nochmal');
  await page.click('#aufgeben');
  ok(await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 20000), 'Beenden zeigt das Ergebnis');
  i = await info(page);
  ok(i.fertig && i.grund === 'aufgegeben' && !i.läuft && !(await page.isVisible('#karten')), 'der Raubzug ist beendet, die Karten sind weg');
  ok(/zerstört/.test(await page.textContent('#ergText')) && (await page.textContent('#ergRunen')).length === 3, 'Ergebnis nennt Zerstörung und Runen');
  await page.click('#nochmal');
  i = await info(page);
  ok(i.läuft && !i.fertig && i.eigene === 0 && i.vorrat.axt === 6 && i.prozent === 0 && !(await page.isVisible('#ergebnis')), '„Nochmal“ beginnt einen frischen Raubzug');
  ohneFehler(page, 'keine Fehler bis hierher');
  await page.context().close();

  console.log('Ganzer Raubzug (Computer spielt, 8-fach beschleunigt)');
  page = await neu('seed=5&auto&tempo=8&start', undefined, 2);
  ok(await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 300000), 'der Raubzug endet mit einem Ergebnis');
  i = await info(page);
  console.log(`    ${i.runen} Runen, ${i.prozent} % zerstört, ${Math.round(i.zeit)} s, ${i.eigene} von 13 überleben, Grund: ${i.grund}`);
  ok(i.fertig && i.runen >= 2 && i.prozent >= 50, 'der kluge Computer-Plan holt mindestens zwei Runen');
  ok(Object.values(i.beute).some(v => v > 0) && (await page.$$('#ergBeute span')).length > 0, 'Beute aus den Vorratshäusern wird angezeigt');
  // Grundlage für später (Server rechnet nach, Kampfbericht): der Kampf im Handy ist allein aus den Eingaben nachrechenbar
  const gleich = await page.evaluate(async () => { const m = await import(new URL('js/sim.js', location.href).href), r = VK.app.r;
    return m.Raubzug.wiederhole(VK.app.seed, m.beispielDorf(), m.TRUPPE, r.eingaben).abdruck() === r.abdruck(); });
  ok(gleich, 'der im Handy gespielte Kampf lässt sich aus der Aufzeichnung exakt nachrechnen');
  await page.waitForTimeout(400); await bild(page, '6-ergebnis');
  ohneFehler(page, 'keine Fehler im ganzen Raubzug');
  await page.context().close();

  console.log('Planloses Absetzen');
  page = await neu('seed=5&auto=plump&tempo=8&start');
  ok(await warte(page, () => VK.info().fertig, null, 300000), 'auch dieser Raubzug endet');
  i = await info(page); console.log(`    ${i.runen} Runen, ${i.prozent} % zerstört, ${Math.round(i.zeit)} s, Grund: ${i.grund}`);
  ohneFehler(page, 'keine Fehler');
  await page.context().close();

  console.log('Andere Handy-Größen');
  for (const g of [{ width: 360, height: 640 }, { width: 430, height: 932 }, { width: 390, height: 780 }]) {
    page = await neu('seed=5&start', g);
    const e = await page.evaluate(() => { const K = VK.K, hx = K.BREITE / 2, hz = K.TIEFE / 2, ecken = [[-hx, -hz], [hx, -hz], [-hx, hz], [hx, hz]].map(([x, z]) => VK.weltZuBild(x, z));
      const karten = document.getElementById('karten').getBoundingClientRect(), oben = document.getElementById('oben').getBoundingClientRect();
      return { ecken, kartenOben: karten.top, anzeigeUnten: oben.bottom, w: innerWidth, h: innerHeight, strandOben: VK.weltZuBild(0, hz - K.STRAND).y }; });
    ok(e.ecken.every(p => p.x >= 0 && p.x <= e.w) && e.ecken[0].y >= e.anzeigeUnten - 2 && e.ecken[2].y <= e.kartenOben + 2,
      `${g.width}×${g.height}: das ganze Feld liegt zwischen Anzeige und Karten`);
    ok(e.kartenOben - e.strandOben > 60, `${g.width}×${g.height}: der Strand ist groß genug zum Tippen (${Math.round(e.kartenOben - e.strandOben)} Pixel hoch)`);
    if (g.width !== 390) await bild(page, `7-groesse-${g.width}x${g.height}`);
    await page.context().close();
  }

  console.log('Grafik-Stufen und fehlende Figuren');
  page = await neu('seed=5&grafik=sparsam&auto&tempo=6&start');
  ok(await page.evaluate(() => VK.grafik.stufe === 'sparsam') && await warte(page, () => VK.info().zeit > 12, null, 120000), 'sparsame Stufe läuft');
  ohneFehler(page, 'keine Fehler in der sparsamen Stufe');
  await page.context().close();
  page = await neu('seed=5&grafik=auto&auto&tempo=2&start');
  ok(await warte(page, () => { try { return localStorage.getItem('vk_grafikAuto') !== null; } catch (e) { return false; } }, null, 120000), 'Auto-Stufe misst im ersten Kampf und merkt sich das Ergebnis');
  console.log('    gemessen: ' + await page.evaluate(() => localStorage.getItem('vk_grafikAuto')) + ' (ohne Grafikkarte ist „sparsam“ zu erwarten)');
  await page.context().close();
  page = await neu('seed=5&ohne=modelle&auto&tempo=6&start');
  ok((await page.evaluate(() => VK.fehlend.length)) > 0 && await warte(page, () => VK.info().bauten.some(b => b.leben < b.max), null, 180000), 'ohne Figuren-Dateien geht es mit Ersatzfiguren weiter');
  await bild(page, '8-ersatzfiguren'); ohneFehler(page, 'keine Fehler mit Ersatzfiguren');
  await page.context().close();

  await browser.close();
  console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles grün');
  process.exit(fehler ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
