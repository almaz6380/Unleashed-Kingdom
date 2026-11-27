# CLAUDE.md – „Vikings“ (Arbeitstitel): der erste Probekampf

Das neue Spiel des Users. Es liegt in diesem Ordner, das alte Spiel („Arena“) liegt unverändert in der Wurzel und
ist nur noch Vorlage. **Lies zuerst [`../UEBERGABE.md`](../UEBERGABE.md)** (Kasten oben: Entscheidungen, Stand,
nächste Schritte), für das große Bild [`../VIKINGS-ANALYSE.md`](../VIKINGS-ANALYSE.md).

Der User ist kein Programmierer, schreibt kurz auf Deutsch und arbeitet meist am Handy. Antworten auf Deutsch, ohne
Fachbegriffe. Er entscheidet selbst: Alternativen nennen, nicht für ihn festlegen. Prompts immer vollständig zum
Kopieren. Immer ehrlich sagen, was nur simuliert geprüft ist.

Link: `https://almaz6380.github.io/Unleashed-Kingdom/vikings/`

## Was der Probekampf ist
Ein Raubzug auf ein Beispiel-Dorf, damit der User spürt, wie sich „Krieger einzeln losschicken“ spielt.
**Alles Sichtbare ist Platzhalter** (Boden im Code gemalt, Häuser aus Klötzen, freie Figuren aus `../modelle/`).
- Unten der Strand mit dem Langschiff, darüber das fremde Dorf. Hochformat, feste Kamera von schräg oben.
- Karte wählen, auf den Strand tippen: ein Krieger. Finger halten: alle 0,2 s ein weiterer.
- Die Krieger kämpfen von selbst. Zwei Wachtürme schießen, fünf Wachen verteidigen.
- Steht der Anführer auf dem Feld, erscheint der Knopf „Kriegsschrei“: einmal je Raubzug, alle eigenen Krieger im
  Umkreis von 7 m schlagen und laufen 6 s lang 1,5-mal so schnell.
- Ende nach 120 s, wenn alles zerstört ist, wenn alle Krieger gefallen sind oder über „Beenden“.
  Runen: 1 für die Hälfte zerstört, 1 für das Langhaus, 1 für alles. Beute aus Vorratshäusern und Langhaus.

Noch nicht gebaut: eigenes Dorf, Konto, Überfälle auf andere Spieler, Clans, Feldschlachten, richtiger Ton, eigene
Figuren und Bilder. Reihenfolge: Etappen in der Analyse.

## Feste Regeln
- Kein Build-Tool. Mehrere Dateien sind hier erlaubt (anders als im alten Spiel). three.js kommt aus `../lib/` (r170).
- **`js/sim.js` bleibt reine Rechnung:** kein `Math.random`, kein `Date`, kein `document`, kein `window`. Zufall nur
  aus `mulberry32(seed)`. Gleiche Startzahl und gleiche Eingaben ergeben denselben Kampf, und ein gespielter Kampf
  lässt sich aus `raubzug.eingaben` exakt nachrechnen (`Raubzug.wiederhole`). Darauf bauen später Kampfberichte und
  die Prüfung auf dem Server auf. `tests/sim.test.mjs` bricht bei Verstößen ab.
- Keine Kosten ohne seine Entscheidung. Sobald Online kommt: nur der öffentliche Supabase-Schlüssel im Spiel, der
  geheime (`service_role`) nie im Repo oder im Chat.
- Nichts aus bestehenden Spielen, Filmen oder Serien (auch nicht aus der Serie „Vikings“). Herkunft fremder
  Bausteine in `../LIZENZEN.md`.
- Deutsch für Texte, Kommentare, Commits. Handy zuerst, Hochformat. `localStorage` mit Präfix `vk_` in try/catch.

## Dateien
| Datei | Inhalt |
| --- | --- |
| `index.html` | Seite, Aussehen der Anzeige, Karten, Fenster |
| `js/sim.js` | Regeln: Werte, Beispiel-Dorf, Klasse `Raubzug`, Computer-Spieler `botEingaben` |
| `js/spiel.js` | Bild, Ton, Bedienung, Ablauf. Test-Zugriff `window.VK` |
| `package.json` | nur `"type": "module"`, damit Node `js/sim.js` lesen kann (die Browser-Prüfung heißt deshalb `.cjs`) |
| `tests/sim.test.mjs` | Regeln ohne Browser: Wiederholbarkeit, Absetzen, Ende, Schwierigkeit des Beispiel-Dorfs |
| `tests/raubzug.test.cjs` | Simuliertes Handy: laden, absetzen, halten, Kriegsschrei, ganzer Raubzug, Nachrechnen, Handy-Größen, Grafik-Stufen, Ersatzfiguren, Bilder |

## Werte (in `js/sim.js`: `K`, `EINHEITEN`, `BAUTEN`, `TRUPPE`, `beispielDorf`)
Feld 18 × 32 m (x −9…9, z −16 hinten bis 16 vorn am Wasser), Strand 5,5 m tief, 30 Rechenschritte je Sekunde.

| Krieger | Anzahl | Leben | Tempo | Schaden | Takt | Reichweite |
| --- | --- | --- | --- | --- | --- | --- |
| Schildträger | 2 | 190 | 2,5 | 7 | 1,0 s | 0,9 |
| Axtkämpfer | 6 | 70 | 3,1 | 14 | 0,9 s | 0,9 |
| Anführer | 1 | 260 | 3,2 | 30 | 0,8 s | 1,1, Kriegsschrei |
| Bogenschütze | 4 | 36 | 3,0 | 10 | 1,1 s | 6,0 (Pfeil) |
| Dorfwache (Gegner) | 5 | 90 | 2,8 | 12 | 1,0 s | 0,9 |

| Gebäude | Anzahl | Leben | Besonderes |
| --- | --- | --- | --- |
| Langhaus | 1 | 2640 | Hauptgebäude, 40 Silber |
| Vorratshaus | 2 | 1100 | je 60 Holz, 30 Eisen |
| Hütte | 3 | 715 | – |
| Wachturm | 2 | 935 | schießt alle 0,8 s mit 11 Schaden, 8 m weit, auf den nächsten Krieger |

Verhalten: Eigene Krieger greifen zuerst Wachen im Umkreis von 5 m an, sonst das nächste Gebäude; alle 10 Schritte
wird neu gezielt. Wachen greifen an, was näher als 6,5 m kommt, entfernen sich höchstens 9 m vom Posten und gehen
danach zurück. Nahkampf-Treffer sitzen 0,25 s nach dem Ausholen, Pfeile fliegen 16 m/s. Schaden schwankt um ±10 %.
Niemand steht in einem Gebäude oder in einem anderen Krieger (`schiebe`), beim Laufen gleiten Krieger an Gebäuden
vorbei (`laufe`).

**Gemessen** (`sim.test.mjs`, je 20 Raubzüge, Computer-Spieler):
| Plan | Runen | zerstört | Dauer | überleben |
| --- | --- | --- | --- | --- |
| klug (Schildträger zuerst, Kriegsschrei im Dorf) | 3,0 | 100 % | 98 s | 6,0 von 13 |
| klug, ohne Kriegsschrei | 1,7 | 72 % | 118 s | 4,0 |
| alle auf einmal in einer Ecke | 1,8 | 81 % | 112 s | 4,8 |

Das Gleichgewicht steht auf Messers Schneide: Entscheidend ist, ob die Türme fallen, bevor die Truppe aufgerieben
ist. Kleine Änderungen an Turm-Schaden oder Gebäude-Leben kippen das Ergebnis stark. **Wer an den Werten dreht:
Zahlen vorher und nachher vergleichen. Ob die Schwierigkeit für Menschen passt, ist ungeprüft.**

## Aufbau
`Raubzug(seed, dorf, truppe)`: `setze(typ, x, z)` (nur am Strand, sonst `null`), `schreie()`, `gibAuf()`, `step()`,
`runen()`, `prozent()`, `eigene()`, `rest()`, `abdruck()`, `static wiederhole(seed, dorf, truppe, eingaben)`.
Was in einem Schritt passiert, steht danach in `ereignisse` (`gesetzt, pfeil, schlag, treffer, tod, einsturz, schrei,
ende`). `step()` leert die Liste am Anfang: Ereignisse aus `setze()` und `schreie()` holt das Spiel deshalb sofort ab
(`nimmEreignisse`).

| Baustein in `js/spiel.js` | Aufgabe |
| --- | --- |
| `maleBoden(bauten)`, `baueKulisse`, `zone` | Wiese, Wege (aus der Lage der Gebäude), Strand, Wasser, Langschiff, Bäume; leuchtende Absetz-Zone |
| `baueBau`, `zeigeBau`, `dach`, `kasten` | Platzhalter-Häuser, Wackeln bei Treffern, Einsturz |
| `AUSSEHEN`, `ladeVorlagen`, `baueFigur`, `zeigeFigur`, `spiele` | Figur je Typ (Datei, Höhe, Farbton, `glut` = Eigenleuchten). Nur `koerper` dreht sich, Ring und Lebensbalken bleiben gerade. Lage zwischen zwei Rechenschritten eingeblendet (`px/pz`) |
| `fx(e)` | Ereignisse ⇒ Funken, Pfeile, Welle des Kriegsschreis, Banner, Töne, Wackeln |
| `passeAn`, `setzeKamera`, `NEIGUNG` | Kamera 61° von oben; sucht Abstand und Lage so, dass das ganze Feld zwischen Anzeige oben und Karten unten passt |
| `absetzen`, `absetzenWelt`, `schreie`, `zeichneKarten` | Bedienung |
| `starte`, `schritt`, `bild`, `zeigeErgebnis` | Ablauf, fester Zeitschritt, Ergebnis-Fenster |
| `grafik`, `setzeGrafik` | Stufen 'hoch' / 'sparsam' wie im alten Spiel, 'auto' misst 4 s im ersten Kampf (`vk_grafikAuto`) |
| `window.VK` | Für Tests: `bereit`, `app`, `info()`, `starte()`, `absetzenWelt()`, `schreie()`, `weltZuBild()`, `K`, `EINHEITEN`, `BAUTEN`, `TRUPPE`, `Raubzug` |

Schalter: `?start`, `?auto` (kluger Computer-Spieler), `?auto=plump`, `?tempo=8`, `?seed=`, `?grafik=hoch|sparsam|auto`,
`?ohne=modelle` (Ersatzfiguren aus Grundformen).

## Eigene Figuren (kommt als Nächstes)
Der Anführer entsteht wie der Knappe im alten Spiel: Bild → Tripo → Mixamo → GLB (Weg und Werkzeuge in
`../CLAUDE.md`, Abschnitt „Eigene Figuren einsetzen“, und in `../werkzeug/`). **Neu seit 27.11.:** Der User will
bessere Qualität als „10.000 Flächen, 2K“. Er exportiert aus Tripo nur einmal in der höchsten Qualität. Die kleine
Hilfsfigur für Mixamo bauen wir selbst daraus (`../werkzeug/obj-fuer-mixamo.mjs`), die feine Figur fürs Spiel wie in
`../werkzeug/knappe-fein.mjs`. Wie fein sie wird, entscheidet er anhand von Vergleichs-Fassungen. In `AUSSEHEN`
eintragen: Datei, Höhe, Farbton. Gebraucht werden die Bewegungen `steh`, `lauf`, `schlag1`, `tod`, später ein
Kriegsschrei.

## Arbeitsweise
- Vor jedem Commit: `node vikings/tests/sim.test.mjs`, dann im Repo-Ordner `python3 -m http.server 8766` im
  Hintergrund und `node vikings/tests/raubzug.test.cjs` (einige Minuten). Bilder in `tests/screenshots/` ansehen.
  Das alte Spiel muss grün bleiben: `node tests/sim.test.js`.
- Nach grünen Tests auf `main` pushen; GitHub Pages liefert `main` aus. Danach prüfen, dass der Link antwortet.
- Nach jeder größeren Änderung diese Datei und `../UEBERGABE.md` nachführen.
