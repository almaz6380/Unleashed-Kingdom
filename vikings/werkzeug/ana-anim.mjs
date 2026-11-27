// Wie verläuft eine Mixamo-Bewegung? Lage von Hüfte, Kopf und Händen je Bild. Aufruf: node ana-anim.mjs <datei.glb> [jedes n-te Bild]
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]), root = doc.getRoot(), anim = root.listAnimations()[0], jedes = +process.argv[3] || 2;
const kan = new Map();   // Knoten → { translation, rotation, scale: sampler }
let zeiten = null;
for (const k of anim.listChannels()) { const n = k.getTargetNode(); if (!kan.has(n)) kan.set(n, {}); kan.get(n)[k.getTargetPath()] = k.getSampler(); const t = k.getSampler().getInput().getArray(); if (!zeiten || t.length > zeiten.length) zeiten = t; }
const wert = (s, t, n) => { const ein = s.getInput().getArray(), aus = s.getOutput().getArray(); let i = 0; while (i < ein.length - 1 && ein[i + 1] <= t) i++; return Array.from(aus.subarray(i * n, i * n + n)); };
const mul = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
const trs = (t, q, s) => { const [x, y, z, w] = q, [sx, sy, sz] = s; return [
  (1 - 2 * (y * y + z * z)) * sx, (2 * (x * y + z * w)) * sx, (2 * (x * z - y * w)) * sx, 0,
  (2 * (x * y - z * w)) * sy, (1 - 2 * (x * x + z * z)) * sy, (2 * (y * z + x * w)) * sy, 0,
  (2 * (x * z + y * w)) * sz, (2 * (y * z - x * w)) * sz, (1 - 2 * (x * x + y * y)) * sz, 0, t[0], t[1], t[2], 1]; };
const eltern = new Map(); for (const n of root.listNodes()) for (const c of n.listChildren()) eltern.set(c, n);
function welt(n, t) { const k = kan.get(n) ?? {};
  const m = trs(k.translation ? wert(k.translation, t, 3) : n.getTranslation(), k.rotation ? wert(k.rotation, t, 4) : n.getRotation(), k.scale ? wert(k.scale, t, 3) : n.getScale());
  const e = eltern.get(n); return e ? mul(welt(e, t), m) : m; }
const finde = name => root.listNodes().find(n => n.getName().endsWith(name));
const teile = { Hüfte: finde('Hips'), Kopf: finde('Head'), RHand: finde('RightHand'), LHand: finde('LeftHand'), RFuss: finde('RightFoot'), LFuss: finde('LeftFoot') };
console.log(`${zeiten.length} Bilder, ${zeiten[zeiten.length - 1].toFixed(2)} s`);
console.log('  Zeit   ' + Object.keys(teile).map(n => (n + ' x/y/z').padEnd(22)).join(''));
for (let i = 0; i < zeiten.length; i += jedes) { const t = zeiten[i];
  console.log(t.toFixed(2).padStart(6) + '   ' + Object.values(teile).map(n => { const m = welt(n, t); return `${m[12].toFixed(2)} ${m[13].toFixed(2)} ${m[14].toFixed(2)}`.padEnd(22); }).join('')); }
