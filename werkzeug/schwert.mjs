import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'fs';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]), P = doc.getRoot().listMeshes()[0].listPrimitives()[0].getAttribute('POSITION').getArray();
const breite = new Array(20).fill(0);
for (let i = 0; i < P.length; i += 3) { const k = Math.min(19, Math.floor(P[i + 1] / 0.976 * 20)); breite[k] = Math.max(breite[k], Math.abs(P[i])); }
console.log('Breite je Zwanzigstel von unten:', breite.map(b => b.toFixed(3)).join(' '));
for (const m of doc.getRoot().listMaterials()) m.setNormalTexture(null).setMetallicRoughnessTexture(null).setOcclusionTexture(null).setMetallicFactor(0).setRoughnessFactor(0.8);
await doc.transform(dedup(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048], quality: 86 }));
await io.write(process.argv[3], doc); console.log('fertig', (fs.statSync(process.argv[3]).size / 1024).toFixed(0), 'kB');
