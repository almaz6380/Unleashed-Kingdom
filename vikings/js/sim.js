// Vikings – Regeln des Raubzugs.
// Reine Rechnung: kein Bild, keine Uhrzeit, Zufall nur aus der Startzahl. Gleiche Startzahl und gleiche Eingaben
// ergeben immer denselben Kampf (tests/sim.test.mjs prüft das). Darauf bauen später Kampfberichte und die Prüfung
// auf dem Server auf. In dieser Datei deshalb kein Math.random, kein Date, kein document, kein window.

export const DT = 1 / 30;            // fester Zeitschritt in Sekunden

// Alle Stellschrauben an einer Stelle
export const K = {
  BREITE: 18, TIEFE: 32,             // Feld in Metern: x von −9 bis 9, z von −16 (hinten, Dorf) bis 16 (vorn, Wasser)
  STRAND: 5.5,                       // so tief ist der Strand am vorderen Rand; nur dort darf man Krieger absetzen
  ZEIT: 120,                         // Dauer eines Raubzugs in Sekunden
  SICHT: 5,                          // eigene Krieger greifen Wachen in diesem Umkreis zuerst an
  WACH_SICHT: 6.5, WACH_LEINE: 9,    // Wachen greifen an, was so nah kommt, und bleiben so nah an ihrem Posten
  SCHREI_RADIUS: 7, SCHREI_DAUER: 6, SCHREI_FAKTOR: 1.5,
  PFEIL_TEMPO: 16,                   // Meter je Sekunde
  SCHLAG_VERZUG: 0.25,               // so lange nach dem Ausholen sitzt ein Nahkampf-Treffer
  STREUUNG: 0.1,                     // Schaden schwankt um ±10 %
  NEU_ZIELEN: 10,                    // alle so viele Schritte sucht sich jeder ein neues Ziel
};

// Krieger. takt = Sekunden zwischen zwei Schlägen, reichweite = Abstand bis zum Rand des Ziels
export const EINHEITEN = {
  schild:    { name: 'Schildträger', bild: '🛡️', leben: 190, tempo: 2.5, schaden: 7,  takt: 1.0, reichweite: 0.9, radius: 0.45 },
  axt:       { name: 'Axtkämpfer',   bild: '🪓', leben: 70,  tempo: 3.1, schaden: 14, takt: 0.9, reichweite: 0.9, radius: 0.4 },
  anfuehrer: { name: 'Anführer',     bild: '👑', leben: 260, tempo: 3.2, schaden: 30, takt: 0.8, reichweite: 1.1, radius: 0.5, schrei: true },
  bogen:     { name: 'Bogenschütze', bild: '🏹', leben: 36,  tempo: 3.0, schaden: 10, takt: 1.1, reichweite: 6.0, radius: 0.35, fern: true },
  wache:     { name: 'Dorfwache',    bild: '⚔️', leben: 90,  tempo: 2.8, schaden: 12, takt: 1.0, reichweite: 0.9, radius: 0.4 },
};
// Reihenfolge der Karten und Truppe im Probekampf
export const KARTEN = ['schild', 'axt', 'anfuehrer', 'bogen'];
export const TRUPPE = { schild: 2, axt: 6, anfuehrer: 1, bogen: 4 };

// Gebäude. Türme schießen auf den nächsten Angreifer.
export const BAUTEN = {
  langhaus: { name: 'Langhaus',    leben: 2640, radius: 2.0, haupt: true, beute: { silber: 40 } },
  vorrat:   { name: 'Vorratshaus', leben: 1100, radius: 1.3, beute: { holz: 60, eisen: 30 } },
  huette:   { name: 'Hütte',       leben: 715,  radius: 1.1 },
  turm:     { name: 'Wachturm',    leben: 935,  radius: 0.9, schaden: 11, takt: 0.8, reichweite: 8 },
};
export const BEUTE = ['holz', 'eisen', 'silber'];

export function beispielDorf() {
  return {
    bauten: [
      { typ: 'langhaus', x: 0, z: -10.5 },
      { typ: 'vorrat', x: -5.2, z: -6.5 }, { typ: 'vorrat', x: 5.2, z: -7.5 },
      { typ: 'huette', x: -5.4, z: 2.0 }, { typ: 'huette', x: 5.2, z: 1.2 }, { typ: 'huette', x: 0.3, z: -1.6 },
      { typ: 'turm', x: -2.4, z: -5.6 }, { typ: 'turm', x: 3.2, z: -2.4 },
    ],
    wachen: [{ x: -1.6, z: -7.6 }, { x: 1.6, z: -7.6 }, { x: 0, z: -6.2 }, { x: 4.4, z: -0.8 }, { x: -4.4, z: 0 }],
  };
}

export function mulberry32(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}

// Darf man hier absetzen? Nur auf dem Strand am vorderen Rand.
export function amStrand(x, z) {
  return Math.abs(x) <= K.BREITE / 2 - 0.4 && z >= K.TIEFE / 2 - K.STRAND && z <= K.TIEFE / 2 - 0.3;
}

export class Raubzug {
  constructor(seed = 1, dorf = beispielDorf(), truppe = TRUPPE) {
    this.seed = seed; this.rnd = mulberry32(seed);
    this.tick = 0; this.zeit = 0; this.fertig = false; this.grund = '';
    this.vorrat = { ...truppe };                      // noch nicht abgesetzte Krieger
    this.figuren = []; this.naechsteId = 0;
    this.offen = [];                                  // Treffer, die noch unterwegs sind (Pfeile, ausgeholte Schläge)
    this.ereignisse = [];                             // was in diesem Schritt passiert ist, für Bild und Ton
    this.eingaben = [];                               // alles, was der Spieler getan hat, mit Zeitpunkt
    this.schrei = { frei: true, bis: 0 };
    this.beute = Object.fromEntries(BEUTE.map(b => [b, 0]));
    this.bauten = dorf.bauten.map((b, i) => { const t = BAUTEN[b.typ];
      return { i, typ: b.typ, x: b.x, z: b.z, radius: t.radius, leben: t.leben, maxLeben: t.leben, zerstoert: false, takt: 0.5 + i * 0.13 }; });
    for (const w of dorf.wachen) this.neueFigur('wache', 1, w.x, w.z, { posten: { x: w.x, z: w.z }, r: 0 });
  }

  neueFigur(typ, team, x, z, mehr = {}) {
    const t = EINHEITEN[typ];
    const f = { id: this.naechsteId++, typ, team, x, z, r: team === 0 ? Math.PI : 0, radius: t.radius, leben: t.leben, maxLeben: t.leben,
      zustand: 'steh', takt: 0.2, ziel: null, schreiBis: 0, schlagNr: 0, ...mehr };
    this.figuren.push(f); return f;
  }

  // ---------- Eingaben des Spielers ----------
  setze(typ, x, z) {
    if (this.fertig || !(this.vorrat[typ] > 0) || !amStrand(x, z)) return null;
    this.vorrat[typ]--; this.eingaben.push({ tick: this.tick, art: 'setze', typ, x, z });
    const f = this.neueFigur(typ, 0, x, z); this.ereignisse.push({ art: 'gesetzt', id: f.id, typ, x, z }); return f;
  }
  anfuehrer() { return this.figuren.find(f => f.typ === 'anfuehrer' && f.team === 0 && f.zustand !== 'tot') ?? null; }
  schreiMoeglich() { return !this.fertig && this.schrei.frei && !!this.anfuehrer(); }
  schreie() {
    if (!this.schreiMoeglich()) return false;
    const a = this.anfuehrer(); this.schrei.frei = false; this.schrei.bis = this.zeit + K.SCHREI_DAUER;
    this.eingaben.push({ tick: this.tick, art: 'schrei' });
    for (const f of this.figuren) if (f.team === 0 && f.zustand !== 'tot' && Math.hypot(f.x - a.x, f.z - a.z) <= K.SCHREI_RADIUS) f.schreiBis = this.schrei.bis;
    this.ereignisse.push({ art: 'schrei', x: a.x, z: a.z }); return true;
  }
  gibAuf() { if (this.fertig) return; this.eingaben.push({ tick: this.tick, art: 'ende' }); this.beende('aufgegeben'); }

  // ---------- Auskunft ----------
  eigene() { return this.figuren.filter(f => f.team === 0 && f.zustand !== 'tot'); }
  rest() { return KARTEN.reduce((s, k) => s + (this.vorrat[k] ?? 0), 0); }
  prozent() { let weg = 0, alle = 0; for (const b of this.bauten) { alle += b.maxLeben; if (b.zerstoert) weg += b.maxLeben; } return Math.floor(100 * weg / alle); }
  runen() { const p = this.prozent(), haupt = this.bauten.some(b => BAUTEN[b.typ].haupt && b.zerstoert); return (p >= 50 ? 1 : 0) + (haupt ? 1 : 0) + (p >= 100 ? 1 : 0); }

  // ---------- ein Zeitschritt ----------
  step() {
    this.ereignisse.length = 0; if (this.fertig) return;
    this.tick++; this.zeit = this.tick * DT;
    // 1. Treffer, die jetzt ankommen
    if (this.offen.length) { const jetzt = this.offen.filter(o => o.tick <= this.tick); this.offen = this.offen.filter(o => o.tick > this.tick); for (const o of jetzt) this.trifft(o); }
    // 2. Krieger und Wachen
    for (const f of this.figuren) if (f.zustand !== 'tot') this.denke(f);
    // 3. Türme
    for (const b of this.bauten) if (!b.zerstoert && BAUTEN[b.typ].schaden) this.turm(b);
    // 4. Niemand steht in einem Gebäude oder in einem anderen, niemand verlässt das Feld
    this.schiebe();
    // 5. Ende?
    if (this.bauten.every(b => b.zerstoert)) this.beende('alles zerstört');
    else if (this.zeit >= K.ZEIT) this.beende('Zeit um');
    else if (this.rest() === 0 && this.eigene().length === 0) this.beende('alle gefallen');
  }

  beende(grund) {
    this.fertig = true; this.grund = grund;
    for (const f of this.figuren) if (f.zustand !== 'tot') { f.zustand = 'steh'; f.ziel = null; }
    this.ereignisse.push({ art: 'ende', grund, runen: this.runen(), prozent: this.prozent() });
  }

  abstand(f, z) { return Math.hypot(z.x - f.x, z.z - f.z) - z.radius - f.radius; }       // bis zum Rand des Ziels
  zielVon(f) { const z = f.ziel; if (!z) return null;
    if (z.bau !== undefined) { const b = this.bauten[z.bau]; return b.zerstoert ? null : b; }
    const g = this.figuren[z.fig]; return g.zustand === 'tot' ? null : g; }

  sucheZiel(f) {
    let best = null, bd = Infinity;
    if (f.team === 0) {
      for (const g of this.figuren) { if (g.team !== 1 || g.zustand === 'tot') continue; const d = this.abstand(f, g); if (d < K.SICHT && d < bd) { bd = d; best = { fig: g.id }; } }
      if (best) return best;
      for (const b of this.bauten) { if (b.zerstoert) continue; const d = this.abstand(f, b); if (d < bd) { bd = d; best = { bau: b.i }; } }
      return best;
    }
    for (const g of this.figuren) { if (g.team !== 0 || g.zustand === 'tot') continue;
      const d = this.abstand(f, g); if (d < K.WACH_SICHT && Math.hypot(g.x - f.posten.x, g.z - f.posten.z) < K.WACH_LEINE && d < bd) { bd = d; best = { fig: g.id }; } }
    return best;
  }

  denke(f) {
    const t = EINHEITEN[f.typ], eilig = f.schreiBis > this.zeit ? K.SCHREI_FAKTOR : 1;
    if (f.takt > 0) f.takt -= DT * eilig;
    if (!this.zielVon(f) || (this.tick + f.id) % K.NEU_ZIELEN === 0) f.ziel = this.sucheZiel(f);
    const z = this.zielVon(f);
    if (!z) { // Wachen gehen zurück auf ihren Posten, eigene Krieger ohne Ziel bleiben stehen
      if (f.posten && Math.hypot(f.posten.x - f.x, f.posten.z - f.z) > 0.3) { f.zustand = 'lauf'; this.laufe(f, f.posten.x, f.posten.z, t.tempo, null); }
      else f.zustand = 'steh';
      return;
    }
    if (this.abstand(f, z) <= t.reichweite) {
      f.zustand = 'kampf'; f.r = Math.atan2(z.x - f.x, z.z - f.z);
      if (f.takt <= 0) { f.takt = t.takt; f.schlagNr++;
        const schaden = Math.round(t.schaden * (1 + (this.rnd() * 2 - 1) * K.STREUUNG)), ziel = f.ziel.bau !== undefined ? { bau: f.ziel.bau } : { fig: f.ziel.fig };
        if (t.fern) { const dauer = Math.hypot(z.x - f.x, z.z - f.z) / K.PFEIL_TEMPO;
          this.offen.push({ tick: this.tick + Math.max(1, Math.round(dauer / DT)), ziel, schaden });
          this.ereignisse.push({ art: 'pfeil', vx: f.x, vz: f.z, vy: 1.2, nx: z.x, nz: z.z, ny: z.maxLeben > 400 ? 1.2 : 0.9, dauer }); }
        else this.offen.push({ tick: this.tick + Math.round(K.SCHLAG_VERZUG / DT), ziel, schaden });
        this.ereignisse.push({ art: 'schlag', id: f.id });
      }
    } else { f.zustand = 'lauf'; this.laufe(f, z.x, z.z, t.tempo * eilig, z); }
  }

  // Auf ein Ziel zulaufen. Steht ein anderes Gebäude im Weg, seitlich daran vorbeigleiten.
  laufe(f, zx, zz, tempo, ziel) {
    let dx = zx - f.x, dz = zz - f.z; const d = Math.hypot(dx, dz) || 1; dx /= d; dz /= d;
    for (const b of this.bauten) { if (b.zerstoert || b === ziel) continue;
      const ox = f.x - b.x, oz = f.z - b.z, od = Math.hypot(ox, oz) || 1e-6;
      if (od < b.radius + f.radius + 0.25 && dx * ox + dz * oz < 0) {
        let tx = -oz / od, tz = ox / od; const seite = tx * dx + tz * dz;
        if (seite < 0 || (seite === 0 && f.id % 2 === 1)) { tx = -tx; tz = -tz; }
        dx = tx; dz = tz; } }
    f.x += dx * tempo * DT; f.z += dz * tempo * DT; f.r = Math.atan2(dx, dz);
  }

  turm(b) {
    const t = BAUTEN[b.typ]; if (b.takt > 0) { b.takt -= DT; return; }
    let best = null, bd = t.reichweite;
    for (const g of this.figuren) { if (g.team !== 0 || g.zustand === 'tot') continue; const d = Math.hypot(g.x - b.x, g.z - b.z); if (d < bd) { bd = d; best = g; } }
    if (!best) return;
    b.takt = t.takt; const dauer = bd / K.PFEIL_TEMPO, schaden = Math.round(t.schaden * (1 + (this.rnd() * 2 - 1) * K.STREUUNG));
    this.offen.push({ tick: this.tick + Math.max(1, Math.round(dauer / DT)), ziel: { fig: best.id }, schaden });
    this.ereignisse.push({ art: 'pfeil', vx: b.x, vz: b.z, vy: 3.4, nx: best.x, nz: best.z, ny: 0.9, dauer, turm: b.i });
  }

  trifft(o) {
    if (o.ziel.bau !== undefined) { const b = this.bauten[o.ziel.bau]; if (b.zerstoert) return;
      b.leben -= o.schaden; this.ereignisse.push({ art: 'treffer', x: b.x, z: b.z, bau: b.i, schaden: o.schaden });
      if (b.leben <= 0) { b.leben = 0; b.zerstoert = true; const lohn = BAUTEN[b.typ].beute ?? {};
        for (const k of BEUTE) this.beute[k] += lohn[k] ?? 0;
        this.ereignisse.push({ art: 'einsturz', bau: b.i, typ: b.typ, x: b.x, z: b.z, beute: lohn }); }
      return; }
    const g = this.figuren[o.ziel.fig]; if (g.zustand === 'tot') return;
    g.leben -= o.schaden; this.ereignisse.push({ art: 'treffer', x: g.x, z: g.z, id: g.id, schaden: o.schaden });
    if (g.leben <= 0) { g.leben = 0; g.zustand = 'tot'; g.ziel = null; this.ereignisse.push({ art: 'tod', id: g.id, team: g.team, x: g.x, z: g.z }); }
  }

  schiebe() {
    const fs = this.figuren, hx = K.BREITE / 2 - 0.3, hz = K.TIEFE / 2 - 0.3;
    for (let a = 0; a < fs.length; a++) { const p = fs[a]; if (p.zustand === 'tot') continue;
      for (let b = a + 1; b < fs.length; b++) { const q = fs[b]; if (q.zustand === 'tot') continue;
        const dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz), min = p.radius + q.radius;
        if (d < min) { const nx = d > 1e-5 ? dx / d : (a % 2 ? 1 : -1), nz = d > 1e-5 ? dz / d : 0, h = (min - d) / 2; p.x -= nx * h; p.z -= nz * h; q.x += nx * h; q.z += nz * h; } }
      for (const b of this.bauten) { if (b.zerstoert) continue;
        const dx = p.x - b.x, dz = p.z - b.z, d = Math.hypot(dx, dz), min = b.radius + p.radius;
        if (d < min) { const nx = d > 1e-5 ? dx / d : 0, nz = d > 1e-5 ? dz / d : 1; p.x = b.x + nx * min; p.z = b.z + nz * min; } }
      p.x = Math.max(-hx, Math.min(hx, p.x)); p.z = Math.max(-hz, Math.min(hz, p.z));
    }
  }

  // Kurze Zusammenfassung, an der man zwei Kämpfe vergleichen kann
  abdruck() {
    return [this.tick, this.prozent(), this.runen(), ...this.bauten.map(b => b.leben), ...this.figuren.map(f => `${f.x.toFixed(4)},${f.z.toFixed(4)},${f.leben}`)].join('|');
  }

  // Einen Kampf aus seinen Eingaben nachrechnen
  static wiederhole(seed, dorf, truppe, eingaben) {
    const r = new Raubzug(seed, dorf, truppe), plan = [...eingaben].sort((a, b) => a.tick - b.tick); let i = 0;
    const grenze = Math.ceil(K.ZEIT / DT) + 5;
    while (!r.fertig && r.tick < grenze) {
      while (i < plan.length && plan[i].tick <= r.tick) { const e = plan[i++];
        if (e.art === 'setze') r.setze(e.typ, e.x, e.z); else if (e.art === 'schrei') r.schreie(); else if (e.art === 'ende') r.gibAuf(); }
      if (!r.fertig) r.step();
    }
    return r;
  }
}

// Ein Computer-Spieler für Tests und zum Zuschauen (?auto). Liefert Eingaben mit Zeitpunkt.
// 'klug': Schildträger zuerst (sie fangen die Pfeile), dann Äxte und Anführer, Bogenschützen dahinter, Kriegsschrei im Dorf.
// 'plump': alle auf einmal in einer Ecke, ohne Kriegsschrei.
export function botEingaben(art = 'klug', truppe = TRUPPE) {
  const e = [], z0 = K.TIEFE / 2 - K.STRAND + 0.6, t = s => Math.round(s / DT);
  const reihe = (typ, n, sek, mitte, weite, z) => { for (let i = 0; i < n; i++) e.push({ tick: t(sek + i * 0.25), art: 'setze', typ, x: n === 1 ? mitte : mitte - weite / 2 + weite * i / (n - 1), z }); };
  if (art === 'plump') { let i = 0; for (const typ of KARTEN) for (let k = 0; k < (truppe[typ] ?? 0); k++, i++) e.push({ tick: t(0.5 + i * 0.1), art: 'setze', typ, x: 8.5 - (i % 4) * 0.5, z: z0 + 1 + Math.floor(i / 4) * 0.6 }); return e; }
  reihe('schild', truppe.schild ?? 0, 0.5, 0, 3, z0);
  reihe('axt', truppe.axt ?? 0, 2.5, 0, 7, z0 + 0.6);
  reihe('anfuehrer', truppe.anfuehrer ?? 0, 4.5, 0, 0, z0 + 0.4);
  reihe('bogen', truppe.bogen ?? 0, 6, 0, 6, z0 + 1.6);
  if (truppe.anfuehrer) e.push({ tick: t(13), art: 'schrei' });
  return e;
}
