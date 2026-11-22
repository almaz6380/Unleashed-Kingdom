// Bereitet die Platzhalter-Kämpfer auf (Quaternius „RPG Characters – Nov 2020“, CC0).
// Vorher jede FBX-Datei mit dem npm-Paket fbx2gltf nach GLB wandeln.
// Aufruf: node baue-figuren.mjs <Ordner mit Monk.glb, Rogue.glb, Warrior.glb> <Ordner mit Texturen> <Ziel>
// Ergebnis je Figur eine GLB mit einheitlichen Animationsnamen: steh, lauf, schlag1, schlag2, treffer, tod, rolle
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { unpartition, dedup, prune, textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const [GLB, TEX, OUT] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const FIGUREN = {
  moench: { datei: 'Monk', haut: 'Monk_Texture.png', anim: { Idle: 'steh', Run: 'lauf', Attack: 'schlag1', Attack2: 'schlag2', RecieveHit: 'treffer', Death: 'tod', Roll: 'rolle' } },
  schurkin: { datei: 'Rogue', haut: 'Rogue_Texture.png', waffe: 'Rogue_Dagger_Texture.png', anim: { Idle: 'steh', Run: 'lauf', Dagger_Attack: 'schlag1', Dagger_Attack2: 'schlag2', RecieveHit: 'treffer', Death: 'tod', Roll: 'rolle' } },
  krieger: { datei: 'Warrior', haut: 'Warrior_Texture.png', waffe: 'Warrior_Sword_Texture.png', anim: { Idle: 'steh', Run: 'lauf', Sword_AttackFast: 'schlag1', Sword_Attack: 'schlag2', RecieveHit: 'treffer', Death: 'tod', Roll: 'rolle' } },
};
for (const [name, f] of Object.entries(FIGUREN)) {
  const doc = await io.read(path.join(GLB, f.datei + '.glb'));
  for (const a of doc.getRoot().listAnimations()) { const n = a.getName().split('|').pop(); if (f.anim[n]) a.setName(f.anim[n]); else a.dispose(); }
  const tex = d => doc.createTexture(d).setImage(fs.readFileSync(path.join(TEX, d))).setMimeType('image/png');
  const haut = tex(f.haut), waffe = f.waffe ? tex(f.waffe) : haut;
  for (const m of doc.getRoot().listMaterials())
    m.setBaseColorTexture(/dagger|sword|staff|bow/i.test(m.getName()) ? waffe : haut).setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.85).setMetallicFactor(0);
  await doc.transform(unpartition(), dedup(), prune(), textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [512, 512], quality: 85 }));
  const ziel = path.join(OUT, name + '.glb'); await io.write(ziel, doc);
  console.log(name, (fs.statSync(ziel).size / 1024).toFixed(0) + ' kB', doc.getRoot().listAnimations().map(a => a.getName() + ':' + Math.max(...a.listSamplers().map(s => s.getInput().getMax([])[0])).toFixed(2)).join(' '));
}
