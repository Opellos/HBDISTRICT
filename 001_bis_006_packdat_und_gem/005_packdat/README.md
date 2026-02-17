# HB District – Rebuild Guide

## Projektüberblick
Die Rebuild-Version der Website liegt im Ordner `z_Rebuild/` und ersetzt das bisherige Bootstrap-Setup durch TailwindCSS (CDN) in Kombination mit einem Custom-Token-System. Alle Inhalte, Medien und Interaktionen wurden übernommen und für ein fluid-responsives Layout optimiert.

## Schnellstart
1. Öffne `z_Rebuild/00_index_rebuilt.html` direkt im Browser. Alle Abhängigkeiten werden über lokale Dateien oder CDNs geladen – ein Build-Schritt ist nicht zwingend nötig.
2. Stelle sicher, dass der Ordner `img/`, `video/` und `fonts/` auf derselben Ebene wie `z_Rebuild/` liegt, damit Medien und Icons korrekt geladen werden.

## Entwicklung mit Tailwind
Für lokale Anpassungen ohne CDN kann Tailwind per CLI erzeugt werden:
```bash
cd z_Rebuild
npx tailwindcss -i ./00_base_rebuilt.css -o ../dist/hb.bundle.css --watch
```
- Die Konfiguration liegt in `z_Rebuild/00_tailwind.config.js`.
- Das Token-Set (`z_Rebuild/00_custom_tokens_rebuild.css`) bleibt die Quelle für Farben, Typografie, Abstände und Effekte.
- Entferne im HTML die CDN-Einbindung, wenn du auf ein lokales Bundle wechselst.

## Custom Tokens anpassen
Alle Designparameter befinden sich in `00_custom_tokens_rebuild.css`.
- **Farben & Gradients:** `--hb-color-*` und `--hb-gradient-*`
- **Typografie:** `--hb-font-*`, `--hb-text-*`, `--hb-display-*`
- **Spacing & Radius:** `--hb-space-*`, `--hb-radius-*`
- **Motion:** Passe die Keyframes (`hbFadeUp`, `hbMarquee`, …) oder die `--hb-duration-*` Variablen an.

## Komponenten & Interaktionen
- `00_base_rebuilt.css` stellt Layout-Layer, Glas-Optiken, Carousel-Styling und Utilities bereit.
- `00_main_rebuilt.js` enthält native Implementierungen für Navigation, Carousel, Smooth Scrolling, Video-Embed und Scroll-Reveal.
- Motion reagiert auf `prefers-reduced-motion` und pausiert Carousel sowie Partner-Marquee automatisch.

## Pflegehinweise
- Nutze die vorhandenen Utility-Klassen (`stack-lg`, `grid-auto-fit`, `hb-card` …) für neue Inhalte, um das fluid-responsives Verhalten zu erhalten.
- Neue Sektionen sollten `data-reveal` nutzen, damit sie automatisch in den Scroll-Reveal eingebunden werden.
- Achte bei weiteren Videos/Slides darauf, `data-carousel-media` bzw. `data-has-video` zu setzen, damit die Autoplay-Logik greift.

