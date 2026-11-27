// Prüft die Regeln des Raubzugs ohne Browser.
// Aufruf im Repo-Ordner:  node vikings/tests/sim.test.mjs
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Raubzug, botEingaben, beispielDorf, amStrand, TRUPPE, KARTEN, EINHEITEN, BAUTEN, K, DT } from '../js/sim.js';

let fehler = 0;
const ok = (bed, text) => { console.log((bed ? '  ✓ ' : '  ✗ ') + text); if (!bed) fehler++; };
const pz = q => Math.round(q * 100) + ' %';

console.log('Regeln bleiben reine Rechnung');
const code = fs.readFileSync(fileURLToPath(new URL('../js/sim.js', import.meta.url)), 'utf8').replace(/\/\/.*$/gm, '');
for (const verboten of ['Math.random', 'Date', 'document', 'window', 'performance'])
  ok(!new RegExp('\\b' + verboten.replace('.', '\\.') + '\\b').test(code), `kein ${verboten} in sim.js`);

console.log('Wiederholbarkeit');
const klug = botEingaben('klug');
const a = Raubzug.wiederhole(7, beispielDorf(), TRUPPE, klug), b = Raubzug.wiederhole(7, beispielDorf(), TRUPPE, klug);
ok(a.abdruck() === b.abdruck(), 'gleiche Startzahl und gleiche Eingaben ergeben denselben Kampf');
ok(a.abdruck() !== Raubzug.wiederhole(8, beispielDorf(), TRUPPE, klug).abdruck(), 'andere Startzahl ergibt einen anderen Kampf');
// Ein Kampf, der Schritt für Schritt gespielt wurde, lässt sich aus seinen aufgezeichneten Eingaben nachrechnen
const live = new Raubzug(21); let i = 0; const plan = [...klug].sort((x, y) => x.tick - y.tick);
while (!live.fertig) { while (i < plan.length && plan[i].tick <= live.tick) { const e = plan[i++]; if (e.art === 'setze') live.setze(e.typ, e.x, e.z); else live.schreie(); } live.step(); }
ok(Raubzug.wiederhole(21, beispielDorf(), TRUPPE, live.eingaben).abdruck() === live.abdruck(), 'ein gespielter Kampf lässt sich aus der Aufzeichnung exakt nachrechnen');

console.log('Absetzen');
const r = new Raubzug(1);
const sz = K.TIEFE / 2 - K.STRAND / 2;      // Mitte des Strands
ok(amStrand(0, sz) && !amStrand(0, 0) && !amStrand(0, K.TIEFE / 2 + 0.2) && !amStrand(K.BREITE / 2 + 1, sz), 'absetzen geht nur auf dem Strand');
ok(r.setze('axt', 0, 0) === null && r.figuren.filter(f => f.team === 0).length === 0, 'im Dorf lässt sich niemand absetzen');
ok(r.setze('axt', 0, sz) !== null && r.vorrat.axt === TRUPPE.axt - 1, 'am Strand schon, die Karte zählt herunter');
ok(r.setze('anfuehrer', 1, sz) !== null && r.setze('anfuehrer', 2, sz) === null, 'den Anführer gibt es nur einmal');
ok(!new Raubzug(1).schreiMoeglich() && r.schreiMoeglich() && r.schreie() && !r.schreiMoeglich(), 'Kriegsschrei nur mit Anführer auf dem Feld und nur einmal');

console.log('Verlauf');
const leer = Raubzug.wiederhole(3, beispielDorf(), TRUPPE, []);
ok(leer.fertig && leer.grund === 'Zeit um' && leer.runen() === 0 && Math.abs(leer.zeit - K.ZEIT) < 0.1, 'ohne Krieger endet der Raubzug nach der Zeit mit 0 Runen');
const einer = Raubzug.wiederhole(3, beispielDorf(), { axt: 1 }, [{ tick: 5, art: 'setze', typ: 'axt', x: 0, z: sz }]);
ok(einer.grund === 'alle gefallen' && einer.runen() === 0, 'ein einzelner Axtkämpfer fällt, der Raubzug endet');
let schlecht = false; const p = new Raubzug(5); let j = 0;
while (!p.fertig) { while (j < plan.length && plan[j].tick <= p.tick) { const e = plan[j++]; if (e.art === 'setze') p.setze(e.typ, e.x, e.z); else p.schreie(); } p.step();
  for (const f of p.figuren) if (![f.x, f.z, f.r, f.leben].every(Number.isFinite) || Math.abs(f.x) > K.BREITE / 2 || Math.abs(f.z) > K.TIEFE / 2) schlecht = true;
  for (const f of p.figuren) if (f.zustand !== 'tot') for (const g of p.bauten) if (!g.zerstoert && Math.hypot(f.x - g.x, f.z - g.z) < g.radius + f.radius - 0.05) schlecht = true; }
ok(!schlecht, 'keine ungültigen Werte, niemand verlässt das Feld oder steht in einem Gebäude');

console.log('Schwierigkeit des Beispiel-Dorfs (je 20 Raubzüge)');
function reihe(eingaben, n = 20) { let runen = 0, proz = 0, zeit = 0, leb = 0, voll = 0;
  for (let s = 1; s <= n; s++) { const x = Raubzug.wiederhole(100 + s, beispielDorf(), TRUPPE, eingaben); runen += x.runen(); proz += x.prozent(); zeit += x.zeit; leb += x.eigene().length; if (x.runen() === 3) voll++; }
  return { runen: runen / n, proz: proz / n, zeit: zeit / n, leb: leb / n, voll: voll / n }; }
const zeig = (name, x) => console.log(`  ${name}: ${x.runen.toFixed(1)} Runen, ${x.proz.toFixed(0)} % zerstört, ${x.zeit.toFixed(0)} s, ${x.leb.toFixed(1)} von 13 überleben, alles zerstört in ${pz(x.voll)}`);
const gut = reihe(klug), ohneSchrei = reihe(klug.filter(e => e.art !== 'schrei')), plump = reihe(botEingaben('plump'));
zeig('kluger Plan mit Kriegsschrei ', gut); zeig('kluger Plan ohne Kriegsschrei', ohneSchrei); zeig('alle auf einmal in einer Ecke', plump);
ok(gut.runen >= 2.5 && gut.zeit > 45, 'mit einem klugen Plan ist das Dorf zu schaffen, aber nicht in Sekunden');
ok(gut.leb < 10, 'auch ein kluger Plan kostet Krieger');
ok(gut.proz > ohneSchrei.proz + 5 || gut.zeit < ohneSchrei.zeit - 5, 'der Kriegsschrei hilft messbar');
ok(plump.runen < gut.runen - 0.7 && plump.proz < gut.proz - 10, 'planloses Absetzen ist deutlich schlechter');

console.log('Angaben stimmen');
ok(KARTEN.every(k => EINHEITEN[k] && TRUPPE[k] > 0) && Object.values(BAUTEN).every(t => t.leben > 0 && t.radius > 0), 'jede Karte hat Werte, jedes Gebäude hat Leben');
ok(Math.abs(1 / DT - 30) < 1e-9, '30 Rechenschritte je Sekunde');

console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles grün');
process.exit(fehler ? 1 : 0);
