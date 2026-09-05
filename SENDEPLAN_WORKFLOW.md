# 📅 Sendeplan KI-Workflow (`SENDEPLAN_WORKFLOW.md`)

> **Regel für jede KI / Assistant-Instanz:**  
> Auf dieser Website existiert **kein** öffentlicher Web-Login oder Admin-Panel (`admin.html`), um unnötige Sicherheitsrisiken auf GitHub Pages auszuschließen.  
> Stattdessen wird der Sendeplan direkt über Anweisungen des Streamers/Entwicklers in natürlicher Sprache gepflegt.

---

## 🎯 Trigger-Erkennung (Beispiele)

Sobald der Nutzer eine Ankündigung wie die folgenden macht:
- *"Morgen gehe ich live, 20 Uhr, bis 4 Uhr"*
- *"Trag einen Stream für heute 19:00 Uhr ein: Roblox Notruf Hamburg"*
- *"Am Freitag ab 18:30 Minecraft Modpack mit Chrii"*
- *"Samstag 22 Uhr Spontaner Talk"*
- *"Entferne den gestrigen Stream aus dem Sendeplan"*

---

## ⚙️ Automatischer Handlungsablauf für die KI

1. **Datum & Uhrzeit berechnen:**
   - Relatives Datum (z. B. *heute*, *morgen*, *kommenden Freitag*) anhand des aktuellen Tagesdatums exakt auflösen.
   - Startzeit im ISO-8601 Format formatieren: `YYYY-MM-DDTHH:MM`.
   - Bei Zeitspannen (z. B. *20 Uhr bis 4 Uhr*) die Endzeit in Titel oder Beschreibung aufnehmen (z. B. `"20:00 – ca. 04:00 Uhr"`).

2. **Kategorie & Titel ermitteln:**
   - Falls ein Spiel/Thema genannt wurde (z. B. Minecraft, Roblox, Just Chatting, SoundCloud Music), entsprechende Kategorie und aussagekräftigen Titel vergeben.
   - Falls kein Thema genannt wurde: Standardkategorie `"Live Stream"` und Titel `"Community Stream & Gaming"` wählen.

3. **`events.json` aktualisieren:**
   - Datei: `/home/benzj/Projekte/benzjeremy.github.io/itsbenzo-tv/events.json`
   - Schema:
     ```json
     {
       "id": "event-<timestamp_oder_nummer>",
       "title": "Minecraft Modpack Chaos (Create & Mekanism)",
       "category": "Minecraft / Modded",
       "date": "2026-09-08T18:30",
       "description": "20:00 – 04:00 Uhr: Komplexe Maschinen, automatisierte Fabriken und cursed Redstone."
     }
     ```
   - Liste nach Datum aufsteigend sortieren.
   - Ältere/abgelaufene Termine bei Bedarf bereinigen (maximal 3–5 aktive anstehende Events vorhalten).

4. **Git Commit & Push:**
   - Im Repo `itsbenzo-tv` auf Branch `web`:
     ```bash
     git add events.json
     git commit -m "chore(schedule): add stream on YYYY-MM-DD (<Titel>)"
     git push origin web
     ```

5. **Kurze Bestätigung an den Nutzer:**
   - Bestätige kurz den eingetragenen Termin (Wochentag, Datum, Start- und Endzeit) und dass die Änderung direkt live auf `https://benzjeremy.github.io/itsbenzo-tv/` bereitsteht.
