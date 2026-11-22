// Prüft die Kampf-Simulation ohne Browser: Wiederholbarkeit, Bot-Stufen, Rundendauer, Wellen.
// Aufruf: node tests/sim.test.js
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = html.indexOf('/* SIM-START */'), b = html.indexOf('/* SIM-END */');
if (a < 0 || b < 0) { console.error('SIM-Marker fehlen'); process.exit(1); }
const code = html.slice(a, b);
for (const verboten of ['Math.random', 'Date', 'document', 'window']) if (new RegExp('\\b' + verboten.replace('.', '\\.') + '\\b').test(code)) { console.error('Im SIM-Block verboten: ' + verboten); process.exit(1); }
const { K, TYPEN, WELLEN, Kampf, Bot, Match } = new Function(code + '; return { K, TYPEN, WELLEN, Kampf, Bot, Match };')();
let fehler = 0; const ok = (bed, text) => { console.log((bed ? '  ✓ ' : '  ✗ ') + text); if (!bed) fehler++; };

function duell(stufeA, stufeB, seed, typA = 'junge', typB = 'ritter') { // eine Runde Bot gegen Bot
  const k = new Kampf(seed, [{ typ: typA, team: 0 }, { typ: typB, team: 1 }]), bots = [new Bot(stufeA, seed + 1), new Bot(stufeB, seed + 2)];
  let n = 0, ungültig = false; while (!k.fertig && n++ < 60 * 70) { bots.forEach((bt, i) => bt.denke(k, i)); k.step(); for (const f of k.k) if (![f.x, f.z, f.r, f.leben].every(Number.isFinite)) ungültig = true; }
  return { sieger: k.sieger, zeit: k.zeit, ungültig, prüf: k.k.map(f => [f.x.toFixed(5), f.z.toFixed(5), f.leben].join()).join('|'), aussen: k.k.some(f => Math.hypot(f.x, f.z) > K.ARENA_R) };
}
function reihe(a, b, n, typA, typB) { let sa = 0, sb = 0, zeit = 0, bad = 0; for (let i = 0; i < n; i++) { const r = duell(a, b, 1000 + i * 17, typA, typB); if (r.sieger === 0) sa++; else if (r.sieger === 1) sb++; zeit += r.zeit; if (r.ungültig || r.aussen) bad++; }
  return { quote: sa / Math.max(1, sa + sb), zeit: zeit / n, bad, unentschieden: n - sa - sb }; }

console.log('Wiederholbarkeit');
ok(duell(5, 5, 42).prüf === duell(5, 5, 42).prüf, 'gleicher Seed ⇒ gleicher Kampf');
ok(duell(5, 5, 42).prüf !== duell(5, 5, 43).prüf, 'anderer Seed ⇒ anderer Kampf');

console.log('Bot-Stufen (je 200 Runden, gleiche Figur auf beiden Seiten)');
const N = 200, r10_1 = reihe(10, 1, N, 'junge', 'junge'), r5_1 = reihe(5, 1, N, 'junge', 'junge'), r10_5 = reihe(10, 5, N, 'junge', 'junge'), r5_5 = reihe(5, 5, N, 'junge', 'junge');
const pz = q => Math.round(q * 100) + ' %';
console.log(`  Stufe 10 schlägt Stufe 1: ${pz(r10_1.quote)}, Dauer ${r10_1.zeit.toFixed(0)} s`);
console.log(`  Stufe 5 schlägt Stufe 1:  ${pz(r5_1.quote)}, Dauer ${r5_1.zeit.toFixed(0)} s`);
console.log(`  Stufe 10 schlägt Stufe 5: ${pz(r10_5.quote)}, Dauer ${r10_5.zeit.toFixed(0)} s`);
console.log(`  Stufe 5 gegen Stufe 5:    ${pz(r5_5.quote)}, Dauer ${r5_5.zeit.toFixed(0)} s, unentschieden ${r5_5.unentschieden}`);
ok(r10_1.quote > 0.85, 'Stufe 10 schlägt Stufe 1 deutlich');
ok(r5_1.quote > 0.65 && r5_1.quote < r10_1.quote + 0.05, 'Stufe 5 liegt dazwischen');
ok(r10_5.quote > 0.55, 'Stufe 10 schlägt Stufe 5 meistens');
ok(r5_5.quote > 0.35 && r5_5.quote < 0.65, 'gleiche Stufe ist ausgeglichen');
ok(r10_1.bad + r5_1.bad + r10_5.bad + r5_5.bad === 0, 'keine ungültigen Werte, niemand verlässt die Arena');
ok(r5_5.zeit > 8 && r5_5.zeit < 55, 'Rundendauer bei gleicher Stufe liegt im sinnvollen Bereich');

console.log('Figuren gegeneinander (Stufe 5, je 200 Runden)');
const jr = reihe(5, 5, N, 'junge', 'ritter'), mr = reihe(5, 5, N, 'maedchen', 'ritter'), jm = reihe(5, 5, N, 'junge', 'maedchen');
console.log(`  Junge gegen Rabenritter: ${pz(jr.quote)} · Mädchen gegen Rabenritter: ${pz(mr.quote)} · Junge gegen Mädchen: ${pz(jm.quote)}`);
ok(jr.quote > 0.3 && jr.quote < 0.7 && mr.quote > 0.3 && mr.quote < 0.7 && jm.quote > 0.3 && jm.quote < 0.7, 'keine Figur ist klar über- oder unterlegen');

console.log('Ganzes Duell und Wellen');
function lauf(opt) { const m = new Match({ mensch: false, ...opt }); let n = 0; while (m.phase !== 'over' && n++ < 60 * 900) m.tick(); return m; }
const d = lauf({ modus: 'duell', stufe: 3, spielerStufe: 8, seed: 5 });
ok(d.phase === 'over' && d.gewonnen !== null && Math.max(...d.punkte) === K.SIEGE, `Duell endet mit Ergebnis (${d.punkte.join(':')})`);
let gew = 0, ende = 0; const M = 60; for (let i = 0; i < M; i++) { const w = lauf({ modus: 'wellen', stufe: 3, spielerStufe: 7, seed: 100 + i }); if (w.phase === 'over') ende++; if (w.gewonnen) gew++; }
let gewS = 0; for (let i = 0; i < M; i++) if (lauf({ modus: 'wellen', stufe: 3, spielerStufe: 2, seed: 300 + i }).gewonnen) gewS++;
console.log(`  Wellen gegen Stufe 3: ein guter Spieler (Bot Stufe 7) schafft ${pz(gew / M)}, ein schwacher (Bot Stufe 2) ${pz(gewS / M)}`);
ok(ende === M, 'jeder Wellen-Lauf endet');
ok(gew / M > 0.4 && gewS < gew, 'Wellen sind für gute Spieler schaffbar und für schwache schwerer');

console.log(fehler ? `\n${fehler} Prüfung(en) fehlgeschlagen` : '\nAlles grün');
process.exit(fehler ? 1 : 0);
