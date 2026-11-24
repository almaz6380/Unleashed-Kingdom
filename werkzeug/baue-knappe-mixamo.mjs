// Knappe aus Mixamo-Dateien: Figur + Skelett aus fight-idle, Bewegungen aus den anderen Dateien (zugeschnitten),
// Namen wie im Spiel (steh, lauf, schlag1–3, treffer, tod, rolle). Hüfte bleibt waagerecht an Ort und Stelle (ort: true),
// weil das Spiel die Figur selbst bewegt.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, textureCompress, resample } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'fs';
const [MX, AUS] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const TEILE = [
  { datei: 'fight-idle', name: 'steh', von: 0, bis: 99, ort: true },
  { datei: 'running', name: 'lauf', von: 0, bis: 99, ort: true },
  { datei: 'jab-cross', name: 'schlag1', von: 0.05, bis: 0.62, ort: true },
  { datei: 'jab-cross', name: 'schlag2', von: 0.45, bis: 1.10, ort: true },
  { datei: 'uppercut', name: 'schlag3', von: 0, bis: 1.0, ort: true },
  { datei: 'hit-reaction', name: 'treffer', von: 0.5, bis: 1.6, ort: true },
  { datei: 'dying', name: 'tod', von: 1.9, bis: 3.6, ort: false },
  { datei: 'roll', name: 'rolle', von: 0.05, bis: 1.12, ort: true },
];
const basis = await io.read(`${MX}/fight-idle.glb`), root = basis.getRoot();
const knoten = new Map(root.listNodes().map(n => [n.getName(), n]));
for (const a of root.listAnimations()) a.dispose();
const puffer = root.listBuffers()[0];
for (const t of TEILE) {
  const quelle = await io.read(`${MX}/${t.datei}.glb`), anim = quelle.getRoot().listAnimations()[0];
  const neu = basis.createAnimation(t.name);
  for (const k of anim.listChannels()) {
    const ziel = knoten.get(k.getTargetNode().getName()); if (!ziel) continue;
    const s = k.getSampler(), ein = s.getInput().getArray(), aus = s.getOutput().getArray(), n = s.getOutput().getElementSize();
    const idx = []; for (let i = 0; i < ein.length; i++) if (ein[i] >= t.von - 1e-4 && ein[i] <= t.bis + 1e-4) idx.push(i);
    if (!idx.length) continue;
    const zeiten = new Float32Array(idx.map(i => ein[i] - ein[idx[0]])), werte = new Float32Array(idx.length * n);
    idx.forEach((i, j) => { for (let c = 0; c < n; c++) werte[j * n + c] = aus[i * n + c]; });
    if (t.ort && k.getTargetPath() === 'translation' && /Hips$/.test(ziel.getName())) { const r = ziel.getTranslation();
      for (let j = 0; j < idx.length; j++) { werte[j * 3] = r[0]; werte[j * 3 + 2] = r[2]; } }
    const sm = basis.createAnimationSampler().setInterpolation(s.getInterpolation())
      .setInput(basis.createAccessor().setType('SCALAR').setArray(zeiten).setBuffer(puffer))
      .setOutput(basis.createAccessor().setType(s.getOutput().getType()).setArray(werte).setBuffer(puffer));
    neu.addSampler(sm).addChannel(basis.createAnimationChannel().setTargetNode(ziel).setTargetPath(k.getTargetPath()).setSampler(sm));
  }
  console.log(t.name, neu.listChannels().length, 'Kanäle', Math.max(...neu.listSamplers().map(s => s.getInput().getMax([])[0])).toFixed(2), 's');
}
for (const m of root.listMaterials()) m.setNormalTexture(null).setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null).setMetallicFactor(0).setRoughnessFactor(0.85);
await basis.transform(resample(), dedup(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 85 }));
await io.write(AUS, basis);
console.log('fertig', (fs.statSync(AUS).size / 1024).toFixed(0) + ' kB');
