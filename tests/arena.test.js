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
    await page.goto(URL + '?' + query + (/grafik=/.test(query) ? '' : '&grafik=hoch')); await page.waitForFunction('window.AR && AR.bereit', null, { timeout: 90000 }); return page; };
  const info = page => page.evaluate(() => AR.info());
  const warte = (page, f, arg, ms = 60000) => page.waitForFunction(f, arg, { timeout: ms }).then(() => true).catch(() => false);
  const bild = (page, name) => page.screenshot({ path: path.join(SHOTS, name + '.png'), timeout: 90000 });

  console.log('Start');
  let page = await neu('neu');
  ok(page.fehler.length === 0, 'keine Fehler beim Laden' + (page.fehler.length ? ': ' + page.fehler[0] : ''));
  ok((await page.evaluate(() => AR.fehlend.length)) === 0, 'alle Figuren geladen');
  ok(await page.isVisible('#dorf') && (await page.$$('.platz')).length === 5 && await page.isEnabled('#zuMissionen'), 'Dorf mit fünf Bauplätzen und Missionen-Knopf erscheint');
  ok(await page.evaluate(() => { const b = document.getElementById('dorfBild'); return b.complete && b.naturalWidth > 0; }), 'Dorf-Bild geladen');
  await page.click('#zuMissionen');
  ok(await page.isVisible('#missionen') && await page.isEnabled('[data-mission="0"]') && !(await page.isEnabled('[data-mission="1"]')), 'Missionsliste: nur die erste ist offen');
  ok(!(await page.isEnabled('[data-char=maedchen]')), 'am Anfang gibt es nur den Jungen');
  await page.click('[data-mission="0"]');
  ok((await info(page)).läuft && (await info(page)).modus === 'duell' && await page.evaluate(() => AR.app.mission === 0), 'Mission 1 startet als Duell');
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

  console.log('Dorf: bauen');
  page = await neu('neu');
  await page.evaluate(() => { Object.assign(AR.dorf.roh, { holz: 45, stein: 15, gold: 0, zutaten: 0 }); AR.zeigeDorf(); });
  ok(await page.evaluate(() => document.querySelector('[data-bau=training]').classList.contains('kann')), 'Bauplatz leuchtet, wenn genug Rohstoffe da sind');
  await page.click('[data-bau=training]'); ok(await page.isVisible('#bau') && await page.isEnabled('#bauLos'), 'Bau-Fenster zeigt Kosten und Bauen-Knopf');
  await page.click('#bauLos');
  ok(await page.evaluate(() => AR.dorf.bau.training === 1 && AR.dorf.roh.holz === 15 && AR.dorf.roh.stein === 5), 'Trainingsplatz gebaut, Rohstoffe abgezogen');
  ok(!(await page.isEnabled('#bauLos')), 'Ausbau gesperrt, solange Rohstoffe fehlen');
  await page.click('#bauZu'); await page.click('[data-bau=taverne]');
  ok(await page.isHidden('#bauLos'), 'Taverne ist als „kommt später“ markiert');
  await page.click('#bauZu');
  await page.evaluate(() => AR.starte({ modus: 'duell', spieler: 'junge', bonus: { leben: 8, schaden: 1, energie: 1 } }));
  ok((await info(page)).ich.leben === 108, 'Trainingsplatz gibt im Kampf mehr Leben');
  await page.context().close();

  console.log('Missionen durchspielen (Computer spielt, beschleunigt)');
  page = await neu('neu&auto&tempo=6');
  await page.evaluate(() => AR.starte({ modus: 'duell', gegner: 'ritter', stufe: 1, spielerStufe: 9, seed: 11 }, 0));
  ok(await warte(page, () => AR.info().phase === 'over', null, 240000), 'Mission 1 läuft bis zum Ende');
  ok((await info(page)).gewonnen === true && await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 10000), 'Sieg, Ergebnis erscheint');
  ok(await page.evaluate(() => { const f = AR.app.match.kampf.k[0]; return f.zustand === 'frei' && f.mx === 0 && f.mz === 0 && f.spezial === 0; }), 'nach dem Sieg steht der Sieger ruhig (läuft nicht, nicht mehr verwandelt)');
  ok(await page.evaluate(() => AR.dorf.geschafft.includes(0) && AR.dorf.roh.holz === 40 && AR.dorf.roh.stein === 20), 'Belohnung kommt im Dorf an');
  await page.evaluate(() => AR.starte({ modus: 'duell', gegner: 'maedchen', stufe: 2, spielerStufe: 9, seed: 12 }, 1));
  await warte(page, () => AR.info().phase === 'over', null, 240000); await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 10000);
  ok(await page.evaluate(() => AR.dorf.figuren.includes('maedchen')) && (await page.textContent('#ergNeu')).includes('schließt sich dir an'), 'nach Mission 2 schließt sich das Mädchen an');
  await page.click('#zumMenü'); ok(await page.isVisible('#dorf'), 'zurück ins Dorf');
  await page.goto(URL); await page.waitForFunction('window.AR && AR.bereit', null, { timeout: 90000 });
  ok(await page.evaluate(() => AR.dorf.geschafft.length === 2 && AR.dorf.roh.holz === 40 && AR.dorf.figuren.includes('maedchen')), 'Fortschritt bleibt nach dem Neuladen erhalten');
  await page.click('#zuMissionen'); ok(await page.isEnabled('[data-char=maedchen]') && await page.isEnabled('[data-mission="2"]'), 'Mädchen wählbar, Mission 3 offen');
  await page.context().close();
  page = await neu('neu&start&auto&tempo=6&modus=wellen&stufe=3&spielerStufe=9&seed=104');
  ok(await warte(page, () => AR.info().phase === 'over', null, 300000), 'Wellen-Lauf läuft bis zum Ende');
  const w = await info(page); ok(w.gewonnen !== null, `Wellen-Ergebnis steht fest (${w.gewonnen ? 'gewonnen' : 'verloren in Welle ' + (w.welle + 1)})`);
  await page.context().close();

  console.log('Grafik-Stufen');
  page = await neu('neu&start&auto&grafik=auto');
  ok(await page.evaluate(() => AR.grafik.stufe === 'hoch' && AR.grafik.wahl === 'auto'), 'Start mit Grafik „automatisch (hoch)“');
  ok(await warte(page, () => AR.grafik.mess.fertig, null, 120000) && await page.evaluate(() => AR.grafik.stufe === 'sparsam'), 'ohne Grafikkarte (wenige Bilder/s) schaltet das Spiel selbst auf „sparsam“');
  ok(await page.evaluate(() => [...document.querySelectorAll('canvas')][0].width <= innerWidth * 1.25 + 1), 'sparsam: Bildschärfe höchstens 1,25-fach');
  await page.evaluate(() => AR.zeigeDorf()); await page.click('#sGrafik');
  ok(await page.evaluate(() => AR.grafik.wahl === 'hoch' && AR.grafik.stufe === 'hoch') && (await page.textContent('#sGrafik')).includes('hoch'), 'Schalter im Dorf stellt auf „hoch“');
  await page.context().close();

  console.log('Fehlende Modelle');
  page = await neu('neu&start&ohne=modelle');
  ok((await page.evaluate(() => AR.fehlend.length)) > 0 && (await info(page)).läuft && page.fehler.length === 0, 'Spiel startet mit Ersatzfiguren');
  await page.context().close();

  console.log('Bilder in doppelter Auflösung (bitte ansehen: tests/screenshots/)');
  page = await neu('neu', 2);
  await page.evaluate(() => { Object.assign(AR.dorf.roh, { holz: 120, stein: 85, gold: 30, zutaten: 25 }); AR.dorf.bau.training = 1; AR.dorf.bau.schmiede = 2; AR.dorf.geschafft.push(0, 1, 2); AR.dorf.figuren.push('maedchen'); AR.zeigeDorf(); });
  await page.waitForTimeout(300); await bild(page, '1-dorf');
  await page.click('[data-bau=kueche]'); await page.waitForTimeout(200); await bild(page, '1b-bauen'); await page.click('#bauZu');
  await page.click('#zuMissionen'); await page.waitForTimeout(200); await bild(page, '1c-missionen');
  await page.click('[data-mission="0"]'); await warte(page, () => AR.info().phase === 'play'); await page.waitForTimeout(700); await bild(page, '2-kampf');
  await page.context().close();
  page = await neu('neu&start&auto&modus=duell&stufe=5&spielerStufe=6&seed=3', 2);
  await warte(page, () => AR.info().gegner[0].zustand === 'taumel', null, 90000); await bild(page, '3-treffer');
  await warte(page, () => AR.info().ich.spezial > 0, null, 120000); await page.waitForTimeout(500); await bild(page, '4-steinriese');
  await page.context().close();
  page = await neu('neu&start&auto&modus=wellen&stufe=3&spielerStufe=8&seed=104', 2);
  await warte(page, () => AR.info().phase === 'play' && AR.info().zeit > 1.2, null, 90000); await bild(page, '5-wellen');
  await page.context().close();
  page = await neu('neu&auto&tempo=6', 2); await page.evaluate(() => AR.starte({ modus: 'duell', gegner: 'ritter', stufe: 1, spielerStufe: 9, seed: 11 }, 0));
  await warte(page, () => document.getElementById('ergebnis').classList.contains('an'), null, 240000); await page.waitForTimeout(400); await bild(page, '6-ergebnis');
  await browser.close();
  console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles grün');
  process.exit(fehler ? 1 : 0);
})();
