// Knappe in mittlerer Qualität: feines Netz aus dem großen Tripo-Export, Skelett-Gewichte von der Mixamo-Figur übernommen.
// Aufruf: node knappe-fein.mjs <knappe.glb mit Mixamo-Skelett+Bewegungen> <knappe-gross.glb> <Ziel.glb> [Dreiecke]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, dedup, prune, textureCompress } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'fs';
const [BASIS, FEIN, ZIEL, ZAHL] = process.argv.slice(2), soll = +ZAHL || 80000;
await MeshoptDecoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });

// 1. Feines Netz vereinfachen
const fein = await io.read(FEIN), fp0 = fein.getRoot().listMeshes()[0].listPrimitives()[0];
const vorher = fp0.getIndices().getCount() / 3;
await fein.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: soll / vorher, error: 0.002, lockBorder: true }));
const fp = fein.getRoot().listMeshes()[0].listPrimitives()[0];
const FP = fp.getAttribute('POSITION').getArray(), FN = fp.getAttribute('NORMAL').getArray(), FT = fp.getAttribute('TEXCOORD_0').getArray(), FI = fp.getIndices().getArray();
console.log('feines Netz', vorher, '→', FI.length / 3, 'Dreiecke,', FP.length / 3, 'Punkte');

// 2. Grobe Mixamo-Figur (Ziel-Raum, mit Gewichten)
const basis = await io.read(BASIS), bp = basis.getRoot().listMeshes()[0].listPrimitives()[0];
const BP = bp.getAttribute('POSITION').getArray(), BJ = bp.getAttribute('JOINTS_0').getArray(), BW = bp.getAttribute('WEIGHTS_0').getArray(), nb = BP.length / 3;
// Raster für die Suche nach nahen Punkten
const Z = 0.03, raster = new Map(), schl = (x, y, z) => `${Math.floor(x / Z)},${Math.floor(y / Z)},${Math.floor(z / Z)}`;
for (let i = 0; i < nb; i++) { const k = schl(BP[i * 3], BP[i * 3 + 1], BP[i * 3 + 2]); (raster.get(k) ?? raster.set(k, []).get(k)).push(i); }
function nahe(x, y, z, n) { const cx = Math.floor(x / Z), cy = Math.floor(y / Z), cz = Math.floor(z / Z); let best = [];
  for (let r = 1; r <= 6 && best.length < n; r++) { best = [];
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) for (let c = -r; c <= r; c++) { const l = raster.get(`${cx + a},${cy + b},${cz + c}`); if (!l) continue;
      for (const i of l) best.push([(BP[i * 3] - x) ** 2 + (BP[i * 3 + 1] - y) ** 2 + (BP[i * 3 + 2] - z) ** 2, i]); } }
  return best.sort((p, q) => p[0] - q[0]).slice(0, n); }

// 3. Feines Netz in den Raum der Mixamo-Figur bringen: 90° drehen (zwei Richtungen testen), auf 1,70 m, Füße auf 0
let minY = Infinity, maxY = -Infinity; for (let i = 1; i < FP.length; i += 3) { minY = Math.min(minY, FP[i]); maxY = Math.max(maxY, FP[i]); }
const s = 1.7 / (maxY - minY);
const varianten = { A: (x, y, z) => [-z, y, x], B: (x, y, z) => [z, y, -x] };
let wahl = 'A', bestFehler = Infinity;
for (const [n, f] of Object.entries(varianten)) { let summe = 0, m = 0;
  for (let i = 0; i < FP.length / 3; i += 97) { const [x, y, z] = f(FP[i * 3] * s, (FP[i * 3 + 1] - minY) * s, FP[i * 3 + 2] * s); const t = nahe(x, y, z, 1)[0]; if (t) { summe += Math.sqrt(t[0]); m++; } else summe += 1; }
  const fehler = summe / Math.max(1, m); console.log('Drehung', n, 'mittlerer Abstand', (fehler * 100).toFixed(2), 'cm'); if (fehler < bestFehler) { bestFehler = fehler; wahl = n; } }
const dreh = varianten[wahl], nf = FP.length / 3, P = new Float32Array(nf * 3), N = new Float32Array(nf * 3), J = new Uint16Array(nf * 4), W = new Float32Array(nf * 4);
let weit = 0;
for (let i = 0; i < nf; i++) {
  const p = dreh(FP[i * 3] * s, (FP[i * 3 + 1] - minY) * s, FP[i * 3 + 2] * s), n = dreh(FN[i * 3], FN[i * 3 + 1], FN[i * 3 + 2]);
  P.set(p, i * 3); const l = Math.hypot(...n) || 1; N.set(n.map(v => v / l), i * 3);
  // 4. Gewichte: die 4 nächsten Punkte der groben Figur, nach Nähe gemischt, je Knochen zusammengezählt, die 4 stärksten
  const nah = nahe(p[0], p[1], p[2], 4); if (!nah.length) { weit++; continue; } if (Math.sqrt(nah[0][0]) > 0.05) weit++;
  const summe = new Map();
  for (const [d2, j] of nah) { const g = 1 / (Math.sqrt(d2) + 0.002); for (let c = 0; c < 4; c++) { const w = BW[j * 4 + c]; if (w > 0) summe.set(BJ[j * 4 + c], (summe.get(BJ[j * 4 + c]) ?? 0) + w * g); } }
  const top = [...summe].sort((a, b) => b[1] - a[1]).slice(0, 4), ges = top.reduce((a, b) => a + b[1], 0) || 1;
  top.forEach(([k, w], c) => { J[i * 4 + c] = k; W[i * 4 + c] = w / ges; });
}
console.log('gewählt', wahl, '· Punkte mit über 5 cm Abstand zur groben Figur:', weit);

// 5. Feines Netz in die Mixamo-Datei setzen (Skelett und Bewegungen bleiben)
const puffer = basis.getRoot().listBuffers()[0], acc = (typ, arr) => basis.createAccessor().setType(typ).setArray(arr).setBuffer(puffer);
for (const sem of bp.listSemantics()) bp.setAttribute(sem, null);
bp.setAttribute('POSITION', acc('VEC3', P)).setAttribute('NORMAL', acc('VEC3', N)).setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(FT)))
  .setAttribute('JOINTS_0', acc('VEC4', J)).setAttribute('WEIGHTS_0', acc('VEC4', W)).setIndices(acc('SCALAR', new Uint32Array(FI)));
const farbe = fein.getRoot().listMaterials()[0].getBaseColorTexture();
const tex = basis.createTexture('farbe').setImage(farbe.getImage()).setMimeType(farbe.getMimeType());
bp.getMaterial().setBaseColorTexture(tex);
await basis.transform(dedup(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048], quality: 86 }));
await io.write(ZIEL, basis);
console.log('fertig', (fs.statSync(ZIEL).size / 1024 / 1024).toFixed(2), 'MB');
