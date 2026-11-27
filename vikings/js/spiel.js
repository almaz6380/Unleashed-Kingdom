// Vikings – Bild, Ton und Bedienung des Probekampfs. Die Regeln stehen in sim.js.
// Fast alles Sichtbare ist Platzhalter: Boden gemalt im Code, Häuser aus Klötzen, Krieger aus freien Figuren (../modelle).
// Der Anführer ist die erste eigene Figur des Users (modelle/anfuehrer-*.glb).
// Zugriff für Tests: window.VK
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as kloneSkelett } from 'three/addons/utils/SkeletonUtils.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { umgebung } from './licht.js';
import { DT, K, EINHEITEN, BAUTEN, BEUTE, KARTEN, TRUPPE, Raubzug, botEingaben, amStrand, mulberry32 } from './sim.js';

const Q = new URLSearchParams(location.search), $ = id => document.getElementById(id);
const lerp = (a, b, t) => a + (b - a) * t, klemme = (v, a, b) => Math.min(b, Math.max(a, v));
const HX = K.BREITE / 2, HZ = K.TIEFE / 2, STRAND_Z = HZ - K.STRAND;
const speicher = {
  lies: (k, d) => { try { const v = localStorage.getItem('vk_' + k); return v === null ? d : v; } catch (e) { return d; } },
  schreib: (k, v) => { try { localStorage.setItem('vk_' + k, v); } catch (e) {} },
};
const stand = { ton: speicher.lies('ton', '1') === '1' };
const app = { r: null, läuft: false, rest: 0, tempo: +(Q.get('tempo') || 1), karte: KARTEN[0], gesetzt: 0, bot: null, seed: 0 };

// =====================================================================
// Szene
// =====================================================================
const canvas = $('bild');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x1f4a66);
const camera = new THREE.PerspectiveCamera(38, 1, 1, 400);
scene.add(new THREE.HemisphereLight(0xfff0d8, 0x4a5a44, 1.25));
scene.environment = umgebung(renderer); scene.environmentIntensity = 0.45;   // nur für die eigenen Figuren, siehe licht.js
const sonne = new THREE.DirectionalLight(0xffdca8, 2.3); sonne.position.set(-12, 24, 12); sonne.castShadow = true;
sonne.shadow.mapSize.set(2048, 2048); Object.assign(sonne.shadow.camera, { left: -20, right: 20, top: 24, bottom: -24, near: 1, far: 80 });
sonne.shadow.bias = -0.0006; sonne.shadow.normalBias = 0.05; scene.add(sonne);
const lambert = (farbe, mehr = {}) => new THREE.MeshLambertMaterial({ color: farbe, ...mehr });

// Grafik-Stufe wie im alten Spiel: 'hoch' oder 'sparsam'; 'auto' misst im ersten Kampf und merkt sich das Ergebnis
const grafik = { wahl: ['hoch', 'sparsam'].includes(Q.get('grafik')) ? Q.get('grafik') : 'auto', stufe: 'hoch', mess: { t: 0, n: 0, fertig: false } };
grafik.stufe = grafik.wahl === 'auto' ? speicher.lies('grafikAuto', 'hoch') : grafik.wahl; grafik.mess.fertig = grafik.wahl !== 'auto' || speicher.lies('grafikAuto', '') !== '';
function setzeGrafik(stufe) { grafik.stufe = stufe; const sm = stufe === 'sparsam' ? 1024 : 2048;
  if (sonne.shadow.mapSize.x !== sm) { sonne.shadow.mapSize.set(sm, sm); sonne.shadow.map?.dispose(); sonne.shadow.map = null; } passeAn(); }

// ---------- Boden: Wiese, Wege, Strand, Wasser (im Code gemalt) ----------
function maleBoden(bauten) {
  const BW = K.BREITE + 12, BT = K.TIEFE + 12, W = 1024, H = Math.round(W * BT / BW), c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), X = x => (x + BW / 2) / BW * W, Z = z => (z + BT / 2) / BT * H, M = m => m / BW * W, rnd = mulberry32(11);
  const wasser = g.createLinearGradient(0, Z(HZ - 1), 0, H); wasser.addColorStop(0, '#4a94ae'); wasser.addColorStop(1, '#1f4a66'); g.fillStyle = wasser; g.fillRect(0, 0, W, H);
  g.fillStyle = '#5d8a3e'; g.fillRect(0, 0, W, Z(STRAND_Z) + 2);
  for (let i = 0; i < 900; i++) { const x = rnd() * W, y = rnd() * Z(STRAND_Z), r = M(0.3 + rnd() * 0.9);
    g.fillStyle = rnd() < 0.5 ? 'rgba(40,80,30,.18)' : 'rgba(160,195,95,.15)'; g.beginPath(); g.ellipse(x, y, r, r * 0.6, rnd() * 3, 0, 7); g.fill(); }
  const ufer = x => Z(HZ + 0.4) + Math.sin(x * 0.015 + 1) * M(0.35);
  g.fillStyle = '#d9c08a'; g.beginPath(); g.moveTo(0, Z(STRAND_Z));
  for (let x = 0; x <= W; x += 16) g.lineTo(x, Z(STRAND_Z) + Math.sin(x * 0.02) * M(0.25) - M(0.2));
  for (let x = W; x >= 0; x -= 16) g.lineTo(x, ufer(x)); g.closePath(); g.fill();
  for (let i = 0; i < 500; i++) { g.fillStyle = rnd() < 0.5 ? 'rgba(120,95,50,.2)' : 'rgba(255,245,210,.25)'; g.beginPath(); g.arc(rnd() * W, Z(STRAND_Z + rnd() * (K.STRAND + 0.3)), M(0.05 + rnd() * 0.12), 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = M(0.2); g.beginPath(); for (let x = 0; x <= W; x += 16) x ? g.lineTo(x, ufer(x) + M(0.12)) : g.moveTo(x, ufer(x) + M(0.12)); g.stroke();
  g.strokeStyle = '#b89a66'; g.lineCap = 'round'; g.lineJoin = 'round';
  const weg = (breit, pts) => { g.lineWidth = M(breit); g.beginPath(); pts.forEach(([x, z], i) => i ? g.lineTo(X(x), Z(z)) : g.moveTo(X(x), Z(z))); g.stroke(); };
  // Hauptweg vom Strand zum Langhaus, Abzweige zu den übrigen Häusern
  const haupt = bauten.find(b => BAUTEN[b.typ].haupt) ?? bauten[0], z0 = STRAND_Z + 0.6, z1 = haupt.z + haupt.radius + 0.4;
  const mitte = z => { const k = klemme((z0 - z) / (z0 - z1), 0, 1); return haupt.x * k + Math.sin(k * Math.PI * 2) * 0.9; };
  const spur = []; for (let i = 0; i <= 24; i++) { const z = lerp(z0, z1, i / 24); spur.push([mitte(z), z]); } weg(1.5, spur);
  for (const b of bauten) { if (b === haupt || BAUTEN[b.typ].schaden || Math.abs(b.x - mitte(b.z)) < 2) continue;
    const z = b.z + 0.5; weg(1.0, [[mitte(z), z], [b.x - Math.sign(b.x - mitte(z)) * b.radius * 0.7, z]]); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  const boden = new THREE.Mesh(new THREE.PlaneGeometry(BW, BT).rotateX(-Math.PI / 2), new THREE.MeshLambertMaterial({ map: t })); boden.receiveShadow = true; scene.add(boden);
  const weit = new THREE.Mesh(new THREE.PlaneGeometry(240, 240).rotateX(-Math.PI / 2), lambert(0x1f4a66)); weit.position.y = -0.05; scene.add(weit);
}

// Strand-Markierung: zeigt, wo man absetzen darf
const zone = new THREE.Mesh(new THREE.PlaneGeometry(2 * (HX - 0.4), K.STRAND - 0.3).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0, depthWrite: false }));
zone.position.set(0, 0.03, STRAND_Z + (K.STRAND - 0.3) / 2); zone.userData = { rot: 0 }; scene.add(zone);
const zoneRand = new THREE.LineSegments(new THREE.EdgesGeometry(zone.geometry), new THREE.LineBasicMaterial({ color: 0xfff3c4, transparent: true, opacity: 0 }));
zoneRand.position.copy(zone.position); zoneRand.position.y = 0.05; scene.add(zoneRand);

function baueKulisse() {
  // Langschiff am Ufer
  const schiff = new THREE.Group(), holz = lambert(0x6a4326);
  const rumpf = new THREE.Mesh(new THREE.CapsuleGeometry(0.75, 5.2, 6, 12).rotateZ(Math.PI / 2), holz); rumpf.scale.set(1, 0.6, 1); rumpf.position.y = 0.2; rumpf.castShadow = true;
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.6, 8), holz); mast.position.y = 2.1; mast.castShadow = true;
  const sc = document.createElement('canvas'); sc.width = 64; sc.height = 8; const sg = sc.getContext('2d'); for (let i = 0; i < 8; i++) { sg.fillStyle = i % 2 ? '#f2e8d0' : '#b23a2e'; sg.fillRect(i * 8, 0, 8, 8); }
  const st = new THREE.CanvasTexture(sc); st.colorSpace = THREE.SRGBColorSpace;
  const segel = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.0), new THREE.MeshLambertMaterial({ map: st, side: THREE.DoubleSide })); segel.position.set(0, 2.8, 0.06); segel.castShadow = true;
  schiff.add(rumpf, mast, segel);
  for (const s of [-1, 1]) { const steven = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.17, 1.5, 8), holz); steven.position.set(s * 3.15, 0.95, 0); steven.rotation.z = -s * 0.55; schiff.add(steven); }
  for (let i = 0; i < 6; i++) { const schild = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 14).rotateX(Math.PI / 2), lambert([0xb23a2e, 0xe0b040, 0x3a6ea8][i % 3])); schild.position.set(-2 + i * 0.8, 0.5, -0.47); schiff.add(schild); }
  schiff.position.set(0, 0, HZ + 1.75); scene.add(schiff);
  // Bäume rund um das Feld
  const rnd = mulberry32(4), laub = lambert(0x2f5a2c), stamm = lambert(0x5a3c22);
  const baum = (x, z) => { const g = new THREE.Group(), h = 1.9 + rnd() * 1.3; const k = new THREE.Mesh(new THREE.ConeGeometry(0.75 + rnd() * 0.3, h, 7), laub); k.position.y = 0.5 + h / 2; k.castShadow = true;
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.6, 6), stamm); s.position.y = 0.3; g.add(k, s); g.position.set(x, 0, z); scene.add(g); };
  for (let i = 0; i < 16; i++) baum(-HX - 1.2 - rnd() * 3.5, -HZ + rnd() * (K.TIEFE - K.STRAND - 1));
  for (let i = 0; i < 16; i++) baum(HX + 1.2 + rnd() * 3.5, -HZ + rnd() * (K.TIEFE - K.STRAND - 1));
  for (let i = 0; i < 20; i++) baum(-HX - 3 + rnd() * (K.BREITE + 6), -HZ - 1 - rnd() * 4);
}

// ---------- Lebensbalken (für Gebäude und Krieger) ----------
function balken(breite, farbe) {
  const g = new THREE.Group();
  const hinten = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x140d08, depthTest: false })); hinten.scale.set(breite, 0.17, 1);
  const vorn = new THREE.Sprite(new THREE.SpriteMaterial({ color: farbe, depthTest: false })); vorn.center.set(0, 0.5); vorn.position.x = -breite / 2 + 0.03; vorn.scale.set(breite - 0.06, 0.1, 1);
  hinten.renderOrder = 5; vorn.renderOrder = 6; g.add(hinten, vorn); g.userData = { vorn, breite }; g.visible = false; return g;
}
const setzeBalken = (g, anteil) => { g.visible = anteil > 0 && anteil < 1; g.userData.vorn.scale.x = Math.max(0.001, (g.userData.breite - 0.06) * anteil); };

// ---------- Gebäude (Platzhalter aus Klötzen) ----------
function dach(breite, hoehe, tiefe, farbe) { // Satteldach, First entlang x
  const s = new THREE.Shape(); s.moveTo(-tiefe / 2, 0); s.lineTo(tiefe / 2, 0); s.lineTo(0, hoehe); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: breite, bevelEnabled: false }); g.translate(0, 0, -breite / 2); g.rotateY(Math.PI / 2);
  return new THREE.Mesh(g, lambert(farbe));
}
const kasten = (w, h, d, farbe) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lambert(farbe));
function baueBau(b) {
  const grp = new THREE.Group(), haus = new THREE.Group(); grp.add(haus); let hoehe = 2;
  const teil = (m, x, y, z) => { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; haus.add(m); return m; };
  const tuer = (h, z) => teil(kasten(0.55, h, 0.08, 0x2e1c10), 0, h / 2, z);        // Tür an der Seite zur Kamera
  if (b.typ === 'huette') { teil(kasten(1.7, 1.5, 1.5, 0x8a6238), 0, 0.75, 0); teil(dach(2.0, 1.2, 1.9, 0xb89a4e), 0, 1.5, 0); teil(kasten(2.05, 0.1, 0.14, 0x6a4a2a), 0, 2.72, 0); tuer(1.0, 0.76); hoehe = 2.8; }
  else if (b.typ === 'vorrat') { teil(kasten(2.1, 1.7, 1.9, 0x9a7446), 0, 0.85, 0); teil(dach(2.4, 1.3, 2.3, 0x7a5a36), 0, 1.7, 0); teil(kasten(2.45, 0.1, 0.14, 0x4e3620), 0, 3.02, 0); tuer(1.1, 0.96); hoehe = 3.1;
    for (const x of [-0.8, 0.8]) teil(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.55, 10), lambert(0x6a4a2a)), x, 0.28, 1.2); }
  else if (b.typ === 'langhaus') { teil(kasten(3.5, 2.0, 2.5, 0x7a5230), 0, 1.0, 0); teil(dach(4.0, 1.9, 3.0, 0x5e3a22), 0, 2.0, 0); teil(kasten(4.1, 0.14, 0.18, 0x3a2414), 0, 3.92, 0); tuer(1.4, 1.26); hoehe = 4.0;
    for (const i of [0, 1, 2, 3]) teil(new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 14).rotateX(Math.PI / 2), lambert([0xb23a2e, 0xe0b040, 0x3a6ea8, 0xe0b040][i])), (i < 2 ? -1.45 : 0.65) + (i % 2) * 0.8, 1.2, 1.29); }
  else { teil(kasten(1.0, 3.4, 1.0, 0x6e4a2c), 0, 1.7, 0); teil(kasten(1.6, 0.22, 1.6, 0x5a3a20), 0, 3.5, 0);
    for (const [x, z] of [[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]) teil(kasten(0.12, 0.7, 0.12, 0x5a3a20), x, 3.95, z);
    teil(new THREE.Mesh(new THREE.ConeGeometry(1.25, 1.0, 4).rotateY(Math.PI / 4), lambert(0x5e3a22)), 0, 4.8, 0); hoehe = 5.3; }
  const lb = balken(Math.max(1.4, b.radius * 1.6), 0xff6a5a); lb.position.y = hoehe + 0.5; grp.add(lb);
  grp.position.set(b.x, 0, b.z); scene.add(grp);
  return { grp, haus, balken: lb, hoehe, weg: false, t: 0, wackel: 0 };
}
function zeigeBau(s, b, dt) {
  setzeBalken(s.balken, b.leben / b.maxLeben);
  if (b.zerstoert && !s.weg) { s.weg = true; s.t = 0; s.haus.traverse(o => { if (o.isMesh) { o.material = o.material.clone(); o.material.color.multiplyScalar(0.45); } }); }
  if (s.weg) { s.t = Math.min(1, s.t + dt / 0.6); s.haus.scale.set(1 + 0.15 * s.t, lerp(1, 0.14, s.t), 1 + 0.15 * s.t); }
  else if (s.wackel > 0) { s.wackel = Math.max(0, s.wackel - dt); const w = 1 + Math.sin(s.wackel * 60) * 0.03 * (s.wackel / 0.18); s.haus.scale.set(w, 1 / w, w); }
}

// ---------- Krieger (Platzhalter-Figuren aus dem alten Spiel, Anführer aus Tripo und Mixamo) ----------
// Feinheit des Anführers: vorläufig die mittlere, bis der User gewählt hat. Umschalten zum Vergleichen: ?figur=80k|250k|600k
const FEINHEIT = ['80k', '250k', '600k'].includes(Q.get('figur')) ? Q.get('figur') : '250k';
const AUSSEHEN = {
  schild:    { datei: '../modelle/krieger.glb',  hoehe: 2.1, ton: 0x9fc4ff },
  axt:       { datei: '../modelle/krieger.glb',  hoehe: 1.9, ton: 0xffffff },
  // eigen: die Figur behält ihr eigenes Material. lauf: Tempo, bei dem die Lauf-Bewegung in echter Geschwindigkeit passt. tod: Dauer des Fallens.
  anfuehrer: { datei: `modelle/anfuehrer-${FEINHEIT}.glb`, hoehe: 2.5, ton: 0xffffff, eigen: true, glut: 0.1, lauf: 4.0, tod: 1.3 },
  bogen:     { datei: '../modelle/schurkin.glb', hoehe: 1.8, ton: 0xd8ffc8, glut: 0.75 },   // dunkle Vorlage, deshalb heller
  wache:     { datei: '../modelle/krieger.glb',  hoehe: 1.9, ton: 0xff7a6a },
};
const GLUT = 0.38;   // Eigenleuchten: die kleinen Figuren sollen sich von der Wiese abheben
const loader = new GLTFLoader(), vorlagen = {}, fehlend = []; loader.setMeshoptDecoder(MeshoptDecoder);
async function ladeVorlagen() {
  const dateien = [...new Set(Object.values(AUSSEHEN).map(a => a.datei))];
  await Promise.all(dateien.map(async d => { if (Q.get('ohne') === 'modelle') { fehlend.push(d); return; }
    try { const g = await loader.loadAsync(d), box = new THREE.Box3().setFromObject(g.scene); vorlagen[d] = { szene: g.scene, clips: g.animations, h: box.max.y - box.min.y, y0: box.min.y }; }
    catch (e) { fehlend.push(d); } }));
}
function baueFigur(f) {
  const a = AUSSEHEN[f.typ], v = vorlagen[a.datei], grp = new THREE.Group(), eigen = f.team === 0;
  // grp trägt nur die Lage; gedreht wird allein der Körper, damit Ring und Lebensbalken gerade bleiben
  const koerper = new THREE.Group(); grp.add(koerper);
  const s = { grp, koerper, mixer: null, akt: {}, jetzt: null, mats: [], r: f.r, schlagNr: f.schlagNr, zustand: '', totSeit: 0, eigen, glut: a.glut ?? GLUT, eigenMat: !!a.eigen, schreiEnde: 0 };
  if (v) { const m = kloneSkelett(v.szene); m.position.y = -v.y0; const halter = new THREE.Group(); halter.add(m); halter.scale.setScalar(a.hoehe / v.h); koerper.add(halter);
    m.traverse(o => { if (!o.isMesh) return; o.castShadow = true; o.frustumCulled = false;
      if (a.eigen) { const neu = o.material.clone(); neu.emissive = new THREE.Color(0xffffff); neu.emissiveMap = neu.map; neu.emissiveIntensity = s.glut; o.material = neu; s.mats.push(neu); return; }
      const alt = o.material, neu = new THREE.MeshLambertMaterial({ map: alt.map, color: a.ton });
      neu.color.multiplyScalar(1.9); neu.emissive = new THREE.Color(a.ton); neu.emissiveMap = alt.map; neu.emissiveIntensity = s.glut; o.material = neu; s.mats.push(neu); });
    s.mixer = new THREE.AnimationMixer(m); for (const c of v.clips) s.akt[c.name] = s.mixer.clipAction(c);
  } else { const mat = lambert(new THREE.Color(a.ton).multiplyScalar(0.8)); s.mats.push(mat);
    const k = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, a.hoehe - 1.0, 6, 12), mat); k.position.y = a.hoehe / 2 - 0.1; k.castShadow = true;
    const kopf = new THREE.Mesh(new THREE.SphereGeometry(0.27, 14, 10), mat); kopf.position.y = a.hoehe - 0.24; kopf.castShadow = true; koerper.add(k, kopf); }
  const gross = f.typ === 'anfuehrer';
  const ring = new THREE.Mesh(new THREE.RingGeometry(f.radius * (gross ? 1.25 : 1.05), f.radius * (gross ? 1.75 : 1.45), 24).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: eigen ? 0xffd27a : 0xff5a4a, transparent: true, opacity: 0.9, depthWrite: false }));
  ring.position.y = 0.04; grp.add(ring); s.ring = ring;
  s.balken = balken(gross ? 1.5 : 1.0, eigen ? 0x6fd35a : 0xff6a5a); s.balken.position.y = a.hoehe + 0.4; grp.add(s.balken);
  grp.position.set(f.x, 0, f.z); koerper.rotation.y = f.r; scene.add(grp); return s;
}
function spiele(s, name, einmal, dauer) { // Bewegung wechseln, weich überblenden
  const a = s.akt[name]; if (!a || (s.jetzt === a && !einmal)) return;
  const blende = name.startsWith('schlag') ? 0.06 : name === 'tod' ? 0.12 : 0.16;
  a.reset(); a.setLoop(einmal ? THREE.LoopOnce : THREE.LoopRepeat, Infinity); a.clampWhenFinished = true; a.timeScale = dauer ? a.getClip().duration / dauer : 1;
  if (s.jetzt && s.jetzt !== a) { a.crossFadeFrom(s.jetzt, blende, false); a.play(); } else a.fadeIn(blende).play(); s.jetzt = a;
}
// Kriegsschrei des Anführers: die Bewegung betrifft nur Oberkörper und Arme und liegt mit hohem Gewicht über dem, was
// die Figur gerade tut. Die Beine laufen oder stehen also weiter.
function rufe(s) { const a = s?.akt.schrei; if (!a) return; const dauer = 1.5;
  a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.timeScale = a.getClip().duration / dauer; a.weight = 8; a.fadeIn(0.15).play(); s.schreiEnde = zeit + dauer - 0.3; }
function zeigeFigur(s, f, dt, anteil, r) {
  const t = EINHEITEN[f.typ], eilig = f.schreiBis > r.zeit && f.zustand !== 'tot';
  const x = f.px === undefined ? f.x : lerp(f.px, f.x, anteil), z = f.pz === undefined ? f.z : lerp(f.pz, f.z, anteil);
  s.grp.position.x = x; s.grp.position.z = z;
  let dr = f.r - s.r; dr = Math.atan2(Math.sin(dr), Math.cos(dr)); s.r += dr * (1 - Math.exp(-dt * 14)); s.koerper.rotation.y = s.r;
  const a = AUSSEHEN[f.typ];
  if (s.schreiEnde && (zeit > s.schreiEnde || f.zustand === 'tot')) { s.akt.schrei.fadeOut(0.3); s.schreiEnde = 0; }
  if (f.zustand === 'tot') { if (s.zustand !== 'tot') { spiele(s, 'tod', true, a.tod ?? 0.9); s.ring.visible = false; s.balken.visible = false; if (!s.mixer) s.koerper.rotation.z = 1.4; }
    s.totSeit += dt; if (s.totSeit > 2.2) s.grp.position.y = -Math.min(1.6, (s.totSeit - 2.2) * 0.9); if (s.totSeit > 4.2) s.grp.visible = false; }
  else if (f.zustand === 'kampf') { if (s.schlagNr !== f.schlagNr) { s.schlagNr = f.schlagNr; spiele(s, s.akt.schlag2 && f.schlagNr % 2 === 0 ? 'schlag2' : 'schlag1', true, Math.min(0.7, t.takt * 0.8) / (eilig ? K.SCHREI_FAKTOR : 1)); } else if (s.zustand !== 'kampf') spiele(s, 'steh', false); }
  else if (f.zustand === 'lauf') { spiele(s, 'lauf', false); if (s.jetzt === s.akt.lauf) s.jetzt.timeScale = t.tempo / (a.lauf ?? 3.4) * (eilig ? K.SCHREI_FAKTOR : 1); }
  else spiele(s, 'steh', false);
  s.zustand = f.zustand; s.mixer?.update(dt);
  if (f.zustand !== 'tot') { setzeBalken(s.balken, f.leben / f.maxLeben);
    for (const m of s.mats) if (m.emissiveMap) m.emissiveIntensity = eilig ? s.glut + (s.eigenMat ? 0.22 : 0.4) * (1 + 0.5 * Math.sin(zeit * 14)) : s.glut;
    s.ring.material.color.setHex(eilig ? 0xffffff : s.eigen ? 0xffd27a : 0xff5a4a); }
}

// =====================================================================
// Effekte und Ton
// =====================================================================
const fleck = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), v = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  v.addColorStop(0, 'rgba(255,255,255,1)'); v.addColorStop(0.4, 'rgba(255,255,255,.55)'); v.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = v; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
const teile = [];
function funken(x, y, z, farbe, n, wucht, staub = false) {
  if (grafik.stufe === 'sparsam') n = Math.ceil(n / 2);
  for (let i = 0; i < n; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: fleck, color: farbe, blending: staub ? THREE.NormalBlending : THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: staub ? 0.6 : 1 }));
    const a = Math.random() * 6.283, v = (0.4 + Math.random()) * wucht; s.position.set(x, y, z);
    s.userData = { vx: Math.cos(a) * v, vy: (staub ? 0.6 : 1) + Math.random() * wucht * 0.8, vz: Math.sin(a) * v, t: 0, d: (staub ? 0.8 : 0.3) + Math.random() * 0.3, g: (staub ? 0.7 : 0.16) + Math.random() * 0.25, fall: staub ? 1.5 : 9, o: staub ? 0.6 : 1 };
    scene.add(s); teile.push(s); }
}
const pfeilGeo = new THREE.BoxGeometry(0.05, 0.05, 0.7), pfeilMat = new THREE.MeshBasicMaterial({ color: 0x3a2a18 });
function pfeil(e) { const m = new THREE.Mesh(pfeilGeo, pfeilMat); m.userData = { pfeil: true, t: 0, d: Math.max(0.08, e.dauer), a: new THREE.Vector3(e.vx, e.vy, e.vz), b: new THREE.Vector3(e.nx, e.ny, e.nz) }; m.position.copy(m.userData.a); scene.add(m); teile.push(m); }
function welle(x, z) { const m = new THREE.Mesh(new THREE.RingGeometry(0.82, 1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.position.set(x, 0.08, z); m.userData = { welle: true, t: 0, d: 0.55 }; scene.add(m); teile.push(m); }
const _p = new THREE.Vector3();
function bewegeTeile(dt) {
  for (let i = teile.length - 1; i >= 0; i--) { const s = teile[i], u = s.userData; u.t += dt; const k = u.t / u.d;
    if (k >= 1) { scene.remove(s); if (!u.pfeil) { s.material.dispose(); if (u.welle) s.geometry.dispose(); } teile.splice(i, 1); continue; }
    if (u.pfeil) { _p.copy(u.a).lerp(u.b, k); _p.y += Math.sin(Math.PI * k) * (0.6 + u.d * 2); s.lookAt(_p); s.position.copy(_p); continue; }
    if (u.welle) { s.scale.setScalar(lerp(0.5, K.SCHREI_RADIUS, k)); s.material.opacity = 0.9 * (1 - k); continue; }
    u.vy -= u.fall * dt; s.position.x += u.vx * dt; s.position.y = Math.max(0.05, s.position.y + u.vy * dt); s.position.z += u.vz * dt; s.scale.setScalar(u.g * (1 + k * (u.fall < 5 ? 1.5 : -0.5))); s.material.opacity = u.o * (1 - k); }
}
function weltZuBild(x, z, y = 0) { _p.set(x, y, z).project(camera); return { x: (_p.x * 0.5 + 0.5) * innerWidth, y: (-_p.y * 0.5 + 0.5) * innerHeight }; }
function schweb(x, z, y, text) { const p = weltZuBild(x, z, y), el = document.createElement('div'); el.className = 'schweb'; el.textContent = text;
  el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`; document.body.appendChild(el); setTimeout(() => el.remove(), 1450); }
let ac = null, letzterSchlag = 0;
function ton(freq, dauer, art = 'square', laut = 0.07, ziel = freq) { if (!stand.ton || !app.läuft) return;
  try { ac ??= new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = art; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, ziel), t + dauer); g.gain.setValueAtTime(laut, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dauer); } catch (e) {} }
let wackel = 0, bannerUhr = 0, hinweisUhr = 0;
function banner(text, ms = 1100) { const el = $('banner'); el.textContent = text; el.classList.add('an'); clearTimeout(bannerUhr); bannerUhr = setTimeout(() => el.classList.remove('an'), ms); }
function hinweis(text, falsch = false, ms = 0) { const el = $('hinweis'); el.textContent = text; el.classList.toggle('falsch', falsch); el.classList.toggle('an', !!text); clearTimeout(hinweisUhr); if (ms) hinweisUhr = setTimeout(() => el.classList.remove('an'), ms); }
const BEUTE_BILD = { holz: '🪵', eisen: '⛏️', silber: '🪙' }, BEUTE_NAME = { holz: 'Holz', eisen: 'Eisen', silber: 'Silber' };

function fx(e) { // Ereignisse aus den Regeln ⇒ Bild und Ton
  const r = app.r;
  if (e.art === 'gesetzt') { funken(e.x, 0.2, e.z, 0xe8d8a8, 5, 1.6, true); ton(520, 0.08, 'sine', 0.05, 320); }
  else if (e.art === 'pfeil') { pfeil(e); if (e.turm !== undefined) ton(900, 0.05, 'triangle', 0.02, 500); }
  else if (e.art === 'treffer') { if (e.bau !== undefined) { app.bauBild[e.bau].wackel = 0.18; funken(e.x + (Math.random() - 0.5), 0.9, e.z + 0.8, 0xd8b070, 2, 2); } else funken(e.x, 1.2, e.z, 0xffe8c0, 3, 2.4);
    if (zeit - letzterSchlag > 0.07) { letzterSchlag = zeit; ton(e.bau !== undefined ? 130 : 180, 0.09, 'sawtooth', 0.035, 60); } }
  else if (e.art === 'tod') { funken(e.x, 1, e.z, e.team === 0 ? 0xffb090 : 0xffe0a0, 8, 3); ton(e.team === 0 ? 150 : 240, 0.25, 'sawtooth', 0.06, 50); }
  else if (e.art === 'einsturz') { const b = r.bauten[e.bau]; funken(e.x, 1, e.z, 0x9a8a78, 16, 2.6, true); funken(e.x, 1.2, e.z, 0xffb060, 10, 4); wackel = Math.max(wackel, BAUTEN[e.typ].haupt ? 0.7 : 0.35); ton(90, 0.5, 'sawtooth', 0.11, 30);
    const lohn = BEUTE.filter(k => e.beute[k]).map(k => `${BEUTE_BILD[k]} +${e.beute[k]}`).join('  '); schweb(e.x, e.z, 2.5, lohn || `${BAUTEN[b.typ].name} zerstört`); if (BAUTEN[e.typ].haupt) banner('Langhaus gefallen!'); }
  else if (e.art === 'schrei') { welle(e.x, e.z); rufe(app.figBild.get(r.anfuehrer()?.id)); banner('Kriegsschrei!', 900); wackel = Math.max(wackel, 0.3); ton(180, 0.6, 'sawtooth', 0.1, 520); setTimeout(() => ton(260, 0.5, 'square', 0.06, 640), 90); if (navigator.vibrate) try { navigator.vibrate([40, 30, 90]); } catch (x) {} }
  else if (e.art === 'ende') setTimeout(zeigeErgebnis, 1300);
}

// =====================================================================
// Kamera: fest von schräg oben, das ganze Feld passt zwischen Anzeige oben und Karten unten
// =====================================================================
const kam = { d: 60, s: 0 }, NEIGUNG = 61 * Math.PI / 180;
function setzeKamera(wx = 0, wz = 0) { camera.position.set(wx, kam.d * Math.sin(NEIGUNG), kam.s + kam.d * Math.cos(NEIGUNG) + wz); camera.lookAt(wx, 0, kam.s + wz); camera.updateMatrixWorld(); }
function passeAn() {
  const w = innerWidth, h = innerHeight; renderer.setPixelRatio(Math.min(devicePixelRatio || 1, grafik.stufe === 'sparsam' ? 1.25 : 2)); renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  const oben = 1 - 2 * 62 / h, unten = -1 + 2 * 128 / h, ecken = [[-HX - 0.4, -HZ - 0.4], [HX + 0.4, -HZ - 0.4], [-HX - 0.4, HZ + 2.3], [HX + 0.4, HZ + 2.3]];
  let best = null;
  for (let d = 14; d <= 160 && !best; d += 1) for (let s = -14; s <= 14; s += 0.5) { kam.d = d; kam.s = s; setzeKamera();
    let passt = true, yo = -9, yu = 9; for (const [x, z] of ecken) { _p.set(x, 0, z).project(camera); if (Math.abs(_p.x) > 0.985) passt = false; yo = Math.max(yo, _p.y); yu = Math.min(yu, _p.y); }
    if (passt && yo <= oben && yu >= unten) { const schief = Math.abs((oben - yo) - (yu - unten)); if (!best || schief < best.schief) best = { d, s, schief }; } }
  best ??= { d: 70, s: 0 }; kam.d = best.d; kam.s = best.s; setzeKamera();
}
window.addEventListener('resize', passeAn);

// =====================================================================
// Bedienung: Karte wählen, auf den Strand tippen (halten setzt mehrere ab), Kriegsschrei
// =====================================================================
const strahl = new THREE.Raycaster(), ebene = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), _m = new THREE.Vector2(), _treff = new THREE.Vector3();
function bodenPunkt(cx, cy) { _m.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); strahl.setFromCamera(_m, camera); return strahl.ray.intersectPlane(ebene, _treff) ? { x: _treff.x, z: _treff.z } : null; }
const eingabe = { halten: null };
function nimmEreignisse() { const r = app.r; for (const e of r.ereignisse.splice(0)) fx(e); }
function absetzenWelt(typ, x, z) { // true, wenn ein Krieger abgesetzt wurde
  const r = app.r; if (!r || r.fertig || !app.läuft) return false;
  const f = r.setze(typ, x, z); if (!f) return false;
  nimmEreignisse(); app.gesetzt++; if (app.gesetzt === 1) hinweis('');
  if (!(r.vorrat[app.karte] > 0)) app.karte = KARTEN.find(k => r.vorrat[k] > 0) ?? app.karte;
  zeichneKarten(); return true;
}
function absetzen(cx, cy) {
  const r = app.r, p = bodenPunkt(cx, cy); if (!p || !r || r.fertig) return false;
  if (!(r.vorrat[app.karte] > 0)) return false;
  // etwas Nachsicht am Rand des Strands; nach jedem Absetzen ein kleiner Versatz, damit beim Halten niemand genau aufeinander steht
  let x = p.x + ((app.gesetzt % 3) - 1) * 0.28, z = p.z;
  if (z > STRAND_Z - 1 && z < HZ + 1.5 && Math.abs(x) < HX + 1) { x = klemme(x, -HX + 0.45, HX - 0.45); z = klemme(z, STRAND_Z + 0.05, HZ - 0.35); }
  if (!amStrand(x, z)) { zone.userData.rot = 0.5; hinweis('Krieger kannst du nur am Strand absetzen', true, 1600); ton(140, 0.12, 'square', 0.04, 90); return false; }
  return absetzenWelt(app.karte, x, z);
}
canvas.addEventListener('pointerdown', e => { if (!app.läuft || app.r.fertig) return; try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
  if (absetzen(e.clientX, e.clientY)) eingabe.halten = { id: e.pointerId, x: e.clientX, y: e.clientY, t: 0 }; });
canvas.addEventListener('pointermove', e => { const h = eingabe.halten; if (h && h.id === e.pointerId) { h.x = e.clientX; h.y = e.clientY; } });
const loslassen = e => { const h = eingabe.halten; if (h && (!e || e.pointerId === h.id)) eingabe.halten = null; };
for (const t of ['pointerup', 'pointercancel', 'lostpointercapture']) { canvas.addEventListener(t, loslassen); window.addEventListener(t, loslassen); }
window.addEventListener('blur', () => loslassen()); document.addEventListener('visibilitychange', () => loslassen());
canvas.addEventListener('contextmenu', e => e.preventDefault());
function schreie() { const r = app.r; if (!r || !app.läuft || !r.schreie()) return false; nimmEreignisse(); return true; }
$('schrei').addEventListener('click', schreie);
$('aufgeben').addEventListener('click', () => { const r = app.r; if (r && app.läuft && !r.fertig) { r.gibAuf(); nimmEreignisse(); } });

function zeichneKarten() {
  const r = app.r, el = $('karten'); el.innerHTML = '';
  for (const typ of KARTEN) { const t = EINHEITEN[typ], n = r ? r.vorrat[typ] ?? 0 : TRUPPE[typ], b = document.createElement('button');
    b.className = 'kk' + (app.karte === typ && n > 0 ? ' an' : ''); b.dataset.karte = typ; b.disabled = n <= 0;
    b.innerHTML = `<span class="bild">${t.bild}</span><b>${t.name}</b><i>${n}</i>`;
    b.addEventListener('click', () => { app.karte = typ; zeichneKarten(); ton(660, 0.05, 'sine', 0.04); }); el.appendChild(b); }
}
function zeigeAnzeige() {
  const r = app.r, rest = Math.max(0, Math.ceil(K.ZEIT - r.zeit)), n = r.runen();
  $('uhr').textContent = `${Math.floor(rest / 60)}:${String(rest % 60).padStart(2, '0')}`;
  $('prozent').textContent = `Zerstört ${r.prozent()} %`; $('runen').textContent = '◆'.repeat(n) + '◇'.repeat(3 - n);
  $('schrei').style.display = app.läuft && r.schreiMoeglich() ? 'block' : 'none';
}

// =====================================================================
// Ablauf
// =====================================================================
let zeit = 0;
function raeumeAuf() { for (const s of app.figBild?.values() ?? []) scene.remove(s.grp); for (const s of app.bauBild ?? []) scene.remove(s.grp); for (const t of teile.splice(0)) scene.remove(t); }
function starte(opt = {}) {
  raeumeAuf();
  app.seed = opt.seed ?? (Q.get('seed') ? +Q.get('seed') : (Date.now() & 0x7fffffff) || 1);
  app.r = new Raubzug(app.seed); app.figBild = new Map(); app.bauBild = app.r.bauten.map(baueBau);
  app.läuft = true; app.rest = 0; app.gesetzt = 0; app.karte = KARTEN[0]; eingabe.halten = null; wackel = 0;
  app.bot = Q.has('auto') ? { plan: botEingaben(Q.get('auto') || 'klug').sort((a, b) => a.tick - b.tick), i: 0 } : null;
  $('start').classList.remove('an'); $('ergebnis').classList.remove('an'); $('oben').style.display = 'grid'; $('karten').style.display = 'flex';
  zeichneKarten(); hinweis(app.bot ? '' : 'Wähle eine Karte und tippe auf den Strand'); uhr.getDelta();
}
function zeigeErgebnis() {
  const r = app.r; if (!r?.fertig) return; app.läuft = false; eingabe.halten = null; $('karten').style.display = 'none'; $('schrei').style.display = 'none'; hinweis('');
  const n = r.runen(), sek = Math.round(r.zeit), gefallen = r.figuren.filter(f => f.team === 0 && f.zustand === 'tot').length, alle = r.figuren.filter(f => f.team === 0).length;
  $('ergTitel').textContent = n === 3 ? 'Großer Sieg!' : n > 0 ? 'Sieg!' : 'Raubzug gescheitert';
  $('ergRunen').textContent = '◆'.repeat(n) + '◇'.repeat(3 - n);
  $('ergText').textContent = `${r.prozent()} % zerstört in ${Math.floor(sek / 60)}:${String(sek % 60).padStart(2, '0')} · ${gefallen} von ${alle} Kriegern gefallen`
    + (n === 0 ? '. Tipp: Schildträger zuerst, sie fangen die Pfeile der Türme ab. Den Kriegsschrei im Dorf auslösen.' : '');
  $('ergBeute').innerHTML = BEUTE.filter(k => r.beute[k]).map(k => `<span>${BEUTE_BILD[k]} ${r.beute[k]} ${BEUTE_NAME[k]}</span>`).join('');
  $('ergebnis').classList.add('an');
}
$('los').addEventListener('click', () => starte()); $('nochmal').addEventListener('click', () => starte());
const zeichneTon = () => { $('sTon').textContent = 'Ton: ' + (stand.ton ? 'an' : 'aus'); };
$('sTon').addEventListener('click', () => { stand.ton = !stand.ton; speicher.schreib('ton', stand.ton ? '1' : '0'); zeichneTon(); });

const uhr = new THREE.Clock();
function schritt(r) { // ein Rechenschritt samt allem, was davor an Eingaben fällig ist
  const bot = app.bot; if (bot) while (bot.i < bot.plan.length && bot.plan[bot.i].tick <= r.tick) { const e = bot.plan[bot.i++]; if (e.art === 'setze') absetzenWelt(e.typ, e.x, e.z); else if (e.art === 'schrei') schreie(); }
  for (const f of r.figuren) { f.px = f.x; f.pz = f.z; }
  r.step(); for (const e of r.ereignisse) fx(e);
}
function bild() {
  requestAnimationFrame(bild); const echt = Math.min(0.1, uhr.getDelta()); zeit += echt; const r = app.r;
  if (r && app.läuft) {
    if (!grafik.mess.fertig && !r.fertig) { const g = grafik.mess; g.t += echt; g.n++; if (g.t >= 4) { g.fertig = true; const stufe = g.n / g.t < 40 ? 'sparsam' : 'hoch'; speicher.schreib('grafikAuto', stufe); if (stufe !== grafik.stufe) setzeGrafik(stufe); } }
    const h = eingabe.halten; if (h && !r.fertig) { h.t += echt; if (h.t >= 0.2) { h.t = 0; if (!absetzen(h.x, h.y)) eingabe.halten = null; } }
    app.rest += echt * app.tempo; let n = 0; while (app.rest >= DT && n++ < 90) { app.rest -= DT; if (!r.fertig) schritt(r); }
  }
  if (r) { const anteil = r.fertig ? 1 : klemme(app.rest / DT, 0, 1);
    for (const f of r.figuren) { let s = app.figBild.get(f.id); if (!s) { s = baueFigur(f); app.figBild.set(f.id, s); } if (s.grp.visible) zeigeFigur(s, f, echt, anteil, r); }
    r.bauten.forEach((b, i) => zeigeBau(app.bauBild[i], b, echt)); zeigeAnzeige(); }
  // Strand leuchtet, solange man absetzen kann; rot, wenn daneben getippt wurde
  const kann = r && app.läuft && !r.fertig && r.rest() > 0, z = zone.userData; z.rot = Math.max(0, z.rot - echt);
  zone.material.color.setHex(z.rot > 0 ? 0xff5a4a : 0xffd27a); zone.material.opacity = z.rot > 0 ? 0.35 : kann ? 0.1 + 0.06 * Math.sin(zeit * 4) : 0; zoneRand.material.opacity = kann ? 0.55 : 0;
  bewegeTeile(echt);
  wackel = Math.max(0, wackel - echt * 1.6); setzeKamera(wackel ? (Math.random() - 0.5) * wackel : 0, wackel ? (Math.random() - 0.5) * wackel : 0);
  renderer.render(scene, camera);
}

async function init() {
  app.r = new Raubzug(1); maleBoden(app.r.bauten); baueKulisse(); setzeGrafik(grafik.stufe); zeichneTon(); await ladeVorlagen();
  app.figBild = new Map(); app.bauBild = app.r.bauten.map(baueBau);   // Dorf schon hinter dem Startfenster zeigen
  renderer.compile(scene, camera); requestAnimationFrame(bild);
  $('meldung').textContent = fehlend.length ? 'Figuren nicht geladen, es geht mit Ersatzfiguren weiter.' : ''; $('los').disabled = false;
  VK.bereit = true; if (Q.has('start')) starte();
}
const VK = window.VK = { bereit: false, app, grafik, K, EINHEITEN, BAUTEN, TRUPPE, KARTEN, Raubzug, fehlend, starte, absetzenWelt, schreie, weltZuBild, setzeGrafik,
  info: () => { const r = app.r; return { läuft: app.läuft, zeit: r.zeit, tick: r.tick, fertig: r.fertig, grund: r.grund, runen: r.runen(), prozent: r.prozent(), karte: app.karte, vorrat: { ...r.vorrat },
    eigene: r.eigene().length, wachen: r.figuren.filter(f => f.team === 1 && f.zustand !== 'tot').length, schreiMoeglich: r.schreiMoeglich(), schreiAktiv: r.schrei.bis > r.zeit && !r.schrei.frei,
    bauten: r.bauten.map(b => ({ typ: b.typ, leben: b.leben, max: b.maxLeben, zerstoert: b.zerstoert })), beute: { ...r.beute } }; } };
init().catch(e => { console.error(e); $('meldung').textContent = 'Fehler beim Start: ' + e.message; });
