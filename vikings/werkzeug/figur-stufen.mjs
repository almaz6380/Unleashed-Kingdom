// Macht aus dem großen Tripo-Export (Millionen Dreiecke, 4K-Texturen) mehrere Fassungen:
//   <name>-master.glb   1 Mio. Dreiecke, Texturen unverändert  → Vorlage im Repo, nur wenn das Original zu groß für
//                       GitHub ist (über 90 MB) oder mit --master. Sonst wird das Original selbst aufgehoben.
//   <name>-<n>k.glb     Fassungen fürs Spiel zum Vergleichen (ohne Skelett)
//   <name>-mixamo.glb   grobe Hilfsfigur, daraus macht obj-fuer-mixamo.mjs die ZIP für Mixamo
// Alle Fassungen schauen nach +z und stehen auf y = 0. Tripo liefert das nicht immer so (die Handy-App dreht die Figur
// zur Seite und legt die Mitte in den Ursprung): Die Blickrichtung wird erkannt (Arme = breitere waagerechte Achse,
// vorn = wohin die Fußspitzen zeigen) und lässt sich mit --dreh=<Grad um y> vorgeben. Immer am Bild nachprüfen.
// Aufruf: node figur-stufen.mjs <gross.glb> <zielordner> <name> [mixamo] [--dreh=<Grad>] [--master]
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const OPT = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => { const [k, v = '1'] = a.slice(2).split('='); return [k, v]; }));
const [EIN, ZIEL, NAME = 'figur', NUR] = process.argv.slice(2).filter(a => !a.startsWith('--'));   // NUR: 'mixamo' baut nur die Hilfsfigur neu
await MeshoptDecoder.ready; await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
fs.mkdirSync(ZIEL, { recursive: true });

const quelle = await io.read(EIN); await quelle.transform(dequantize());
const prim = quelle.getRoot().listMeshes()[0].listPrimitives()[0], mat = prim.getMaterial();
const P = new Float32Array(prim.getAttribute('POSITION').getArray()), N = new Float32Array(prim.getAttribute('NORMAL').getArray()),
  T = new Float32Array(prim.getAttribute('TEXCOORD_0').getArray()), I = new Uint32Array(prim.getIndices().getArray());
const bild = { farbe: mat.getBaseColorTexture(), normal: mat.getNormalTexture(), rm: mat.getMetallicRoughnessTexture() };
console.log('Quelle:', I.length / 3, 'Dreiecke,', P.length / 3, 'Punkte');

// ---------- Ausrichtung: Blick nach +z, Füße auf y = 0 ----------
const g = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
for (let i = 0; i < P.length; i += 3) for (let c = 0; c < 3; c++) { g[c] = Math.min(g[c], P[i + c]); g[c + 3] = Math.max(g[c + 3], P[i + c]); }
const hoehe = g[4] - g[1];
let dreh = OPT.dreh !== undefined ? +OPT.dreh : null;
if (dreh === null) {
  const armeAufZ = g[5] - g[2] > g[3] - g[0], a = armeAufZ ? 0 : 2;   // a: Achse, entlang der die Figur schaut
  let zehen = 0, nz = 0, knoechel = 0, nk = 0;
  for (let i = 0; i < P.length; i += 3) { const h = (P[i + 1] - g[1]) / hoehe; if (h < 0.03) { zehen += P[i + a]; nz++; } else if (h > 0.06 && h < 0.1) { knoechel += P[i + a]; nk++; } }
  const vorn = zehen / nz >= knoechel / nk ? 1 : -1;
  dreh = armeAufZ ? (vorn > 0 ? -90 : 90) : (vorn > 0 ? 0 : 180);
  console.log(`Ausrichtung erkannt: Arme entlang ${armeAufZ ? 'z' : 'x'}, Fußspitzen ${((zehen / nz - knoechel / nk) / hoehe * 100).toFixed(1)} % der Höhe vor dem Knöchel`);
}
{ const w = dreh * Math.PI / 180, co = Math.cos(w), si = Math.sin(w);
  for (const A of [P, N]) for (let i = 0; i < A.length; i += 3) { const x = A[i], z = A[i + 2]; A[i] = x * co + z * si; A[i + 2] = -x * si + z * co; }
  for (let i = 1; i < P.length; i += 3) P[i] -= g[1]; }
console.log(`gedreht um ${dreh}°, auf den Boden gestellt (um ${(-g[1]).toFixed(3)} gehoben), Höhe ${hoehe.toFixed(3)}`);

function vereinfache(soll, fehler, flags) {
  const t0 = performance.now();
  const [idx, err] = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, N, 3, [0.5, 0.5, 0.5], null, soll * 3, fehler, flags);
  // nur die noch benutzten Punkte behalten
  const neu = new Int32Array(P.length / 3).fill(-1); let n = 0; const I2 = new Uint32Array(idx.length);
  for (let i = 0; i < idx.length; i++) { const v = idx[i]; if (neu[v] < 0) neu[v] = n++; I2[i] = neu[v]; }
  const P2 = new Float32Array(n * 3), N2 = new Float32Array(n * 3), T2 = new Float32Array(n * 2);
  for (let v = 0; v < neu.length; v++) { const k = neu[v]; if (k < 0) continue; P2.set(P.subarray(v * 3, v * 3 + 3), k * 3); N2.set(N.subarray(v * 3, v * 3 + 3), k * 3); T2.set(T.subarray(v * 2, v * 2 + 2), k * 2); }
  console.log(`  ${soll} gewünscht → ${I2.length / 3} Dreiecke, ${n} Punkte, Abweichung ${(err * 1000).toFixed(2)} mm je Meter, ${((performance.now() - t0) / 1000).toFixed(1)} s`);
  return { P: P2, N: N2, T: T2, I: I2 };
}

// texturen: { farbe: 4096 | 2048 | 'roh', normal: ..., rm: ... }; fehlt ein Eintrag, kommt die Karte nicht mit
async function schreibe(datei, netz, texturen, packen) {
  const doc = new Document(), buf = doc.createBuffer(), acc = (typ, arr) => doc.createAccessor().setType(typ).setArray(arr).setBuffer(buf);
  const m = doc.createMaterial(NAME).setRoughnessFactor(texturen.rm ? 1 : 0.85).setMetallicFactor(texturen.rm ? 1 : 0);
  const tex = async (art, format) => { const g = texturen[art], q = bild[art]; if (!g || !q) return null;
    if (g === 'roh') return doc.createTexture(art).setImage(q.getImage()).setMimeType(q.getMimeType());
    const s = sharp(Buffer.from(q.getImage())).resize(g, g);
    return format === 'jpeg' ? doc.createTexture(art).setImage(await s.jpeg({ quality: 90 }).toBuffer()).setMimeType('image/jpeg')
      : doc.createTexture(art).setImage(await s.webp({ quality: art === 'normal' ? 92 : 88 }).toBuffer()).setMimeType('image/webp'); };
  const format = packen ? 'webp' : 'jpeg';
  const f = await tex('farbe', format), nm = await tex('normal', format), rm = await tex('rm', format);
  if (f) m.setBaseColorTexture(f); if (nm) m.setNormalTexture(nm); if (rm) m.setMetallicRoughnessTexture(rm);
  const p = doc.createPrimitive().setAttribute('POSITION', acc('VEC3', netz.P)).setAttribute('NORMAL', acc('VEC3', netz.N)).setAttribute('TEXCOORD_0', acc('VEC2', netz.T)).setIndices(acc('SCALAR', netz.I)).setMaterial(m);
  doc.createScene(NAME).addChild(doc.createNode(NAME).setMesh(doc.createMesh(NAME).addPrimitive(p)));
  if (packen) await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const ziel = path.join(ZIEL, datei); await io.write(ziel, doc);
  console.log(`    ${datei}: ${(fs.statSync(ziel).size / 1024 / 1024).toFixed(1)} MB`);
}

if (!NUR) {
  if (OPT.master || fs.statSync(EIN).size > 90e6) await schreibe(`${NAME}-master.glb`, vereinfache(1000000, 0.01, []), { farbe: 'roh', normal: 'roh', rm: 'roh' }, true);
  for (const [zahl, tx] of [[600000, { farbe: 4096, normal: 4096, rm: 2048 }], [250000, { farbe: 4096, normal: 2048, rm: 2048 }], [80000, { farbe: 2048, normal: 2048, rm: 1024 }]])
    await schreibe(`${NAME}-${zahl / 1000}k.glb`, vereinfache(zahl, 0.01, []), tx, true);
}
// Hilfsfigur für Mixamo, man sieht sie im Spiel nie. Ohne 'Permissive': über Textur-Nähte hinweg zu vereinfachen
// verschmiert die Textur, und der User sieht die Figur in Mixamo.
await schreibe(`${NAME}-mixamo.glb`, vereinfache(24000, 0.03, []), { farbe: 2048 }, false);
