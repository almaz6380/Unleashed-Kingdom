// Macht aus dem großen Tripo-Export (Millionen Dreiecke, 4K-Texturen) mehrere Fassungen:
//   <name>-master.glb   1 Mio. Dreiecke, Texturen unverändert  → Vorlage im Repo (das Original ist zu groß für GitHub)
//   <name>-<n>k.glb     Fassungen fürs Spiel zum Vergleichen (ohne Skelett)
//   <name>-mixamo.glb   grobe Hilfsfigur, daraus macht obj-fuer-mixamo.mjs die ZIP für Mixamo
// Aufruf: node figur-stufen.mjs <gross.glb> <zielordner> <name>
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt, dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const [EIN, ZIEL, NAME = 'figur'] = process.argv.slice(2);
await MeshoptDecoder.ready; await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
fs.mkdirSync(ZIEL, { recursive: true });

const quelle = await io.read(EIN); await quelle.transform(dequantize());
const prim = quelle.getRoot().listMeshes()[0].listPrimitives()[0], mat = prim.getMaterial();
const P = new Float32Array(prim.getAttribute('POSITION').getArray()), N = new Float32Array(prim.getAttribute('NORMAL').getArray()),
  T = new Float32Array(prim.getAttribute('TEXCOORD_0').getArray()), I = new Uint32Array(prim.getIndices().getArray());
const bild = { farbe: mat.getBaseColorTexture(), normal: mat.getNormalTexture(), rm: mat.getMetallicRoughnessTexture() };
console.log('Quelle:', I.length / 3, 'Dreiecke,', P.length / 3, 'Punkte');

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

const NUR = process.argv[5];   // optional: nur 'mixamo' neu bauen
if (!NUR) {
  await schreibe(`${NAME}-master.glb`, vereinfache(1000000, 0.01, []), { farbe: 'roh', normal: 'roh', rm: 'roh' }, true);
  for (const [zahl, tx] of [[600000, { farbe: 4096, normal: 4096, rm: 2048 }], [250000, { farbe: 4096, normal: 2048, rm: 2048 }], [80000, { farbe: 2048, normal: 2048, rm: 1024 }]])
    await schreibe(`${NAME}-${zahl / 1000}k.glb`, vereinfache(zahl, 0.01, []), tx, true);
}
// Hilfsfigur für Mixamo, man sieht sie im Spiel nie. Ohne 'Permissive': über Textur-Nähte hinweg zu vereinfachen
// verschmiert die Textur, und der User sieht die Figur in Mixamo.
await schreibe(`${NAME}-mixamo.glb`, vereinfache(24000, 0.03, []), { farbe: 2048 }, false);
