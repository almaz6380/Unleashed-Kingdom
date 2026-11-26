# Analyse: Was ein richtig gutes Wikinger-Spiel braucht

Stand 26.11.2026. Geschrieben für den User (kein Programmierer), deshalb ohne Fachbegriffe.

## Worum es geht
Der User will die Richtung ändern: ein Wikinger-Spiel („Vikings“ als Arbeitstitel) mit Bauen, Clans, Spielersuche
und richtig guter 3D-Grafik. Er hat um eine ausführliche Analyse gebeten: was dafür nötig ist und was er selbst
beisteuern muss. Diese Datei ist die Analyse. Die Entscheidungen aus Abschnitt 9 stehen in `UEBERGABE.md`, sobald
er sie getroffen hat.

## Das Wichtigste vorweg
- **Wir fangen nicht bei null an.** Fast alles, was es schon gibt, passt auch zu Wikingern: der Echtzeit-Kampf, das
  Dorf mit Bauplätzen, die Missionen, der Weg von deinem Bild zur bewegten 3D-Figur, das Schwert, die
  Grafik-Stufen.
- **Drei große Dinge fehlen:**
  1. ein Spielsinn, der einen jeden Tag zurückholt,
  2. alles, was online ist (Konto, Spielersuche, Clans),
  3. eine schöne Umgebung mit Licht und Ton. Der Held sieht schon gut aus, alles um ihn herum ist noch Platzhalter.
- **Ehrlich zur Größe:** Clan-Spiele wie die großen aus dem App Store bauen ganze Teams über Jahre. Wir kommen
  trotzdem weit, wenn wir in Etappen bauen und jede Etappe für sich spielbar ist.
- **Online ändert zwei feste Regeln.** „Keine Schlüssel“ und „alles in einer Datei“ lassen sich dann nicht mehr
  halten. Der Start bleibt kostenlos, du brauchst aber ein Konto bei einem Online-Dienst.
- **Eigener Name, eigene Figuren.** Wikinger und nordische Sagen gehören allen. Namen, Figuren und Aussehen aus der
  Serie „Vikings“ oder aus bekannten Wikinger-Spielen übernehmen wir nicht. „Vikings“ bleibt Arbeitstitel.

## 1. Spielsinn: Warum spielt man das jeden Tag?
Vorschlag: Du bist der junge Anführer eines kleinen Wikingerdorfs am Fjord.

1. **Raubzug:** ein Echtzeit-Kampf, wie es ihn schon gibt. Er bringt Beute: Holz, Eisen, Silber, Vorräte.
2. **Dorf ausbauen:** Gebäude machen dich stärker und liefern Rohstoffe von selbst, auch wenn du nicht spielst.
3. **Stärker werden:** Ausrüstung schmieden (Axt, Schild, Helm), Krieger anwerben. Der Held wächst vom Knecht zum
   Krieger zum Jarl.
4. **Weiter hinaus:** Langschiff bauen, neue Inseln, Endgegner aus den Sagen (Frostriese, Seeschlange, Drache).
5. **Gegen andere:** Dörfer anderer Spieler überfallen, Zweikampf, Rangliste.
6. **Clan:** gemeinsame Ziele, Clan gegen Clan.

Was Spieler täglich zurückholt:
- Rohstoffe, die sich über Nacht ansammeln
- Tagesaufgaben
- Bauzeiten, die ablaufen
- Clan-Ziele der Woche
- eine Rangliste, die jede Saison neu beginnt

Davon gibt es heute den Kampf, drei Gebäude und zehn Missionen. Alles andere fehlt.

## 2. Die Bausteine
| Baustein | Stand heute | Was fehlt | Aufwand | Was du lieferst |
| --- | --- | --- | --- | --- |
| Kampf | fertig, mit echten Bewegungen | Axt und Schild, Blocken, mehr Gegner, Endgegner | mittel | Figuren und Waffen aus Tripo |
| Dorf und Bauen | 5 Plätze, 3 Gebäude mit je 3 Stufen | mehr Gebäude (Langhaus, Werft, Methalle, Runenstein), Rohstoffe über Zeit, Bauzeiten | mittel | Dorf-Bild, Gebäude als Bilder oder Modelle |
| Raubzüge | 10 Missionen als Liste | Karte mit Inseln, kleine Geschichte, Endgegner | mittel | Karten-Bild, Gegner-Figuren |
| Ausrüstung und Krieger | Verwandlung mit Schwert | schmieden, anlegen, Krieger sammeln | mittel | Waffen, weitere Figuren |
| Tagesaufgaben | nichts | Aufgaben und Belohnungen | klein | nichts |
| Ton und Musik | Pieptöne | echte Geräusche und Musik | klein | Auswahl treffen |
| Konto, Spielstand im Netz | Spielstand nur auf einem Gerät | Konto, Speichern im Netz | mittel | Konto beim Online-Dienst |
| Überfälle auf andere Spieler | nichts | fremdes Dorf laden, Computer verteidigt, Beute, Schutzzeit | groß | nichts |
| Rangliste und Saisons | nichts | Punkte, Ligen, Belohnungen | mittel | nichts |
| Clans | nichts | gründen, beitreten, Clan-Schatz, Clan-Ziele, Clan gegen Clan | groß | Entscheidung zum Chat |
| Live-Duell mit Spielersuche | Kampf ist vorbereitet (läuft exakt wiederholbar) | Suche, Verbindung, Ausgleich von Verzögerung | groß | Freunde zum Testen |
| Echte App im Store | Web-App für den Startbildschirm | Verpackung als App, Prüfung durch den Store | mittel | Store-Konto (kostet) |

## 3. Online mit Supabase
Supabase ist ein Online-Dienst, der für uns den Server spielt.

**Was er für uns übernimmt:**
- **Konto:** zuerst ein Gastkonto ohne E-Mail. Später kann man es mit E-Mail, Apple oder Google verknüpfen. Dann geht
  der Fortschritt beim Handywechsel nicht verloren.
- **Spielstand und Listen:** Dorf, Clans, Rangliste, Kampfberichte.
- **Live-Kanäle:** wer ist online, wer sucht einen Gegner, was passiert im Clan.
- **Prüfprogramme:** kleine Programme auf dem Server, die Ergebnisse kontrollieren.

**Zwei Arten, gegen andere zu spielen:**
- **Überfall, zeitversetzt (zuerst bauen):** Du greifst das Dorf eines anderen Spielers an, der Computer verteidigt
  es. Das klappt immer, auch mit nur zehn Spielern.
- **Live-Duell:** Beide müssen zur selben Zeit online sein. Mit wenigen Spielern findet die Suche oft niemanden.
  Dann helfen ein Computer-Gegner oder ein Freundes-Code. Supabase bringt die zwei zusammen, der Kampf selbst läuft
  direkt von Handy zu Handy, wie in deinem Worm Attack.

**Schummeln:** Ein Spiel im Browser kann jeder verändern und falsche Siege melden. Unser Vorteil: Der Kampf lässt
sich exakt nachrechnen. Der Server kann einen gemeldeten Kampf nachspielen und nur echte Siege werten. Das braucht
es, sobald es eine Rangliste gibt.

**Grenzen des kostenlosen Tarifs** (mein Stand von Mitte 2026, bitte auf der Preisseite nachsehen):
- etwa 500 MB Daten
- etwa 50.000 Spieler im Monat
- etwa 200 gleichzeitig verbundene Spieler
- Nach einer Woche ohne Nutzung pausiert das Projekt. Du musst es dann von Hand wieder starten.
- Der Bezahl-Tarif kostet etwa 25 Dollar im Monat. Den braucht es erst bei vielen Spielern.

**Was ich von dir brauche:**
1. Ein Supabase-Konto (geht mit deinem GitHub-Login) und ein Projekt mit Standort Frankfurt.
2. Die Projekt-Adresse und den **öffentlichen** Schlüssel. Der darf im Spiel stehen. Den **geheimen** Schlüssel
   schickst du nie in den Chat und er kommt nie ins Repo.
3. Meine Einrichtungs-Texte in Supabase einfügen (kopieren und einfügen).
4. Eine Freigabe, damit ich den Server von hier aus zum Testen erreiche. Darum bitte ich dich, wenn es so weit ist.

**Verantwortung, sobald Fremde mitspielen:**
- Eine öffentliche Seite mit Konten braucht eine Datenschutzerklärung und ein Impressum.
- Bei Kindern gelten strengere Regeln.
- Freier Chat braucht Melden, Sperren und einen Wortfilter.
- Meine Empfehlung: im Clan zuerst nur feste Sätze und Zeichen, kein freier Text.
- Ich bin kein Anwalt. Vor einem öffentlichen Start solltest du das prüfen lassen.

## 4. Richtig gute 3D-Grafik
Gute Grafik kommt weniger von mehr Flächen als von Stil, Umgebung, Licht, Bewegung und Ton.

| Bereich | Heute | Für „richtig gut“ | Was du lieferst |
| --- | --- | --- | --- |
| Figuren | Held fein, Mädchen und Gegner Platzhalter | alle im selben Stil, etwa 80.000 Flächen, scharfe Farben | je Figur: Bild, Tripo, Mixamo |
| Umgebung | Kampfplatz aus Farbflächen | echte Kulisse: Platz am Fjord, Felsen, Langhäuser, Wasser, Himmel, Nebel | Kulissen-Teile aus Tripo |
| Licht und Oberflächen | einfaches Licht, feine Oberflächen entfernt | Abendlicht, Fackeln, Glanz auf Metall, Stoffstruktur, Leuchten um Feuer | nichts |
| Bewegungen | 8 für den Helden | Axt- und Schild-Bewegungen, Jubel, Varianten | Mixamo-Dateien |
| Effekte | Funken, Schlagbogen | Waffenspuren, Staub, Schnee, Feuer, Gischt | nichts |
| Dorf | gemaltes Bild mit Symbolen | Gebäude-Bilder je Stufe oder ein echtes 3D-Dorf | Bilder oder Modelle |
| Bedienung | Standard-Knöpfe und Emoji | eigene Symbole, Rahmen und Schrift im Wikinger-Look | Symbol-Bilder |
| Ton | Pieptöne | Schläge, Schritte, Meer, Trommeln, Musik | Auswahl aus freien Quellen |
| Laden | alles auf einmal | Ladebild, kleinere Dateien, nach dem ersten Laden auch ohne Netz | nichts |

- **Was erreichbar ist:** Auf einem iPhone 15 kann das Spiel im Browser aussehen wie ein gutes Handy-Spiel aus dem
  Store. Konsolen-Grafik wird es nicht.
- **Tripo-Credits:**
  - Eine Figur mit Skelett kostet nach dem, was ich bei dir gesehen habe, etwa 120 Credits. Ein Gegenstand kostet
    70 bis 100.
  - Eine gute erste Fassung braucht etwa 25 bis 35 Modelle, also 2.500 bis 4.000 Credits.
  - Du hast etwa 2.900. Das reicht knapp.
  - Ein echtes 3D-Dorf braucht 20 oder mehr Modelle zusätzlich.

## 5. Umbau am Code
- **Mehrere Dateien:** Das Spiel steckt in einer Datei mit rund 880 Zeilen. Für ein großes Spiel teile ich es in
  mehrere Dateien auf (Kampf, Dorf, Online, Grafik). Die Regel „alles in `index.html`“ fällt weg. Ein Bauwerkzeug
  braucht es weiterhin nicht.
- **Spielstand:** Er zieht vom Gerät ins Netz. Eine Kopie bleibt auf dem Gerät, damit man auch ohne Netz spielen
  kann.
- **Tests:** Die vorhandenen bleiben. Dazu kommen Tests für Konto, Überfall und Clan.

## 6. Konten und Kosten
| Was | Kosten | Wofür |
| --- | --- | --- |
| GitHub Pages | 0 | liefert das Spiel aus (hast du) |
| Supabase, kostenloser Tarif | 0 | Konten, Spielstände, Clans, Spielersuche |
| Supabase, Bezahl-Tarif | etwa 25 Dollar im Monat | erst bei vielen Spielern |
| Tripo | Credits | 3D-Figuren und Gegenstände (hast du) |
| Mixamo | 0 | Bewegungen (hast du) |
| Gemini oder kie.ai | je nach deinem Tarif | Bilder (hast du) |
| Geräusche und Musik | 0 bei freien Quellen | Ton |
| Eigene Adresse fürs Spiel | etwa 10 bis 15 Euro im Jahr | freiwillig |
| Apple App Store | 99 Dollar im Jahr | nur für eine echte App |
| Google Play | 25 Dollar einmalig | nur für eine echte App |

## 7. Risiken
- **Zu viel auf einmal.** Deshalb Etappen, jede spielbar.
- **Leere Spielersuche** bei wenigen Spielern. Deshalb zuerst Überfälle und Computer-Gegner.
- **Verzögerung im Live-Duell.** Bei einem schnellen Kampf spürt man jede Zehntelsekunde. Das muss man mit Freunden
  ausprobieren.
- **Du bist der Engpass bei Figuren und Bildern.** Jede Figur braucht deine Arbeit in Tripo und Mixamo. Der Weg
  steht jetzt, es geht schneller als beim Knappen.
- **Chat und Recht**, siehe Abschnitt 3.

## 8. Empfohlene Reihenfolge
| Etappe | Inhalt | Was du lieferst |
| --- | --- | --- |
| 1. Wikinger-Look | Held als Wikinger mit Axt und Schild, ein Gegner, ein Kampfplatz mit echter Kulisse, Licht und Ton. Ein Kampf, der richtig gut aussieht. | 2 Figuren, Waffen, Kulissen-Teile, neues Dorf-Bild |
| 2. Spielsinn | Rohstoffe über Zeit, mehr Gebäude, Ausrüstung, Raubzug-Karte, Tagesaufgaben | Gebäude, Karten-Bild, weitere Gegner |
| 3. Konto | Gastkonto, Spielstand im Netz | Supabase-Konto |
| 4. Überfälle und Rangliste | fremde Dörfer angreifen, Punkte, Saison | nichts |
| 5. Clans | gründen, beitreten, Clan-Ziele, feste Sätze | Entscheidung zum Chat |
| 6. Live-Duell | Spielersuche, Freundes-Code | Freunde zum Testen |
| 7. Später | echte App, Clan gegen Clan, neue Inseln | Store-Konto |

## 9. Entscheidungen, die ich von dir brauche
1. **Umbauen oder neu anfangen?** Ich empfehle umbauen. Kampf, Dorf, Missionen und der Figuren-Weg bleiben, nur
   Aussehen und Texte werden zu Wikingern.
2. **Stil:** Bleibt der freundliche Märchen-Stil, oder soll es rauer und ernster werden?
3. **Held:** Bleibt der Junge aus Anigosha als junger Wikinger in neuer Kleidung, oder kommt eine neue Figur?
4. **Dorf:** gemaltes Bild mit Gebäude-Bildern (schnell, kaum Credits) oder echtes 3D-Dorf (schöner, viele Modelle)?
5. **Supabase:** Bist du einverstanden, ein Konto anzulegen und die Regel „keine Schlüssel“ auf „keine geheimen
   Schlüssel“ zu ändern? Das brauche ich erst in Etappe 3.
6. **Clan-Verständigung:** feste Sätze oder freier Chat? Das brauche ich erst in Etappe 5.

## 10. Nach der Analyse entschieden (26.11.2026)
Der User hat vier der Fragen beantwortet, teils anders als empfohlen:
- **Neu anfangen** statt umbauen. Das alte Spiel ist nur noch Vorlage.
- **Kampf:** Krieger werden einzeln losgeschickt und kämpfen von selbst. Einige Figuren, zum Beispiel der Anführer,
  haben eine Spezialfähigkeit. Die Abschnitte 1, 2 und 8 oben gehen noch vom selbst gesteuerten Helden aus und
  müssen entsprechend gelesen werden: Etappe 1 ist jetzt ein Probekampf mit losgeschickten Kriegern.
- **Held:** eine neue Figur, ein junger Wikinger, der Anführer.
- **Dorf:** gemaltes Bild mit Gebäude-Bildern.
- **Stil:** offen, er wählt nach drei Probe-Bildern.

### Stil-Proben: der Anführer in drei Stilen
Dieselbe Figur, dreimal anders gemalt. Haltung und Hintergrund sind schon so, dass das Bild direkt in Tripo kann.

Freundlich (Märchen-Stil):
```
A single young Viking chieftain, about 20 years old, dark blond hair tied back with a few loose strands, light stubble, a grey wolf-fur mantle over the shoulders, a deep blue wool tunic with a simple woven trim, a wide leather belt with a round bronze buckle, leather bracers, wrapped leg bindings and sturdy leather boots, no helmet, no weapons. Storybook fairy-tale fantasy style, soft painterly shading, gentle clean outlines, warm friendly colors, a confident friendly smile, realistic body proportions with the head only slightly larger than normal. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, plain light grey background, even lighting, no ground shadow, no text.
```

Kräftig (dazwischen):
```
A single young Viking chieftain, about 20 years old, dark blond hair tied back with a few loose strands, light stubble, a grey wolf-fur mantle over the shoulders, a deep blue wool tunic with a simple woven trim, a wide leather belt with a round bronze buckle, leather bracers, wrapped leg bindings and sturdy leather boots, no helmet, no weapons. Stylized game character art, bold chunky shapes with a strong clear silhouette, slightly exaggerated broad shoulders and big hands, hand-painted textures, cool northern color palette with one strong accent color, determined expression. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, plain light grey background, even lighting, no ground shadow, no text.
```

Rau und ernst:
```
A single young Viking chieftain, about 20 years old, dark blond hair tied back with a few loose strands, light stubble, a grey wolf-fur mantle over the shoulders, a deep blue wool tunic with a simple woven trim, a wide leather belt with a round bronze buckle, leather bracers, wrapped leg bindings and sturdy leather boots, no helmet, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin with a small scar on the cheek, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, plain light grey background, even lighting, no ground shadow, no text.
```
