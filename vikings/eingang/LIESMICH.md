# Eingang (Vikings): Ausgangsdateien des Users

Hier liegen die Vorlagen, aus denen die Figuren des Wikinger-Spiels entstehen. Alles wird aufgehoben.

- `anfuehrer-master.glb` (19 MB): der Anführer, **1 Mio. Dreiecke**, Texturen unverändert in 4K (Farbe, Normal,
  Rauheit/Metall), Meshopt-gepackt, ohne Skelett. Gebaut am 27.11.2026 aus dem Tripo-Export des Users:
  4,95 Mio. Dreiecke, 153 MB, ohne Retopo. **Das Original ist zu groß für GitHub (Grenze 100 MB) und liegt nur im
  Google Drive des Users.** Für alle Fassungen bis 600.000 Dreiecke reicht diese Datei als Quelle.
  Die Figur ist 1 Einheit hoch, steht auf y = 0 und schaut nach +z.
- `anfuehrer-fuer-mixamo.zip` (1,5 MB): grobe Hilfsfigur für Mixamo, 24.000 Dreiecke, als OBJ mit Farb-Textur,
  185 cm. Gebaut mit `../werkzeug/figur-stufen.mjs` und `../../werkzeug/obj-fuer-mixamo.mjs`. Sie ist im Spiel nie zu
  sehen: Mixamo setzt das Skelett ein, die Gewichte werden danach auf die feine Figur übertragen.
- `mixamo/`: die Bewegungen aus Mixamo als FBX. Da: `breathing-idle.fbx` (mit Figur und Skelett, „With Skin“).
  Erwartet: Running (In Place), Standing Melee Attack Downward, Standing Melee Attack Horizontal,
  Standing Taunt Battlecry, Dying (alle „Without Skin“).
