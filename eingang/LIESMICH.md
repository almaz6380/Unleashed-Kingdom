# Eingang: Bilder und 3D-Modelle des Users

Hier landen alle Ausgangsbilder (aus Gemini oder kie.ai) und alle 3D-Modelle (GLB aus Tripo). Alles wird
aufgehoben, auch Fassungen, die das Spiel gerade nicht nutzt. So lassen sich die Figuren später in anderen
Spielen wiederverwenden.

Hochladen am Handy: auf github.com das Repo öffnen, den Ordner `eingang` antippen, dann „Add file“ →
„Upload files“.

Namen (klein, mit Bindestrich):
- `knappe-niedlich.png` / `knappe-niedlich.glb`: Fassung A, für dieses Spiel
- `knappe-normal.png` / `knappe-normal.glb`: Fassung B, normale Körpermaße, für spätere Spiele
- später ebenso: `ritter-…`, `drachenritter-…`, `magierin-…`, `drache-…`

Schon da:
- `knappe-niedlich-mit-umhang.webp`: erstes Knappen-Bild (23.11.), Stil-Vorlage für alle weiteren Figuren
- `knappe-niedlich.webp`: Fassung A ohne Umhang (23.11.), für Tripo freigegeben
- `knappe-niedlich.fbx`: Fassung A aus Tripo nach Retopo (Quad, 10.000), etwa 18.600 Dreiecke, **noch ohne Skelett**.
  Kam per Google-Drive-Link (der Chat nimmt keine 3D-Dateien, GitHub-Upload nur bis 25 MB).
- `knappe-gross.glb`: Tripo-Export ohne Retopo (23.11.), 16 MB, 1,88 Mio. Dreiecke, Meshopt-gepackt, ohne Skelett.
  Wirkt schlanker als `knappe-niedlich` (vielleicht Fassung B, beim User nachfragen). Unverändert auch in `modelle/`.
- `knappe-rig.fbx`: schlanke Fassung nach Retopo (9.500 Punkte) mit **Skelett** (Tripo-Rig, Humanoid, Mixamo-Knochen,
  65 Knochen), ohne Bewegungen. **Die Farb-Textur fehlt in der FBX** (Tripo bettet sie nicht ein); sie wurde aus
  dem Retopo-Export ohne Skelett übernommen (gleiche Figur, gleiche UV). Daraus entsteht `modelle/knappe.glb`.
- `knappe-fuer-mixamo.zip`: schlanke Retopo-Figur als OBJ mit Farb-Textur, 170 cm, ohne Skelett (aus dem Retopo-GLB
  gebaut mit `werkzeug/obj-fuer-mixamo.mjs`). **Nur so** nahm Mixamo die Figur an; Tripo-FBX (mit und ohne Skelett)
  scheiterte („unable to map your existing skeleton“).
- `mixamo/`: die 7 Mixamo-Bewegungen (alle „With Skin“, 30 fps): fight-idle, running, jab-cross, uppercut,
  hit-reaction, dying, roll (Sprinting Forward Roll, lief trotz „In Place“ 4,7 m weit). Daraus entsteht
  `modelle/knappe.glb` mit `werkzeug/baue-knappe-mixamo.mjs`.
