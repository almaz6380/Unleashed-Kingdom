// Umgebungslicht für die eigenen Figuren: ein kleiner gemalter Raum (heller Himmel, dunkler Boden, zwei Lichtflächen).
// Daraus spiegeln sich Leder, Fell und Metall. Wirkt nur auf Figuren mit ihrem eigenen Material (MeshStandardMaterial);
// die Platzhalter mit einfachem Licht (Lambert) bleiben, wie sie sind.
import * as THREE from 'three';

export function umgebung(renderer) {
  const raum = new THREE.Scene(), kugel = new THREE.SphereGeometry(20, 32, 16), farben = [];
  const p = kugel.attributes.position, oben = new THREE.Color(0xbfd6ee), mitte = new THREE.Color(0x8a94a0), unten = new THREE.Color(0x3a3630), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { const h = p.getY(i) / 20; c.copy(mitte).lerp(h > 0 ? oben : unten, Math.min(1, Math.abs(h) * 1.6)); farben.push(c.r, c.g, c.b); }
  kugel.setAttribute('color', new THREE.Float32BufferAttribute(farben, 3));
  raum.add(new THREE.Mesh(kugel, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const flaeche = (farbe, staerke, x, y, z, g) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(g, g), new THREE.MeshBasicMaterial({ color: new THREE.Color(farbe).multiplyScalar(staerke), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 1, 0); raum.add(m); };
  flaeche(0xfff0d8, 9, -7, 9, 8, 7); flaeche(0xbcd4ff, 4, 9, 5, -6, 6);
  const pm = new THREE.PMREMGenerator(renderer), textur = pm.fromScene(raum, 0.03).texture; pm.dispose(); return textur;
}
