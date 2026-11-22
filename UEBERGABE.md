# Übergabe – Stand 22.11.2026

Dieses Dokument ist für eine neue Claude-Sitzung ohne Vorwissen. Lies es zuerst, danach `CLAUDE.md`
(Regeln, Kampfwerte, Aufbau des Codes).

## 1. Mit wem du arbeitest
- Der User ist **kein Programmierer**, schreibt **kurz und auf Deutsch** und arbeitet **nur am Handy**.
- Antworte auf Deutsch, ohne Fachbegriffe. Zeige Ergebnisse als **Bilder im Chat**.
- Sag immer ehrlich, was nur im simulierten Browser geprüft ist. **Auf einem echten Handy lief das Spiel noch nie.**
- Er ändert seine Meinung oft und schnell. Frag bei Richtungswechseln kurz nach, bevor du viel baust, und halte
  jede Entscheidung in dieser Datei fest.
- Er erzeugt Bilder mit Gemini oder kie.ai und 3D-Modelle mit Tripo. Du schreibst ihm dafür fertige Prompts
  (englisch, in Code-Blöcken zum Kopieren).
- Kein Geld ausgeben, keine Schlüssel, nichts aus bestehenden Spielen, Filmen oder Serien kopieren.

## 2. Was das Spiel werden soll (vom User festgelegt)
Ein **Kampf- und Aufbauspiel im Anime-Stil** fürs Handy, als Web-App:
1. **Kämpfe in Echtzeit** in einer Arena von schräg oben. Sie sind die Missionen: mal Duell eins gegen eins, mal
   Wellen von Gegnern. ← **gebaut**
2. **Eigenes Dorf mit festen Bauplätzen** als Zuhause. Missionen bringen Rohstoffe (Holz, Stein, Gold, Zutaten).
   Gebäude wachsen in drei Stufen und machen stärker: Trainingsplatz (Aufleveln), Schmiede (Schaden), Zauberküche
   (Spezial), Taverne (neue Charaktere), Arena (Online-Duelle). ← offen
3. **Gegner:** Computer in zehn Stufen ← gebaut; **online gegen Freunde** ← offen.
4. **Jeder Charakter hat eine Verwandlung als Spezialfähigkeit.** ← für zwei Charaktere gebaut
5. **Hauptfigur: der Junge aus Anigosha**, das **Mädchen aus Anigosha** ist der zweite Charakter. Anigosha ist die
   eigene Anime-Quiz-App des Users (Repo `almaz6380/anigosha`), die Figuren gehören ihm. Vorlagen:
   `figuren/vorlagen/`. Junge: dunkelgrüne Stachelfrisur, oranger Kapuzenpulli, schwarze Shorts. Mädchen: lila
   Pferdeschwanz, olivgrüne Jacke.
6. **Look:** Orte als Miniatur-Schaukasten (wie handgebaute Modell-Landschaften im Abendlicht), Figuren im
   gezeichneten Anime-Stil.
7. Später gewünscht: Der Junge **wächst in drei Stufen** (Pulli → Abenteurer → Magier), Tagesaufgaben, weitere
   Charaktere (Prompts für 15 Nebenfiguren stehen in `FIGUREN.md`).

## 3. Der Weg hierher – bitte nicht erneut vorschlagen
| Versuch | Ergebnis |
| --- | --- |
| Große frei begehbare 3D-Welt aus kostenlosen Bausteinen | „viel zu schlecht“. Im Handy-Browser sieht eine große Welt billig aus |
| Gemaltes Bild als Map, 3D-Figur läuft darin (Antippen = hinlaufen) | Technik gefiel. Der Miniatur-Schaukasten-Look stammt von hier |
| Ruhiges Abenteuer: Zutaten sammeln, Tränke brauen, verwandeln | gebaut, dann auf Eis gelegt: Der User wollte ein richtiges Kampfspiel |
| Affe als Hauptfigur (Zauberlehrling, viele Design-Runden) | verworfen zugunsten der eigenen Anigosha-Figuren. Affen nur noch als Nebenfiguren |
| Figuren als Miniatur- oder Sammelfiguren | verworfen, er will gezeichneten Anime-Stil |
| Kampf Zug um Zug, Seitenansicht mit Kombos, Kampf der von selbst läuft | zur Wahl gestellt, er wählte **Echtzeit von schräg oben** |
| Frei platzierbare Gebäude auf einem Raster | zur Wahl gestellt, er wählte **feste Bauplätze** |

Die alten Prototypen liegen im privaten Repo `almaz6380/brainstorm`, Branch `claude/admiring-faraday-vea7ur`,
Ordner `welt-3d/` und `kulisse/`. Von dort stammt auch dieses Spiel (Ordner `arena/`). Seit 22.11.2026 liegt es in der Wurzel des Repos
`almaz6380/Unleashed-Kingdom` und wird nur noch hier weiterentwickelt.

## 4. Was fertig ist
- **Kampf:** Laufen (Steuerkreis links), Angriff als Dreier-Folge, Ausweichrolle (unverwundbar), Spezial
  (Verwandlung für 5 s bei voller Leiste), Zielhilfe, Schonfrist nach einer Schlagfolge.
- **Charaktere:** Junge (Steinriese) und Mädchen (Sturm). Gegner: Rabenritter, Schergen, Hauptmann.
- **Modi:** Duell (2 Siege) und Wellen (3 Angriffe mit einem Leben).
- **Computer-Gegner** in zehn Stufen; nach jedem Duell-Sieg eine Stufe stärker (gespeichert).
- **Wucht:** Funken, Schlagbogen, Schadenszahlen, Treffer-Stopp, Zeitlupe beim K. o., Töne, Vibration.
- **Tests:** `tests/sim.test.js` (Regeln, Balance) und `tests/arena.test.js` (simuliertes Handy), beide grün.
- **Gemessen**, Bot gegen Bot, je 200 Runden: Stufe 10 schlägt Stufe 1 in 100 %, Stufe 5 schlägt Stufe 1 in 99 %,
  gleiche Stufe 51 % bei etwa 16 s je Runde, Junge gegen Mädchen 52 %.

### Erste Rückmeldung vom echten Handy (22.11.2026)
- „Kampf fühlt sich gut an.“ „Stufe 1 zu leicht“ → Stufe 1 ist jetzt so stark wie die frühere Stufe 3 (er wählte
  „deutlich schwerer“). Stufe 10 blieb gleich.
- „Könnte flüssiger sein“, gemeint: **Figuren wirken steif**. Geändert: weiche Drehung, längeres Überblenden
  zwischen Stehen und Laufen, kein Rücksprung beim dritten Schlag, Bewegung zwischen den Rechenschritten
  eingeblendet. Noch nicht auf dem echten Handy bestätigt; nachfragen.

## 5. Was noch Platzhalter ist
- **Figuren:** einfache freie Figuren (Quaternius, gemeinfrei) statt Junge und Mädchen.
- **Arena:** Boden, Steine und Feuerschein sind im Code gemalt, kein Schaukasten-Bild.
- **Töne:** einfache Pieptöne aus dem Code.
- **Verwandlungen:** nur größer und umgefärbt, keine eigenen Modelle.

## 6. Was der User noch liefern muss
1. **Junge und Mädchen als 3D-Modell (GLB) aus Tripo.** Erst ein Bild in neutraler Haltung erzeugen (Prompts in
   `FIGUREN.md`, Charakterblatt als Vorlage hochladen), dann in Tripo: Skelett und die Bewegungen **Stehen,
   Laufen, ein Schlag, Getroffen-werden, Umfallen**, möglichst auch eine Rolle. Fehlt eine Bewegung, im Code eine
   einfache ersetzen. Einsetzen: Tabelle `AUSSEHEN` in `index.html`.
2. **Arena-Bild** von oben im Schaukasten-Stil (runder Kampfplatz), als Datei in voller Größe.
3. Später: **Dorf-Bild** mit acht bis zehn leeren Bauplätzen und je Gebäude drei Bilder (Ausbaustufen).
Lässt sich eine GLB-Datei nicht im Chat schicken, kann er sie über die GitHub-Seite ins Repo hochladen
(Ordner `eingang/` vorschlagen).

## 7. Nächste Schritte, in dieser Reihenfolge
1. **Rückmeldung vom echten Handy einholen:** Fühlt sich der Kampf gut an? Sitzen die Knöpfe? Ist Stufe 1 zu
   leicht oder zu schwer? Ruckelt es? Danach an `K`, `TYPEN` und `Bot` nachstellen (Zahlen vorher und nachher
   vergleichen).
2. **Eigene Figuren einsetzen**, sobald die GLB-Dateien da sind.
3. **Dorf mit festen Bauplätzen**, Rohstoffe, zwei bis drei Gebäude.
4. **Missionen mit Belohnungen** (Liste von Kämpfen mit Ziel und Lohn), Aufleveln.
5. **Wachstumsstufen** des Jungen, weitere Charaktere.
6. **Online-Duell gegen Freunde.** Vorlage ist das fertige Spiel des Users `almaz6380/Worm-Attack` (PeerJS,
   Gastgeber rechnet, Gast bekommt Spielstände). Die Simulation hier ist dafür schon wiederholbar gebaut.

## 8. Offene Fragen an den User
- Wie soll das Spiel heißen? („Arena“ ist nur ein Arbeitsname.)
- Rolle des Mädchens: nur wählbarer Charakter oder auch Begleiterin im Kampf?
- Sollen die Computer-Stufen sanfter ansteigen? (Für Bots liegen sie sehr weit auseinander.)
- Tränke: Er wählte „als Spezialfähigkeit je Charakter“. Tränke zum Einsammeln in der Arena sind damit nicht geplant.

## 9. So wird gearbeitet
- Vor jedem Commit: `node tests/sim.test.js`, dann `python3 -m http.server 8766 &` im Ordner des Spiels und
  `node tests/arena.test.js` (dauert ohne Grafikkarte einige Minuten). Danach die Bilder in `tests/screenshots/`
  ansehen und dem User die besten schicken.
- Kleine Commits auf Deutsch. Nach grünen Tests auf `main` pushen (GitHub Pages liefert `main` aus), dann prüfen,
  dass der Link die neue Fassung zeigt.
- Nach jeder größeren Änderung diese Datei und `CLAUDE.md` nachführen.
