# CLAUDE.md – „Arena“: Kampf- und Aufbauspiel, Schritt 1

**Lies zu Beginn einer neuen Sitzung zuerst [`UEBERGABE.md`](UEBERGABE.md):** Stand, Entscheidungen des Users,
verworfene Wege, nächste Schritte.

Der User ist kein Programmierer, schreibt kurz auf Deutsch und arbeitet **nur am Handy**. Antworten auf Deutsch,
ohne Fachbegriffe. Immer ehrlich sagen, was nur simuliert geprüft ist.

## Wohin das Ganze soll (vom User am 22.11. festgelegt)
Ein **Kampf- und Aufbauspiel** im Anime-Stil:
- **Kämpfe in Echtzeit** in einer Arena, als Missionen (Duell oder Wellen). ← gebaut
- **Eigenes Dorf mit festen Bauplätzen** als Zuhause; Missionen bringen Rohstoffe, Gebäude machen stärker
  (Trainingsplatz, Schmiede, Zauberküche, Taverne, Arena). Noch nicht gebaut.
- Gegner: Computer und **online gegen Freunde** (wie Worm Attack, Gastgeber rechnet). Noch nicht gebaut.
- **Jeder Charakter hat eine Verwandlung als Spezialfähigkeit.**
- **Hauptfigur: der Junge aus Anigosha**, das **Mädchen aus Anigosha** als zweiter Charakter. Beide gehören dem
  User (Repo `almaz6380/anigosha`, Vorlagen in `figuren/vorlagen/`). Orte im Miniatur-Schaukasten-Look.
- Reihenfolge: erst Kampf (fertig), dann Dorf, Missionen mit Belohnungen, Online.

Vorgeschichte und verworfene Wege stehen in `UEBERGABE.md`. Figuren-Prompts: `FIGUREN.md`.

**Offen (User fragen):** Wie fühlt sich der Kampf auf dem echten Handy an?

## Feste Regeln
- Kein Build-Tool: alles in `index.html`. three.js liegt fest in `lib/` (r170), nichts wird von fremden Servern geladen.
- **Wiederholbar:** Zwischen `/* SIM-START */` und `/* SIM-END */` kein `Math.random()`, kein `Date`, kein DOM.
  Nur `mulberry32`. `tests/sim.test.js` liest genau diesen Block und bricht bei Verstößen ab. Marker stehen lassen.
- Keine Kosten, keine Schlüssel. Nur gemeinfreie oder eigene Bausteine, Herkunft in `LIZENZEN.md`.
  Nichts aus bestehenden Spielen, Filmen oder Serien; keine Kämpfer, die bekannten Anime-Figuren nachempfunden sind.
- Deutsch für Texte, Kommentare, Commits. Handy zuerst, Hochformat. `localStorage` (Präfix `ar_`) in try/catch.

## Dateien
| Datei | Inhalt |
| --- | --- |
| `index.html` | Das ganze Spiel |
| `lib/` | three.js r170 mit GLTFLoader und SkeletonUtils |
| `figuren/vorlagen/`, `FIGUREN.md` | Charakterblatt und Bilder der eigenen Figuren, Prompts für alle Figuren |
| `manifest.webmanifest`, `icons/` | Web-App zum Ablegen auf dem Startbildschirm (noch ohne Offline-Betrieb) |
| `UEBERGABE.md` | Stand, Entscheidungen, nächste Schritte |
| `modelle/` | Platzhalter-Kämpfer (Quaternius, CC0) mit Animationen steh, lauf, schlag1, schlag2, treffer, tod, rolle |
| `werkzeug/baue-figuren.mjs` | Macht aus den FBX-Vorlagen die GLB-Dateien (vorher `fbx2gltf`) |
| `tests/sim.test.js` | Kampfregeln ohne Browser: Wiederholbarkeit, Bot-Stufen, Figuren-Balance, Duell, Wellen |
| `tests/arena.test.js` | Simuliertes Handy: Menü, Bedienung, Treffer, Ausweichen, Spezial, ganze Kämpfe, Bilder |

## Kampfregeln (Konstanten `K` und `TYPEN` am Anfang des SIM-Blocks)
- Arena-Radius 6 m. Fester Zeitschritt 1/60 s.
- **Angriff:** Dreier-Folge, Schlagdauer 0,34 / 0,34 / 0,5 s, Treffer nach 0,15 s, Kegel nach vorn. Der dritte Schlag
  stößt weit zurück; danach ist der Getroffene 0,55 s unverwundbar (`SCHUTZ`), damit niemand festgenagelt wird.
- **Zielhilfe:** Ein Gegner näher als 2 m oder ungefähr in Schlagrichtung wird genau anvisiert.
- **Ausweichen:** Rolle 0,36 s, unverwundbar, danach 0,85 s Pause. Nach dem eigenen Treffer bricht sie den Schlag ab.
- **Spezial:** Energie +12 je ausgeteiltem, +9 je eingestecktem Treffer; bei 100 Verwandlung für 5 s. Verwandelte
  taumeln nicht. Stein: Schaden ×1,3, Reichweite ×1,25, Tempo ×0,8, kaum wegzustoßen. Sturm: Schaden ×1,4,
  Tempo ×1,4, Schläge schneller und im Halbkreis.
- **Duell:** 2 Siege, 60 s je Runde (danach gewinnt, wer anteilig mehr Leben hat), höchstens 5 Runden.
- **Wellen:** 2 Schergen, 3 Schergen, 1 Hauptmann; 120 s je Welle; zwischen den Wellen +25 Leben.

| Typ | Leben | Tempo | Schaden | Reichweite | Spezial |
| --- | --- | --- | --- | --- | --- |
| Junge | 100 | 4,5 | 6/6/10 | 1,5 | Stein |
| Mädchen | 92 | 5,0 | 6/6/9, Schläge 15 % schneller | 1,5 | Sturm |
| Rabenritter (Duell-Gegner) | 100 | 4,3 | 6/6/10 | 1,55 | Stein |
| Scherge | 30 | 3,7 | 4/4/6 | 1,35 | – |
| Hauptmann | 140 | 3,9 | 8/8/13 | 1,75 | Stein |

## Computer-Gegner `Bot(stufe, seed)`, mit k = (2 + (Stufe − 1) · 7/9) / 9
(Seit 22.11. ist Stufe 1 so stark wie die frühere Stufe 3, Wunsch des Users: „Stufe 1 zu leicht“. Stufe 10 unverändert.)
| Eigenschaft | Wert |
| --- | --- |
| neue Entscheidung | alle `round(20 − 11·k)` Ticks (plus bis zu 4 zufällige) |
| zögert | 0,2 · (1 − k) je Entscheidung |
| greift in Reichweite an | 0,36 + 0,4·k je Entscheidung |
| setzt die Schlagfolge fort | 0,35 + 0,5·k je Schlag |
| weicht einem Schlag aus | 0,03 + 0,42·k je gegnerischem Schlag |
| nutzt das Spezial | 0,25 + 0,75·k je Entscheidung |
Schergen kämpfen zwei Stufen schwächer als eingestellt.

**Gemessen** (`sim.test.js`, Bot gegen Bot, je 200 Runden): Stufe 10 schlägt Stufe 1 in 100 %, Stufe 5 schlägt
Stufe 1 in 98 %, Stufe 10 schlägt Stufe 5 in 98 %; gleiche Stufe 56 %, Rundendauer etwa 16 s. Figuren auf Stufe 5:
Junge gegen Rabenritter 45 %, Mädchen gegen Rabenritter 45 %, Junge gegen Mädchen 42 %. Wellen gegen Stufe 3: ein
Bot der Stufe 7 schafft 48 %, einer der Stufe 2 fast nie. **Die Stufen liegen für Bots sehr weit auseinander; ob das
für Menschen passt, ist ungeprüft.** Wer an `K`, `TYPEN` oder `Bot` dreht: Zahlen vorher und nachher vergleichen.

## Aufbau von `index.html`
| Baustein | Aufgabe |
| --- | --- |
| `Kampf` | Eine Runde: `step()`, Eingaben über `k[i].mx/.mz` und `k[i].wunsch`, Ereignisse in `ereignisse` |
| `Bot` | `denke(kampf, i)` setzt Laufrichtung und Wünsche |
| `Match` | Runden bzw. Wellen, Phasen `count → play → end → over`, `tick()` |
| `AUSSEHEN`, `NAMEN`, `ladeVorlagen`, `baueFigur`, `zeigeFigur` | Modell je Typ, Animationen am Namen erkennen, Zustand → Animation. Flüssig: Position zwischen zwei Rechenschritten eingeblendet (`vx0/vz0`), Drehung folgt weich, Überblenden 0,06 s (Schläge) bis 0,18 s (Stehen/Laufen), Schlag 3 als eigene Kopie |
| `fx(e)` | Ereignisse ⇒ Funken, Schlagbogen, Schadenszahlen, Wackeln, Treffer-Stopp, Zeitlupe, Töne, Vibration |
| `bewegeKamera` | hält Spieler und nächsten Gegner im Bild |
| Bedienung | Steuerkreis links (zuletzt aufgesetzter Finger, Loslassen überall abgefangen), drei Knöpfe rechts |
| `starte`, `zeigeErgebnis`, `zumMenü`, `zeichneMenü` | Ablauf; im Menü läuft ein Schaukampf |
| `window.AR` | Für Tests: `info()`, `app`, `stand`, `starte()`, `Kampf`, `Bot`, `Match`, `K`, `TYPEN` |

Schalter: `?start`, `?auto` (Computer spielt den Spieler), `?tempo=6`, `?modus=duell|wellen`, `?stufe=`,
`?spielerStufe=`, `?seed=`, `?neu` (Stufe 1), `?ohne=modelle`.

## Eigene Figuren einsetzen
In `AUSSEHEN` Datei, Höhe und Farbton eintragen. Das Modell braucht die Animationen **Idle, Run, Schlag, Getroffen,
Umfallen**, möglichst eine Rolle (deutsche oder englische Namen, siehe `NAMEN`). Fehlende Animationen: Die Figur
bleibt dann in der letzten Haltung; für Tripo-Modelle ohne Kampfbewegungen einfache Bewegungen im Code ergänzen.

## Arbeitsweise
- Vor jedem Commit: `node tests/sim.test.js`, dann im Ordner des Spiels `python3 -m http.server 8766 &` und
  `node tests/arena.test.js` (einige Minuten), danach die Bilder in `tests/screenshots/` ansehen.
- Nach grünen Tests auf `main` pushen; GitHub Pages liefert `main` aus. Danach prüfen, dass der Link antwortet.
- Nach jeder größeren Änderung `UEBERGABE.md` nachführen.
