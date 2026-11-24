// Macht aus dem Retopo-GLB eine OBJ mit Farb-Textur für den Mixamo-Auto-Rigger (ohne Skelett)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const [EIN, ZIEL, HOEHE] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(EIN), root = doc.getRoot();
fs.mkdirSync(ZIEL, { recursive: true });
const prim = root.listMeshes()[0].listPrimitives()[0];
const P = prim.getAttribute('POSITION').getArray(), N = prim.getAttribute('NORMAL').getArray(), T = prim.getAttribute('TEXCOORD_0').getArray(), I = prim.getIndices().getArray();
let minY = Infinity, maxY = -Infinity; for (let i = 1; i < P.length; i += 3) { minY = Math.min(minY, P[i]); maxY = Math.max(maxY, P[i]); }
const s = (+HOEHE || 170) / (maxY - minY);   // Größe in Zentimetern, wie Mixamo es erwartet
const z = ['mtllib knappe.mtl', 'o knappe'];
for (let i = 0; i < P.length; i += 3) z.push(`v ${(P[i] * s).toFixed(4)} ${((P[i + 1] - minY) * s).toFixed(4)} ${(P[i + 2] * s).toFixed(4)}`);
for (let i = 0; i < T.length; i += 2) z.push(`vt ${T[i].toFixed(6)} ${(1 - T[i + 1]).toFixed(6)}`);   // glTF zählt v von oben, OBJ von unten
for (let i = 0; i < N.length; i += 3) z.push(`vn ${N[i].toFixed(4)} ${N[i + 1].toFixed(4)} ${N[i + 2].toFixed(4)}`);
z.push('usemtl knappe', 's 1');
for (let i = 0; i < I.length; i += 3) { const a = I[i] + 1, b = I[i + 1] + 1, c = I[i + 2] + 1; z.push(`f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}`); }
fs.writeFileSync(path.join(ZIEL, 'knappe.obj'), z.join('\n') + '\n');
const farbe = root.listTextures().find(t => /BaseColor/i.test(t.getName()));
await sharp(Buffer.from(farbe.getImage())).resize(2048, 2048).jpeg({ quality: 90 }).toFile(path.join(ZIEL, 'knappe.jpg'));
fs.writeFileSync(path.join(ZIEL, 'knappe.mtl'), 'newmtl knappe\nKa 1 1 1\nKd 1 1 1\nKs 0 0 0\nd 1\nillum 1\nmap_Kd knappe.jpg\n');
console.log('Punkte', P.length / 3, 'Dreiecke', I.length / 3, 'Höhe', ((maxY - minY) * s).toFixed(1));
