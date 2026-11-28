# Übergabe – Stand 28.11.2026

Dieses Dokument ist für eine neue Claude-Sitzung ohne Vorwissen. Lies es zuerst, danach `CLAUDE.md`
(Regeln, Kampfwerte, Aufbau des Codes).

> **Richtungswechsel am 26.11.2026: neues Wikinger-Spiel („Vikings“ als Arbeitstitel).** Der User will Bauen, Clans,
> Spielersuche über Supabase und richtig gute 3D-Grafik. Die Analyse dazu steht in
> [`VIKINGS-ANALYSE.md`](VIKINGS-ANALYSE.md): Spielsinn, Bausteine, Online, Grafik, Kosten, Etappen.
> **Das neue Spiel liegt im Ordner [`vikings/`](vikings/); lies dafür [`vikings/CLAUDE.md`](vikings/CLAUDE.md).**
>
> **Von ihm entschieden (26. und 27.11.):**
> - **Neu anfangen**, nicht umbauen. Ich hatte Umbauen empfohlen, er entscheidet. Das bisherige Spiel bleibt
>   unverändert liegen und dient nur als Vorlage: wiederholbare Kampf-Rechnung, Tests, Figuren-Weg über Tripo und
>   Mixamo, Grafik-Stufen.
> - **Kampf:** „Figuren einzeln losschicken und einige Figuren (wie bspw. der Wikingerführer) haben
>   Spezialfähigkeit“. **Zuerst Raubzüge auf Dörfer, später auch Feldschlachten** (seine Antwort: „Beides“).
>   Einen selbst gesteuerten Helden gibt es nicht mehr.
> - **Held:** eine ganz neue Figur, der junge Anführer: „etwas blonder, mit Tattoos und seitliche Haare abrasiert
>   und mit Zopf und minimal mehr Bart (ca. 7 cm)“. Nicht mehr der Junge aus Anigosha.
> - **Stil:** Er hat ein Bild des Anführers im rauen, fast echten Stil geschickt (Wolfspelz, blaue Tunika, Tattoos
>   an Unterarmen und Hals). Das ist die Richtung. Die Prompts stehen in Abschnitt 10 der Analyse.
> - **Dorf:** gemaltes Bild mit Gebäude-Bildern in Stufen, kein 3D-Dorf.
> - **Qualität der Figuren (27.11.):** „Nein, wir machen es nicht mit 10000 in 2K. Ich will eine bessere Qualität
>   für das Spiel.“ Vereinbart: Er exportiert aus Tripo **nur einmal, in der höchsten Qualität** (ohne Retopo,
>   größte Textur, GLB). Die kleine Hilfsfigur, die Mixamo für das Skelett braucht, bauen wir selbst aus diesem
>   Export; sie ist im Spiel nie zu sehen. Die Figur im Spiel entsteht wie beim Knappen aus dem großen Export
>   (`werkzeug/knappe-fein.mjs` als Vorlage). **Wie fein sie wird, entscheidet er**: ihm zwei oder drei Fassungen
>   zum Vergleichen am Handy bauen, nicht für ihn festlegen. Bedenken ehrlich nennen: Im Raubzug stehen bis zu 18
>   Figuren zugleich auf dem Feld; den Anführer gibt es nur einmal, er darf deshalb am feinsten sein.
> - Später zu klären: Supabase-Konto und Schlüssel-Regel (Etappe Konto), Clan-Chat (Etappe Clans), eigener Name.
>
> **Gebaut (27.11.): der erste Probekampf** unter `https://almaz6380.github.io/Unleashed-Kingdom/vikings/`. Ein
> Raubzug auf ein Beispiel-Dorf, alles Sichtbare ist Platzhalter. Karte wählen, auf den Strand tippen, die Krieger
> kämpfen von selbst, der Anführer hat den Kriegsschrei. Regeln getrennt vom Bild (`vikings/js/sim.js`), wiederholbar
> und aus den aufgezeichneten Eingaben exakt nachrechenbar. Geprüft nur ohne Browser und im simulierten Handy.
> **Er hat ihn noch nicht gespielt:** als Erstes seine Rückmeldung holen (Macht das Losschicken Spaß? Zu leicht, zu
> schwer? Ist das Feld gut zu erkennen?).
>
> **Der Anführer ist da (27.11.):** Tripo-Export in höchster Qualität (4,95 Mio. Dreiecke, 4K-Texturen, 153 MB,
> per Drive-Link). Daraus gebaut: Master mit 1 Mio. Dreiecken (`vikings/eingang/`), drei Fassungen zum Vergleichen
> (80.000 / 250.000 / 600.000 Flächen, `vikings/modelle/`), die ZIP für Mixamo (`vikings/eingang/`) und die
> Ansichts-Seite `https://almaz6380.github.io/Unleashed-Kingdom/vikings/figur.html`. Die Figur sieht sehr gut aus.
> Im Raubzug von oben ist zwischen den Fassungen kein Unterschied zu sehen, ganz nah schon (Fell, Gesicht).
>
> **Der Anführer bewegt sich (27.11.):** Mixamo hat die ZIP angenommen. Der User hat sechs Bewegungen geschickt
> (Stehen, Laufen, Hieb von oben, Hieb seitlich, Kriegsschrei, Fallen). Sie sind in alle drei Feinheiten eingebaut,
> die Ansichts-Seite spielt sie ab, und **der Anführer läuft im Probekampf mit** (vorläufig in der mittleren Feinheit
> 250k, weil er noch nicht gewählt hat). Er schlägt noch mit leerer Hand, die Axt fehlt.
>
> **Sein Tripo-Abo läuft bald aus (27.11.).** Er will alle Modelle vorher erzeugen und hat dafür **alle Bild-Prompts
> auf einmal** bekommen: [`vikings/FIGUREN.md`](vikings/FIGUREN.md), 37 Stück, nach Dringlichkeit: (1) alles für den
> Raubzug (Axtkämpfer, Schildträger, Bogenschützin, Dorfwache, fünf Waffen, vier Gebäude, Langschiff), (2) Gebäude
> fürs eigene Dorf, (3) weitere Krieger und Gegner, (4) Endgegner aus den Sagen. **Gruppen 2 bis 4 sind mein Vorschlag
> aus der Analyse, von ihm noch nicht entschieden.** Er fragte nach, wofür die Figuren genau gebraucht werden; die
> Antwort steht im Chat vom 27.11. (Gruppe 1 ersetzt die Platzhalter des Probekampfs, der Rest ist für spätere Etappen).
> Mixamo kostet nichts und läuft nicht ab, eilig sind nur die Tripo-Modelle.
>
> **Der Axtkämpfer ist da (28.11.):** erstes Modell aus der Liste, diesmal aus der **Tripo-App am Handy**
> (1,96 Mio. Dreiecke, 4K-Texturen, gepackt nur 17 MB). Die App liefert die Figur zur Seite gedreht und mit der Mitte
> im Ursprung; `vikings/werkzeug/figur-stufen.mjs` erkennt das jetzt und dreht sie nach vorn auf den Boden. Die Figur
> ist sauber (Finger einzeln, Lücke zwischen den Beinen, Rücken in Ordnung; Augen etwas blass, Stirn glänzt ganz nah).
> Im Repo: das Original (`vikings/eingang/axtkaempfer-original.glb`) und die ZIP für Mixamo
> (`vikings/eingang/axtkaempfer-fuer-mixamo.zip`, 180 cm). **Er hat die ZIP bekommen und lädt in Mixamo fünf
> Bewegungen** (wie beim Anführer, ohne Kriegsschrei) und schickt sie im Chat. Danach nach dem freigegebenen Plan:
> `baue-anfuehrer.mjs` für mehrere Figuren verallgemeinern, drei Feinheiten mit Skelett nach `vikings/modelle/`,
> im Probekampf die sechs Axtkämpfer ersetzen (vorläufig 80k, Anführer bleibt 250k, `?figur=` schaltet alle um),
> auf der Ansichts-Seite eine Auswahl der Figur. Die Fassungen ohne Skelett liegen nicht im Repo; sie entstehen in
> einer Minute aus dem Original.
>
> **Sein Urteil zum Axtkämpfer (28.11.):** Er fragte „nur in Ordnung oder gut?“. Ehrliche Antwort: Körper und
> Kleidung gut, Gesicht und Haare nur in Ordnung, klar schwächer als der Anführer; im Raubzug von oben sieht man es
> nicht. Er sagte „Ok nächste Figur“, **behält ihn also**. Er will solche klaren Urteile: bei jeder Figur sagen, ob
> sie gut ist oder nur in Ordnung, und mit dem Anführer vergleichen.
>
> **Die Bogenschützin ist da (28.11.), sie ist gut:** 1,93 Mio. Dreiecke, 4K, direkt im Chat geschickt (18 MB gehen
> also). Original und ZIP für Mixamo (170 cm) liegen in `vikings/eingang/`, die ZIP hat er. Sie braucht statt der
> Hiebe einen Bogenschuss; den Mixamo-Namen konnte ich nicht nachschlagen (aus dem Gedächtnis „Shooting Arrow“, Suche
> „arrow“). **Zwischenfall:** Drei Figuren hatte er in der Tripo-App versehentlich mit dem **Gitter** statt dem
> **Diamanten** erzeugt (graues grobes Netz ohne Farbe, unbrauchbar); erklärt, er erzeugt sie neu. Der Schildträger
> (1.2) kommt noch. Links auf die Tripo-Seite kann ich nicht öffnen (Sperre gegen Programme), er schickt die Dateien.
> Unter seinen Tripo-Figuren steht „Öffentlich“; darauf hingewiesen, seine Sache.
>
> **Ablauf je Figur, von ihm als Plan freigegeben (28.11.):** Datei kommt → sofort ansehen (`figur-bilder.cjs`) →
> Bilder und Urteil an ihn → Original und ZIP für Mixamo ins Repo, ZIP an ihn → Notizen, Tests, Commit. Einbau ins
> Spiel, sobald die Mixamo-Bewegungen da sind. Bei Waffen und Gebäuden entfällt Mixamo. Seine App steht oft im
> Planungs-Modus: dann erst lesen, kurzen Plan schreiben, freigeben lassen.
>
> **Platz im Blick behalten:** Je Figur etwa 17 MB Original und 15 MB für drei Feinheiten. Für die Figuren des
> Raubzugs reicht das, bei allen 37 Modellen wird es eng (GitHub Pages: höchstens 1 GB, ausgeliefert wird alles auf
> `main`). Sobald er die Feinheit gewählt hat, fallen die übrigen Fassungen weg; für die Originale dann einen
> Vorschlag machen (zum Beispiel ein eigener Zweig, der nicht ausgeliefert wird). Ihm gesagt: **Originale im Drive
> nicht löschen.** Seine Tripo-Credits (28.11.): 2860, ein Modell kostet 55.
>
> **Als Nächstes:** (1) Seine Mixamo-Dateien für Axtkämpfer und Bogenschützin einbauen (siehe oben). (2) Seine Wahl der Feinheit
> (er entscheidet, nicht vorgeben) und Rückmeldung zum Probekampf. (3) Weitere Modelle aus Tripo annehmen, sobald er
> Links schickt: je Figur zuerst ansehen und ihm Bilder schicken (bei Fehlern kann er neu erzeugen, solange das Abo
> läuft), dann `figur-stufen.mjs`, ZIP für Mixamo, Bewegungen einbauen (Schritte in `vikings/CLAUDE.md`); Waffen an
> die Hand hängen; Gebäude statt der Klötze einsetzen. (4) Danach Etappe 2 der Analyse: eigenes Dorf.
> Alles Weitere in dieser Datei beschreibt das alte Spiel (Königreich mit Rittern und Drachen).
> Name, Figuren und Aussehen aus der Serie „Vikings“ oder aus bekannten Wikinger-Spielen werden nicht übernommen.

## 1. Mit wem du arbeitest
- Der User ist **kein Programmierer**, schreibt **kurz und auf Deutsch** und arbeitet meist **am Handy**. Für
  Tripo und Mixamo nutzt er inzwischen auch einen Mac. Dateien schickt er direkt im Chat (18 MB gingen am 28.11.).
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
- Rückmeldung: „schlägt nicht mit der Faust, Laufen nicht flüssig“. Er wählte **beides**: (A) ich verbessere selbst
  (Faust, Kampfstellung, Laufen nach echter Strecke ohne Rutschen, gerade Schläge, Aufwärtshaken) – erledigt;
  (B) er holt echte Bewegungen von mixamo.com (Anleitung im Chat: Fighting Idle, Running, Jab Cross/Punching,
  Hook/Uppercut, Hit Reaction, Dying, Sprinting Forward Roll; FBX Binary, Without Skin, 30 fps, In Place; alles als
  ZIP per Drive-Datei-Link). Dann Bewegungen in `modelle/knappe.glb` einfügen wie `werkzeug/baue-figuren.mjs`.
- **Mixamo geschafft (24.11.):** Tripo-FBX lehnte Mixamo ab, die von mir gebaute OBJ-ZIP nahm es an. Der User hat
  7 Bewegungen geladen und im Chat geschickt. `modelle/knappe.glb` hat jetzt echte Bewegungen (Kampfstellung,
  Laufen, Jab, Cross, Uppercut, Treffer, Umfallen, Rolle). Test-Link `?figur=knappe`. Offen: Rückmeldung vom Handy,
  dann zum festen Jungen machen (`AUSSEHEN.junge`).
- **24.11.: Knappe ist fest der Junge.** Spezial auf seinen Wunsch: **Verwandlung mit Schwert** (Drachenpanzer, orange
  glühend, leuchtendes Schwert aus Grundformen in der rechten Hand, Hiebe weiter und im Halbkreis). Er wählte das
  Schwert „im Spiel gebaut“ statt aus Tripo; ein echtes Schwert-Modell kann später ersetzen. Balance unverändert
  (Junge–Rabenritter 45 %). Offen: Rückmeldung zum Schwert vom Handy; schönere Schwerthiebe gäbe es auf Mixamo
  („Great Sword Slash“) für dieselbe Figur.
- **25.11.:** Das Schwert aus Grundformen fand er „sehr schlecht“ → entfernt. Er macht das Schwert in Tripo
  (Prompt im Chat und in `FIGUREN.md`, ohne Rig, Retopo ~3.000 Flächen, Datei im Chat). Bis dahin Verwandlung ohne
  sichtbares Schwert, Regeln (Reichweite ×1,5, Halbkreis) bleiben. Danach: `SCHWERT.datei` setzen, Lage prüfen,
  fragen, ob die Hiebe passen (sonst Mixamo-Schwerthiebe).
- **25.11.: Qualität.** Er fragte, ob ein iPhone 15 nicht mehr schafft (ja: sein Test zeigte 2 Mio. Flächen flüssig).
  Entscheidung: **mittlere Qualität** (Figuren ~80.000 Dreiecke, Texturen 2K) plus **Grafik-Stufen** hoch/sparsam
  mit automatischer Messung und Schalter im Dorf. Knappe ist jetzt fein (aus seinem großen Export, Skelett
  übertragen, er musste nichts tun). Schwert: Retopo auf 10.000, GLB 2K, Datei im Chat – steht noch aus.
- **25.11.: Schwert aus Tripo ist drin** (`eingang/schwert.glb` → `modelle/schwert.glb`, Retopo Quad 10.000, Farben 2K).
  Liegt in der rechten Faust, erscheint bei der Verwandlung. Offen: Gefällt es ihm, passen die Hiebe (sonst
  Mixamo-Schwerthiebe)?
- **25.11.:** Schwert passt ihm. „Nach dem Sieg bewegt er sich komisch“ → behoben: am Rundenende kommen Überlebende
  zur Ruhe (kein Weiterlaufen/eingefrorener Schlag, Verwandlung endet), Sieger dreht sich zur Kamera. Angeboten:
  Jubel-Bewegung von Mixamo („Victory“) als `jubel`.
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
**Seit 27.11. gilt die Liste oben im Kasten** (Rückmeldung zum Probekampf, Anführer aus Tripo, dann das eigene
Dorf). Die Liste darunter ist der Plan des alten Spiels und gilt nicht mehr.
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
- Neues Spiel: `node vikings/tests/sim.test.mjs`, dann mit laufendem Server (im Repo-Ordner gestartet)
  `node vikings/tests/raubzug.test.cjs`, Bilder in `vikings/tests/screenshots/`.
