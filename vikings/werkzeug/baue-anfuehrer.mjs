// Baut den Anführer fürs Spiel: Skelett und Bewegungen aus Mixamo, feines Netz und Texturen aus dem Tripo-Export.
//   1. Skelett aus der ersten Mixamo-Datei (mit „With Skin“ geladen), Bewegungen aus allen Dateien, zugeschnitten und
//      benannt wie im Spiel. Die Hüfte bleibt waagerecht an Ort und Stelle (ort: true), weil das Spiel die Figur bewegt.
//   2. Das grobe Mixamo-Netz wird durch die feine Fassung ersetzt. Jeder feine Punkt übernimmt die Skelett-Gewichte
//      der 4 nächsten groben Punkte, nach Nähe gemischt.
// Vorher jede FBX umwandeln:  FBX2glTF --binary --input <x.fbx> --output <ordner>/<x>
// Aufruf: node baue-anfuehrer.mjs <ordner mit den Mixamo-GLB> <feine Fassung.glb> <ziel.glb>
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, resample, dequantize, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [MX, FEIN, ZIEL] = process.argv.slice(2);
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });

const BASIS = 'breathing-idle';
// von/bis in Sekunden. Fehlt eine Datei, wird die Bewegung ausgelassen.
// ort: true   = Hüfte bleibt waagerecht an Ort und Stelle (das Spiel bewegt die Figur)
// ort: 'start' = die Bewegung beginnt an Ort und Stelle und darf sich von dort entfernen (Fallen)
// nur: 'oben' = nur Oberkörper, Arme und Kopf; so lässt sich die Bewegung über Laufen oder Kämpfen legen
// Gemessen mit ana-anim (Lage der Hände je Bild): Hieb von oben trifft bei 0,83 s, Hieb seitlich bei 0,88 s der
// Mixamo-Datei. Beide sind so geschnitten, dass der Treffer 0,33 s nach Beginn sitzt.
const TEILE = [
  { datei: 'breathing-idle', name: 'steh', von: 0, bis: 99, ort: true },
  { datei: 'running', name: 'lauf', von: 0, bis: 99, ort: true },
  { datei: 'attack-downward', name: 'schlag1', von: 0.5, bis: 1.2, ort: true },
  { datei: 'attack-horizontal', name: 'schlag2', von: 0.55, bis: 1.25, ort: true },
  { datei: 'battlecry', name: 'schrei', von: 0.1, bis: 2.2, ort: true, nur: 'oben' },
  { datei: 'walking-to-dying', name: 'tod', von: 1.0, bis: 2.6, ort: 'start' },
];
const OBEN = /Spine|Neck|Head|Shoulder|Arm|Hand/;

// ---------- 1. Skelett und Bewegungen ----------
const basis = await io.read(`${MX}/${BASIS}.glb`), root = basis.getRoot();
const knoten = new Map(root.listNodes().map(n => [n.getName(), n]));
for (const a of root.listAnimations()) a.dispose();
const puffer = root.listBuffers()[0];
for (const t of TEILE) {
  const pfad = `${MX}/${t.datei}.glb`; if (!fs.existsSync(pfad)) { console.log(`  ${t.name}: ${t.datei} fehlt noch`); continue; }
  const anim = (await io.read(pfad)).getRoot().listAnimations()[0], neu = basis.createAnimation(t.name);
  for (const k of anim.listChannels()) {
    const ziel = knoten.get(k.getTargetNode().getName()); if (!ziel || (t.nur === 'oben' && !OBEN.test(ziel.getName()))) continue;
    const s = k.getSampler(), ein = s.getInput().getArray(), aus = s.getOutput().getArray(), n = s.getOutput().getElementSize();
    const idx = []; for (let i = 0; i < ein.length; i++) if (ein[i] >= t.von - 1e-4 && ein[i] <= t.bis + 1e-4) idx.push(i);
    if (!idx.length) continue;
    const zeiten = new Float32Array(idx.map(i => ein[i] - ein[idx[0]])), werte = new Float32Array(idx.length * n);
    idx.forEach((i, j) => { for (let c = 0; c < n; c++) werte[j * n + c] = aus[i * n + c]; });
    if (t.ort && k.getTargetPath() === 'translation' && /Hips$/.test(ziel.getName())) { const r = ziel.getTranslation(), x0 = werte[0] - r[0], z0 = werte[2] - r[2];
      for (let j = 0; j < idx.length; j++) { if (t.ort === 'start') { werte[j * 3] -= x0; werte[j * 3 + 2] -= z0; } else { werte[j * 3] = r[0]; werte[j * 3 + 2] = r[2]; } } }
    const sm = basis.createAnimationSampler().setInterpolation(s.getInterpolation())
      .setInput(basis.createAccessor().setType('SCALAR').setArray(zeiten).setBuffer(puffer))
      .setOutput(basis.createAccessor().setType(s.getOutput().getType()).setArray(werte).setBuffer(puffer));
    neu.addSampler(sm).addChannel(basis.createAnimationChannel().setTargetNode(ziel).setTargetPath(k.getTargetPath()).setSampler(sm));
  }
  console.log(`  ${t.name}: ${neu.listChannels().length} Kanäle, ${Math.max(...neu.listSamplers().map(s => s.getInput().getMax([])[0])).toFixed(2)} s`);
}

// ---------- 2. Feines Netz mit den Gewichten des groben ----------
const bp = root.listMeshes()[0].listPrimitives()[0];
const BP = bp.getAttribute('POSITION').getArray(), BJ = bp.getAttribute('JOINTS_0').getArray(), BW = bp.getAttribute('WEIGHTS_0').getArray(), nb = BP.length / 3;
let bMinY = Infinity, bMaxY = -Infinity; for (let i = 1; i < BP.length; i += 3) { bMinY = Math.min(bMinY, BP[i]); bMaxY = Math.max(bMaxY, BP[i]); }
const fein = await io.read(FEIN); await fein.transform(dequantize());
const fp = fein.getRoot().listMeshes()[0].listPrimitives()[0], fm = fp.getMaterial();
const FP = fp.getAttribute('POSITION').getArray(), FN = fp.getAttribute('NORMAL').getArray(), FT = fp.getAttribute('TEXCOORD_0').getArray(), FI = fp.getIndices().getArray(), nf = FP.length / 3;
let fMinY = Infinity, fMaxY = -Infinity; for (let i = 1; i < FP.length; i += 3) { fMinY = Math.min(fMinY, FP[i]); fMaxY = Math.max(fMaxY, FP[i]); }
const s = (bMaxY - bMinY) / (fMaxY - fMinY);      // gleiche Größe wie die Mixamo-Figur; beide schauen nach +z
// Raster für die Suche nach nahen Punkten
const Z = 0.03, raster = new Map();
for (let i = 0; i < nb; i++) { const k = `${Math.floor(BP[i * 3] / Z)},${Math.floor(BP[i * 3 + 1] / Z)},${Math.floor(BP[i * 3 + 2] / Z)}`; (raster.get(k) ?? raster.set(k, []).get(k)).push(i); }
function nahe(x, y, z, n) { const cx = Math.floor(x / Z), cy = Math.floor(y / Z), cz = Math.floor(z / Z); let best = [];
  for (let r = 1; r <= 6 && best.length < n; r++) { best = [];
    for (let a = -r; a <= r; a++) for (let b = -r; b <= r; b++) for (let c = -r; c <= r; c++) { const l = raster.get(`${cx + a},${cy + b},${cz + c}`); if (!l) continue;
      for (const i of l) best.push([(BP[i * 3] - x) ** 2 + (BP[i * 3 + 1] - y) ** 2 + (BP[i * 3 + 2] - z) ** 2, i]); } }
  return best.sort((p, q) => p[0] - q[0]).slice(0, n); }
const P = new Float32Array(nf * 3), J = new Uint16Array(nf * 4), W = new Float32Array(nf * 4); let weit = 0, summeAbstand = 0;
for (let i = 0; i < nf; i++) {
  const x = FP[i * 3] * s, y = (FP[i * 3 + 1] - fMinY) * s + bMinY, z = FP[i * 3 + 2] * s; P[i * 3] = x; P[i * 3 + 1] = y; P[i * 3 + 2] = z;
  const nah = nahe(x, y, z, 4); if (!nah.length) { weit++; W[i * 4] = 1; continue; }
  const d0 = Math.sqrt(nah[0][0]); summeAbstand += d0; if (d0 > 0.03) weit++;
  const summe = new Map();
  for (const [d2, j] of nah) { const g = 1 / (Math.sqrt(d2) + 0.002); for (let c = 0; c < 4; c++) { const w = BW[j * 4 + c]; if (w > 0) summe.set(BJ[j * 4 + c], (summe.get(BJ[j * 4 + c]) ?? 0) + w * g); } }
  const top = [...summe].sort((a, b) => b[1] - a[1]).slice(0, 4), ges = top.reduce((a, b) => a + b[1], 0) || 1;
  top.forEach(([k, w], c) => { J[i * 4 + c] = k; W[i * 4 + c] = w / ges; });
}
console.log(`  feines Netz: ${FI.length / 3} Dreiecke, ${nf} Punkte · mittlerer Abstand zur groben Figur ${(summeAbstand / nf * 1000).toFixed(1)} mm · weiter als 3 cm entfernt: ${weit}`);

const acc = (typ, arr) => basis.createAccessor().setType(typ).setArray(arr).setBuffer(puffer);
for (const sem of bp.listSemantics()) bp.setAttribute(sem, null);
bp.setAttribute('POSITION', acc('VEC3', P)).setAttribute('NORMAL', acc('VEC3', new Float32Array(FN))).setAttribute('TEXCOORD_0', acc('VEC2', new Float32Array(FT)))
  .setAttribute('JOINTS_0', acc('VEC4', J)).setAttribute('WEIGHTS_0', acc('VEC4', W)).setIndices(acc('SCALAR', new Uint32Array(FI)));
// Material und Texturen der feinen Fassung übernehmen
const kopie = t => t ? basis.createTexture(t.getName()).setImage(t.getImage()).setMimeType(t.getMimeType()) : null;
const m = bp.getMaterial().setName('anfuehrer').setBaseColorFactor([1, 1, 1, 1]).setBaseColorTexture(kopie(fm.getBaseColorTexture())).setNormalTexture(kopie(fm.getNormalTexture()))
  .setMetallicRoughnessTexture(kopie(fm.getMetallicRoughnessTexture())).setOcclusionTexture(null).setEmissiveTexture(null).setEmissiveFactor([0, 0, 0])
  .setMetallicFactor(fm.getMetallicFactor()).setRoughnessFactor(fm.getRoughnessFactor());
await basis.transform(resample(), dedup(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(ZIEL, basis);
console.log(`  fertig: ${ZIEL} ${(fs.statSync(ZIEL).size / 1024 / 1024).toFixed(1)} MB, Bewegungen: ${root.listAnimations().map(a => a.getName()).join(', ')}`);
