# Eingang (Vikings): Ausgangsdateien des Users

Hier liegen die Vorlagen, aus denen die Figuren des Wikinger-Spiels entstehen. Alles wird aufgehoben.
Die Fassungen fürs Spiel entstehen daraus mit `../werkzeug/figur-stufen.mjs` (schauen nach +z, stehen auf y = 0).

## Anführer
- `anfuehrer-master.glb` (19 MB): **1 Mio. Dreiecke**, Texturen unverändert in 4K (Farbe, Normal, Rauheit/Metall),
  Meshopt-gepackt, ohne Skelett. Gebaut am 27.11.2026 aus dem Tripo-Export des Users: 4,95 Mio. Dreiecke, 153 MB,
  ohne Retopo. **Das Original ist zu groß für GitHub (Grenze 100 MB) und liegt nur im Google Drive des Users.** Für
  alle Fassungen bis 600.000 Dreiecke reicht diese Datei als Quelle. Die Figur ist 1 Einheit hoch, steht auf y = 0
  und schaut nach +z.
- `anfuehrer-fuer-mixamo.zip` (1,5 MB): grobe Hilfsfigur für Mixamo, 24.000 Dreiecke, als OBJ mit Farb-Textur,
  185 cm. Gebaut mit `../werkzeug/figur-stufen.mjs` und `../../werkzeug/obj-fuer-mixamo.mjs`. Sie ist im Spiel nie zu
  sehen: Mixamo setzt das Skelett ein, die Gewichte werden danach auf die feine Figur übertragen.
- `mixamo/anfuehrer/`: die sechs Bewegungen aus Mixamo als FBX: `breathing-idle.fbx` (mit Figur und Skelett, „With
  Skin“), `running`, `attack-downward`, `attack-horizontal`, `battlecry`, `walking-to-dying` (alle „Without Skin“).

## Axtkämpfer
- `axtkaempfer-original.glb` (17 MB): **das Original aus Tripo, unverändert** (28.11.2026, aus der Tripo-App am
  Handy): 1,96 Mio. Dreiecke, Farbe/ORM/Normal in 4K, mit gltfpack gepackt (Meshopt), ohne Skelett. Die Figur schaut
  hier nach +x und hat die Mitte im Ursprung; `figur-stufen.mjs` dreht sie nach vorn und stellt sie auf den Boden.
- `axtkaempfer-fuer-mixamo.zip` (0,9 MB): Hilfsfigur für Mixamo, 24.000 Dreiecke, 180 cm.
- `mixamo/axtkaempfer/` (kommt noch): Breathing Idle („With Skin“), Running (In Place), Standing Melee Attack
  Downward, Standing Melee Attack Horizontal, Walking To Dying (alle „Without Skin“).

## Bogenschützin
- `bogenschuetzin-original.glb` (19 MB): **das Original aus Tripo, unverändert** (28.11.2026, Tripo-App, direkt im
  Chat geschickt): 1,93 Mio. Dreiecke, Farbe/ORM/Normal in 4K, gltfpack/Meshopt, ohne Skelett, schaut nach +x.
  Köcher mit Pfeilen auf dem Rücken und Zopf über der Schulter sind Teil der Figur.
- `bogenschuetzin-fuer-mixamo.zip` (1,1 MB): Hilfsfigur für Mixamo, 24.000 Dreiecke, 170 cm.
- `mixamo/bogenschuetzin/` (kommt noch): Breathing Idle („With Skin“), Running (In Place), ein Bogenschuss (Suche
  „arrow“, Ausholen und Schuss in einer Bewegung), Walking To Dying (alle „Without Skin“).

## Schildträger
- `schildtraeger-master.glb` (15 MB): **alle 1,95 Mio. Dreiecke, gepackt** (Meshopt, fein gerastert), Texturen
  unverändert. Gebaut am 28.11.2026 aus dem Export des Users per Drive-Link: 61 MB, ungepackt, von der Tripo-Web-Seite
  (Erzeuger „Tripo“), **Texturen nur 2048 Pixel** (alle anderen Figuren haben 4096). Das Original liegt nur in seinem
  Drive. Der Master schaut nach +z, steht auf y = 0, doppelte Punkte an harten Kanten sind zusammengelegt.
- `schildtraeger-fuer-mixamo.zip` (1,6 MB): Hilfsfigur für Mixamo, 24.000 Dreiecke, 185 cm.
- `mixamo/schildtraeger/` (kommt noch): wie beim Axtkämpfer.

## Dorfwache (Gegner)
- `dorfwache-original.glb` (18 MB): **das Original aus Tripo, unverändert** (28.11.2026, Tripo-App, direkt im Chat):
  1,88 Mio. Dreiecke, Farbe/ORM/Normal in 4K, gltfpack/Meshopt, ohne Skelett, schaut nach +x.
- `dorfwache-fuer-mixamo.zip` (1,0 MB): Hilfsfigur für Mixamo, 24.000 Dreiecke, 178 cm.
- `mixamo/dorfwache/` (kommt noch): wie beim Axtkämpfer.
