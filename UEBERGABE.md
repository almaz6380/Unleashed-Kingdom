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
Ein **Kampf- und Aufbauspiel** fürs Handy, als Web-App, in einem **Königreich mit Rittern und Drachen** im
**Märchen-Stil** (seit 23.11., siehe Punkt 9):
1. **Kämpfe in Echtzeit** in einer Arena von schräg oben. Sie sind die Missionen: mal Duell eins gegen eins, mal
   Wellen von Gegnern. ← **gebaut**
2. **Eigenes Dorf mit festen Bauplätzen** als Zuhause. Missionen bringen Rohstoffe (Holz, Stein, Gold, Zutaten).
   Gebäude wachsen in drei Stufen und machen stärker: Trainingsplatz (Aufleveln), Schmiede (Schaden), Zauberküche
   (Spezial), Taverne (neue Charaktere), Arena (Online-Duelle). ← erste Fassung gebaut
3. **Gegner:** Computer in zehn Stufen ← gebaut; **online gegen Freunde** ← offen.
4. **Jeder Charakter hat eine Verwandlung als Spezialfähigkeit.** ← für zwei Charaktere gebaut
5. **Hauptfigur: der Junge aus Anigosha**, das **Mädchen aus Anigosha** ist der zweite Charakter. Anigosha ist die
   eigene Anime-Quiz-App des Users (Repo `almaz6380/anigosha`), die Figuren gehören ihm. Vorlagen:
   `figuren/vorlagen/`. Junge: dunkelgrüne Stachelfrisur, Orange als Hauptfarbe. Mädchen: lila Pferdeschwanz,
   Olivgrün. Seit 23.11. tragen beide Fantasy-Kleidung (Punkt 9).
6. **Look:** Orte als Miniatur-Schaukasten (wie handgebaute Modell-Landschaften im Abendlicht), Figuren im
   gezeichneten Märchen-Stil (weich, verspielt, wie ein Bilderbuch).
7. Später gewünscht: Der Junge **wächst in drei Stufen** (**Knappe → Ritter → Drachenritter**), Tagesaufgaben,
   weitere Charaktere über die Taverne.

8. **Figurenwahl (entschieden 22.11.):** Alle starten **immer mit dem Jungen**. Das **Mädchen** kommt früh dazu:
   Sie tritt nach den ersten paar Missionen als Gegnerin auf und schließt sich nach dem Sieg an. **Weitere Figuren**
   gibt es später über die **Taverne**. Umbauen erst zusammen mit Dorf und Missionen; bis dahin
   bleibt die freie Wahl im Menü. ← mit dem Dorf umgesetzt (Mission 2)
9. **Richtung (entschieden 23.11.):** Auf seine Frage „passen Anime-Figuren, oder eher Ritter und Drachen?“
   wählte er die **Mischung**: Junge und Mädchen aus Anigosha bleiben die Helden, aber der Junge als
   Knappe/Ritter, das Mädchen als **junge Sturm-Magierin**. Die Welt ist ein Königreich mit Rittern, Raben-Armee
   und **Drachen als Endgegnern**. Stil: **Märchen-Fantasy**. Verwandlungen: Junge **Drachenpanzer** (im Code
   weiter `stein`), Mädchen **Sturm**. Alle Prompts in `FIGUREN.md` sind darauf umgeschrieben. Eine
   Drachen-Mission kommt, sobald ein Drachen-Modell da ist.

10. **Zwei Fassungen (Test, 23.11.):** Der User will die Figuren später vielleicht in einem Ego-Shooter nutzen.
   Deshalb wird der Knappe zweimal gebaut: **niedlich** (großer Kopf, für dieses Spiel) und mit **normalen
   Körpermaßen** (für spätere Spiele, fertige Bewegungen passen dann besser). Er glaubt, Tripo baut die zweite
   Fassung kostenlos; das prüft er selbst. Alle Bilder und GLB-Dateien werden in `eingang/` aufgehoben. Beide
   Fassungen in der Arena zeigen, dann entscheidet er, welche dieses Spiel bekommt.

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
| Anigosha-Figuren in Alltagskleidung (Pulli), Anime-Look, Wachstum Pulli → Abenteurer → Magier | ersetzt durch Helden in Ritter-/Magier-Kleidung im Märchen-Stil (23.11.) |

Die alten Prototypen liegen im privaten Repo `almaz6380/brainstorm`, Branch `claude/admiring-faraday-vea7ur`,
Ordner `welt-3d/` und `kulisse/`. Von dort stammt auch dieses Spiel (Ordner `arena/`). Seit 22.11.2026 liegt es in der Wurzel des Repos
`almaz6380/Unleashed-Kingdom` und wird nur noch hier weiterentwickelt.

## 4. Was fertig ist
- **Kampf:** Laufen (Steuerkreis links), Angriff als Dreier-Folge, Ausweichrolle (unverwundbar), Spezial
  (Verwandlung für 5 s bei voller Leiste), Zielhilfe, Schonfrist nach einer Schlagfolge.
- **Charaktere:** Junge (Drachenpanzer) und Mädchen (Sturm). Gegner: Rabenritter, Schergen, Hauptmann.
- **Modi:** Duell (2 Siege) und Wellen (3 Angriffe mit einem Leben).
- **Computer-Gegner** in zehn Stufen (Stufe kommt jetzt aus der Mission).
- **Dorf, erste Fassung (22.11.):** Startbild ist das Dorf mit fünf festen Bauplätzen und Rohstoff-Leiste
  (Holz, Stein, Gold, Zutaten). Trainingsplatz (+8 Leben je Stufe), Schmiede (+6 % Schaden), Zauberküche
  (Spezial-Leiste +12 % schneller), je drei Stufen. Taverne und Arena stehen da, sind als „bald“ markiert.
- **Zehn Missionen** nacheinander (Duelle und Wellen, Stufe 1 bis 7), jede öffnet die nächste; Wiederholen gibt
  die halbe Belohnung. Mission 2 ist das Duell gegen das Mädchen, danach ist sie wählbar. Stand wird gespeichert.
  Alle Missionen einmal geschafft reichen für etwa 65 % des vollen Ausbaus.
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

### Knappe aus Tripo (23.11.)
- Bild A ohne Umhang → Tripo → Retopo (Quad, 10.000) → als FBX per Google-Drive-Link geschickt. **Noch ohne
  Skelett.** Umgewandelt nach `modelle/knappe.glb` (18.600 Dreiecke, 0,9 MB). Test-Link: `?figur=knappe`, dort
  bewegt er sich mit einfachen Ersatz-Bewegungen (wippen, neigen, Überschlag, umfallen).
- Der User wollte die große Fassung (1,9 Mio. Flächen) auch testen; sie war zu groß für Chat und GitHub-Upload.
  **Er entscheidet selbst**, nicht für ihn mitentscheiden (er hat sich darüber geärgert). Große Dateien: Link über
  Google Drive, Dropbox oder WeTransfer, alle drei sind von hier erreichbar.
- Danach schickte er die große Fassung doch per Drive-Link: GLB, 16 MB (Tripo packt mit Meshopt), 1,88 Mio.
  Dreiecke, ohne Skelett. Unverändert eingebaut als `?figur=knappe-gross`, damit er auf dem Handy vergleicht
  (Anzeige: Ladezeit und Bilder/s). Im simulierten Browser ohne Grafikkarte: klein 5 Bilder/s, groß 1 Bild/s,
  also etwa fünfmal langsamer; echte Handy-Werte fehlen noch. Sie wirkt schlanker, eventuell Fassung B: nachfragen.
- **Ergebnis vom echten Handy (23.11.):** beide Fassungen gleich flüssig. Er nimmt auf Empfehlung die **kleine**
  (kürzere Ladezeit übers Handynetz, mehrere Figuren gleichzeitig, Rig in Tripo zuverlässiger). Seine Kritik: Die
  Figur „schwebt“ und ist starr, weil das Skelett fehlt. Ersatz-Bewegungen können keine Beine bewegen.
- **Rig geschafft (23.11.):** schlanke Fassung, Retopo (Quad 10.000, 40 Credits) + Rig Humanoid/Mixamo (20 Credits).
  Tripo bot ihm keine Bewegungen an. FBX hatte Skelett, aber keine Farb-Textur (aus dem Retopo-GLB übernommen).
  Bewegungen jetzt selbst im Code (`knochenBewegung`). Test-Link `?figur=knappe`. Wenn er zufrieden ist: zum
  normalen Jungen machen (`AUSSEHEN.junge`). Für schönere Bewegungen später mixamo.com (kostenloses Adobe-Konto).
- Alter nächster Schritt: in Tripo **Rig** (Humanoid) mit Stehen, Laufen, Schlag, Getroffen, Umfallen, dann fest einbauen.

## 5. Was noch Platzhalter ist
- **Dorf:** Das gemalte Dorf-Bild des Users ist drin (`bilder/dorf.webp`, 23.11.). Die Gebäude sind noch Emoji auf
  Holzschildern. Das Bild hat nur vier Bauplätze, die Arena steht deshalb unten auf dem Weg. Es ist nur 687 px breit
  und auf scharfen Handy-Bildschirmen leicht weich: falls es eine größere Fassung gibt, gleich ersetzen.
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
3. ~~Dorf mit festen Bauplätzen~~ und ~~Missionen mit Belohnungen~~: erste Fassung steht. Rückmeldung holen:
   Machen Bauen und Missionen Spaß? Sind die Missionen zu schwer (Wellen sind für mittlere Bots hart, siehe
   `sim.test.js`)? Danach Dorf-Bild einsetzen (Lage der Plätze in `PLÄTZE`), Taverne mit weiteren Figuren.
4. **Aufleveln der Figur** (Erfahrung aus Missionen), eventuell Tagesaufgaben.
5. **Wachstumsstufen** des Jungen, weitere Charaktere.
6. **Online-Duell gegen Freunde.** Vorlage ist das fertige Spiel des Users `almaz6380/Worm-Attack` (PeerJS,
   Gastgeber rechnet, Gast bekommt Spielstände). Die Simulation hier ist dafür schon wiederholbar gebaut.

## 8. Offene Fragen an den User
- Wie soll das Spiel heißen? („Arena“ ist nur ein Arbeitsname.)
- Rolle des Mädchens: Freischaltung ist entschieden (siehe 2.8). Offen: auch Begleiterin im Kampf?
- Sollen die Computer-Stufen sanfter ansteigen? (Für Bots liegen sie sehr weit auseinander.)
- Tränke: Er wählte „als Spezialfähigkeit je Charakter“. Tränke zum Einsammeln in der Arena sind damit nicht geplant.

## 9. So wird gearbeitet
- Vor jedem Commit: `node tests/sim.test.js`, dann `python3 -m http.server 8766 &` im Ordner des Spiels und
  `node tests/arena.test.js` (dauert ohne Grafikkarte einige Minuten). Danach die Bilder in `tests/screenshots/`
  ansehen und dem User die besten schicken.
- Kleine Commits auf Deutsch. Nach grünen Tests auf `main` pushen (GitHub Pages liefert `main` aus), dann prüfen,
  dass der Link die neue Fassung zeigt.
- Nach jeder größeren Änderung diese Datei und `CLAUDE.md` nachführen.
