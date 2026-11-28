# Vikings: Bild-Prompts für Tripo

**Schon da (Stand 28.11.2026):** 1.1 Axtkämpfer (Körper und Kleidung gut, Gesicht und Haare nur in Ordnung; der User
behält ihn), 1.2 Schildträger (sehr gut, aber nur mit 2K-Texturen exportiert), 1.3 Bogenschützin (gut), 1.4 Dorfwache
(gut). **Damit sind alle vier Figuren des Raubzugs da.** Es fehlen aus Gruppe 1: die fünf Waffen (1.5 bis 1.9), die
vier Gebäude (1.10 bis 1.13) und das Langschiff (1.14).

**In der Tripo-App am Handy:** Unter dem Bild liegen zwei Zeichen. **Diamant** = feine Stufe mit Farbe (richtig).
**Gitter** = grobes graues Netz ohne Farbe (unbrauchbar). Vor „Generieren“ muss der Diamant hell hinterlegt sein,
keine Stilvorlage antippen. Die fertige GLB direkt im Chat schicken (geht bis etwa 20 MB) oder als Drive-Link; Links
auf die Tripo-Seite lassen sich nicht öffnen.

Seit 28.11. steht in allen Figuren-Prompts zusätzlich „sharp detailed face with clearly visible eyes“ und ein
Hochformat, das die Figur fast ausfüllt (das Gesicht des Axtkämpfers war schwach). Ob das hilft, ist offen: Die
Bogenschützin wurde noch ohne die Zusätze gut.

Stand 27.11.2026. Alle Bilder im selben rauen, fast echten Stil wie der Anführer. Der User erzeugt die Bilder (Gemini oder
kie.ai), macht daraus in Tripo 3D-Modelle und schickt sie als Drive-Link. **Sein Tripo-Abo läuft bald aus**, deshalb
stehen hier alle Prompts auf einmal, nach Dringlichkeit geordnet.

So geht es weiter wie beim Anführer:
- In Tripo aus dem Bild das Modell erzeugen, **höchste Qualität, ohne Retopo, als GLB** exportieren.
- Den Link zur Datei schicken (nicht zum Ordner).
- Figuren stehen mit leeren Händen da, Waffen sind eigene Modelle und kommen im Spiel an die Hand.
- Vor Tripo prüfen: Arme stehen vom Körper ab, Hände und Füße sind ganz zu sehen, der Hintergrund ist leer.
- Mixamo kostet nichts und läuft nicht ab. Eilig sind nur die Modelle aus Tripo.
- Die Gebäude und der Inhalt des eigenen Dorfs (Abschnitt 2) sind ein Vorschlag aus der Analyse, noch keine Entscheidung.

Der Anführer selbst ist fertig (Prompts in `../VIKINGS-ANALYSE.md`, Abschnitt 10).

## 1. Zuerst: alles für den Raubzug
Diese 14 braucht der Probekampf, damit kein Platzhalter mehr zu sehen ist.

**1.1 Axtkämpfer**
```
A single young Viking raider in his late twenties, lean and wiry, shoulder-length brown hair with two thin braids at the temples, a short brown beard, a rust-red wool tunic with the sleeves torn off at the shoulders, bare muscular arms with a few simple dark blue tattoos, a brown leather belt, dark grey trousers, wrapped leg bindings and leather boots, no helmet, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**1.2 Schildträger**
```
A single big heavy-set Viking warrior in his forties with very broad shoulders, a thick red-brown beard braided into two plaits, a plain iron helmet with a nose guard, a knee-length chainmail shirt over a dark green wool tunic, thick leather bracers, a wide leather belt, dark trousers, wrapped leg bindings and heavy boots, no shield, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**1.3 Bogenschützin**
```
A single young Viking woman archer in her mid twenties, athletic and slim, long copper-red hair in one tight braid over the shoulder, a moss-green short cloak with the hood down, a fitted brown leather jerkin over a grey linen shirt, a leather bracer on the left forearm, a leather quiver with arrows strapped to the back, dark trousers and soft leather boots, no helmet, no bow, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**1.4 Dorfwache (Gegner)**
```
A single village guard of a foreign coastal kingdom, a man in his thirties, short dark hair, clean-shaven with a short dark moustache, a simple conical iron helmet, a padded dark red gambeson reaching to the thighs, a leather belt with a small pouch, brown trousers and plain leather shoes, no shield, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**1.5 Axt des Anführers**
```
A single large Viking bearded battle axe for one hand, a long ash-wood shaft with leather wrapping at the grip, a broad iron bearded blade engraved with fine knotwork, a small iron cap at the end of the shaft. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The object stands perfectly vertical with the blade at the top and the grip at the bottom, seen flat from the side, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

**1.6 Einfache Axt (für die Axtkämpfer)**
```
A single simple Viking hand axe, a plain wooden shaft darkened by use, a small rough iron blade with nicks and scratches, no decoration. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The object stands perfectly vertical with the blade at the top and the grip at the bottom, seen flat from the side, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

**1.7 Rundschild**
```
A single round wooden Viking shield made of planks, painted in faded dark blue and off-white quarters, a domed iron boss in the centre, a rawhide rim with iron clamps, scratches and dents. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The shield stands upright and is seen exactly from the front, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

**1.8 Bogen**
```
A single wooden Viking longbow with a taut string, a leather-wrapped grip in the middle, slightly curved limbs, plain and well used. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The bow stands perfectly vertical and is seen flat from the side, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

**1.9 Schwert (für die Wache)**
```
A single plain early medieval one-handed sword, a straight double-edged iron blade with a shallow groove, a short straight crossguard, a leather-wrapped grip and a small round pommel. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The object stands perfectly vertical with the blade at the top and the grip at the bottom, seen flat from the side, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

**1.10 Langhaus**
```
A single large Viking longhouse, the hall of a chieftain, long and low with a steep turf-and-shingle roof that curves slightly like an upturned boat, carved dragon heads on the crossed gable beams, thick timber walls, a heavy double door at the front with two round painted shields beside it, a smoke hole in the roof. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**1.11 Hütte**
```
A single small Viking dwelling hut, low wattle-and-daub walls, a steep thatched roof reaching almost to the ground, a small plank door, a stack of firewood beside the door, thin smoke rising from the roof. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**1.12 Vorratshaus**
```
A single small Viking storehouse raised on short thick wooden posts to keep out mice, plank walls, a shingle roof, a sturdy locked door reached by three wooden steps, two barrels and a few sacks stacked beside the steps. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**1.13 Wachturm**
```
A single tall wooden Viking watchtower, four heavy corner posts braced with crossed beams, a ladder leading up to a covered lookout platform with a low wooden parapet and a small shingle roof, a signal horn hanging on a post. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**1.14 Langschiff**
```
A single Viking longship pulled up on land, a long slender clinker-built hull of dark oak, a carved dragon head at the bow and a curled tail at the stern, a single mast with a furled red-and-white striped sail, a row of round painted shields along the side, oars stowed inside. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

## 2. Danach: Gebäude für dein eigenes Dorf
Vorschlag aus der Analyse. Lass weg, was du nicht willst. Ausbaustufen brauchst du in Tripo nicht.

**2.1 Schmiede**
```
A single Viking smithy, an open-fronted timber shed with a shingle roof, a stone forge with glowing coals and a leather bellows, an anvil on a tree stump, tongs and hammers hanging on the wall, a water trough. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.2 Methalle**
```
A single Viking mead hall, a wide timber feasting hall with a high shingle roof, carved door posts, a big open double door, long benches and stacked mead barrels under a porch roof, drinking horns hanging beside the door. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.3 Trainingsplatz**
```
A single Viking training yard, a small square of trampled earth enclosed by a low log fence, three straw training dummies on posts with old shields, a wooden weapon rack with spears and round shields, an archery target made of straw. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.4 Werft**
```
A single Viking boat shed and shipyard, a long open timber roof on posts, underneath it a half-built longship hull on wooden supports with exposed ribs, stacks of planks, coils of rope, a tar barrel. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.5 Runenstein**
```
A single tall standing Viking runestone, a rough grey granite slab taller than a man, carved with a winding serpent band filled with runes and traces of red paint, moss at the base, a ring of small stones around it. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.6 Holzfällerlager**
```
A single Viking woodcutter camp, a small log cabin with a turf roof, beside it a large pile of stacked logs, a sawhorse with a half-sawn trunk, an axe stuck in a chopping block, a handcart. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.7 Eisenmine**
```
A single small Viking iron mine, a timber-framed tunnel entrance set into a rocky mound, a wooden cart filled with dark ore on short rails, pickaxes leaning against the frame, an oil lamp hanging at the entrance. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.8 Fischerhütte**
```
A single Viking fisher hut, a small plank hut with a turf roof, wooden racks beside it with rows of fish hung up to dry, nets draped over poles, a small rowing boat lying upside down, baskets. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.9 Palisade**
```
A single straight section of a Viking palisade wall, a row of thick upright logs sharpened to points at the top, bound together with rope and crossbeams, about three times as wide as it is high. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

**2.10 Tor der Palisade**
```
A single Viking palisade gate, two tall square timber gate towers with small roofs, between them a heavy double gate of planks with iron bands standing closed, short sections of sharpened log wall on both sides. Gritty semi-realistic style, weathered wood and rough stone, muted earthy colors, cold overcast light. The whole object is visible, seen in a three-quarter view from slightly above, standing alone on a small flat patch of bare earth, plain light grey background, even lighting, no people, no animals, no text.
```

## 3. Später: weitere Krieger und Gegner
Für Feldschlachten und spätere Inseln.

**3.1 Speerträger**
```
A single tall young Viking spearman about 20 years old, long blond hair tied in a topknot, light stubble, a sleeveless sheepskin vest over a pale blue wool tunic, a leather belt with a seax knife in its sheath, grey trousers, wrapped leg bindings and leather boots, no helmet, no spear, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.2 Berserker**
```
A single huge Viking berserker in his thirties, a bare chest covered in dark blue tattoos and old scars, a brown bear pelt worn as a cloak with the bear's head as a hood, a wild black beard, a wide belt with iron rings, fur-trimmed trousers, leather wraps around the wrists, heavy boots, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.3 Schildmaid**
```
A single Viking shieldmaiden in her late twenties with a strong build, blonde hair in several tight braids pulled back, a lamellar vest of leather and small iron plates over a dark blue tunic, leather bracers, a leather belt, dark trousers, wrapped leg bindings and boots, no helmet, no shield, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.4 Seherin**
```
A single elderly Viking seer woman about 60 years old, long grey-white hair with small bone beads, a long dark blue-grey woollen dress, a cloak of black raven feathers over the shoulders, a necklace of amber and small bones, a belt with hanging pouches, no staff, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.5 Feindlicher Bogenschütze**
```
A single archer of a foreign coastal kingdom, a slim young man with a short dark beard, a dark red hood covering head and shoulders, a brown quilted jacket, a leather quiver with arrows on the hip, a leather bracer on the left forearm, grey trousers and ankle boots, no bow, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.6 Feindlicher Hauptmann**
```
A single captain of the guard of a foreign coastal kingdom, a tall strong man in his forties with a greying beard, an iron helmet with cheek plates, a long chainmail hauberk under a plain dark red surcoat without any emblem, a broad sword belt, leather gloves, iron greaves over leather boots, no shield, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.7 Feindlicher Fürst (Endgegner einer Insel)**
```
A single lord of a foreign coastal kingdom, a proud broad man in his fifties with a trimmed grey beard, a simple golden circlet, a heavy dark red cloak with a grey fur collar, a gilded scale armour over a black tunic, a jewelled belt, tall boots, no shield, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**3.8 Speer**
```
A single Viking spear, a long straight ash-wood shaft, a leaf-shaped iron spearhead with a short socket, a strip of leather tied below the head. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The spear stands perfectly vertical with the point at the top, seen flat from the side, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

**3.9 Stab der Seherin**
```
A single Viking seer's staff, a long gnarled wooden staff with carved runes along the shaft, a raven skull, feathers and small amber beads tied to the top with leather cords. Gritty semi-realistic style, worn and used, muted earthy colors, cold overcast light. The staff stands perfectly vertical with the decorated end at the top, seen flat from the side, shown alone, whole object visible, plain light grey background, even lighting, no hand, no person, no ground shadow, no text.
```

## 4. Viel später: Endgegner aus den Sagen
Draugr und Frostriese sind menschenähnlich, das kann Mixamo. Seeschlange und Drache kann Mixamo nicht: bei diesen beiden in Tripo gleich auch „Rig“ ausprobieren und mit exportieren.

**4.1 Draugr (untoter Krieger)**
```
A single draugr, an undead Viking warrior risen from a burial mound, grey-blue withered skin stretched over bones, glowing pale eyes, a long tangled white beard, a rusted and broken chainmail shirt, a cracked iron helmet, rotting dark cloth and torn leather, bare bony forearms, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**4.2 Frostriese**
```
A single frost giant from Norse legend, an enormous heavily muscled humanoid with pale blue-grey skin and patches of ice and frost on shoulders and forearms, a long beard of icicles, small glowing ice-blue eyes, a loincloth and shoulder cover of white fur, thick fur boots, a necklace of large animal teeth, no weapons. Gritty semi-realistic style, realistic body proportions, weathered skin, worn and patched clothing, muted earthy colors, cold overcast light, grim serious expression, sharp detailed face with clearly visible eyes. Full body from head to feet, front view, standing upright in a clear A-pose with both arms held about 40 degrees away from the body, hands open and empty, legs slightly apart with a gap between them, tall portrait image, the whole figure fits inside the frame with only a small margin above the head and below the feet, plain light grey background, even lighting, no ground shadow, no text.
```

**4.3 Seeschlange**
```
A single sea serpent from Norse legend, a very long thick snake-like body covered in dark green and grey scales with a pale belly, a row of spiny fins along the back, a wide head with long teeth and small horns, no wings, no legs. Gritty semi-realistic style, muted cold colors, cold overcast light. The whole body is visible from head to tail, lying in two gentle S-curves with the head raised, seen from the side, plain light grey background, even lighting, no water, no ground shadow, no text.
```

**4.4 Drache**
```
A single dragon from Norse legend, a powerful four-legged body covered in dark charcoal and rust-brown scales, a long neck, a horned head with a mouth slightly open, two large leathery wings, a long tail with spikes. Gritty semi-realistic style, muted earthy colors, cold overcast light. The whole dragon is visible, standing on all four legs in a calm neutral pose with both wings spread wide to the sides and the tail stretched out straight behind, three-quarter front view from slightly above, plain light grey background, even lighting, no fire, no ground shadow, no text.
```
