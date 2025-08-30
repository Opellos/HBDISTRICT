PROJECT: Phase 1 Delivery (Markers only; no value changes)

1) PURPOSE
- _P1 files are archival Phase‑1 copies (header + original). They live in /P1_PACKAGE.
- Do NOT reference _P1 files from live HTML.

2) LINK MATRIX (HTML ↔ CSS)
LIVE
  HTML:   /index_district_build_1-1-0_.html
  CSS:    css/main.css -> css/hb_style.css -> css/hb_hero.css -> css/hb_brand.css
  VENDOR: css/bootstrap.min.css (and other vendor CSS in /css)
P1_PACKAGE
  HTML:   /P1_PACKAGE/index_district_build_1-1-0_P1.html
  CSS:    main_P1.css -> hb_style_P1.css -> hb_hero_P1.css -> hb_brand_P1.css  (same folder)
  VENDOR: ../css/bootstrap.min.css (and other vendor CSS from ../css)

3) SNIPPETS (copy/paste)
LIVE
  <link href="css/bootstrap.min.css" rel="stylesheet">
  <link href="css/main.css" rel="stylesheet">
  <link href="css/hb_style.css" rel="stylesheet">
  <link href="css/hb_hero.css" rel="stylesheet">
  <link href="css/hb_brand.css" rel="stylesheet">
P1_PACKAGE
  <link href="../css/bootstrap.min.css" rel="stylesheet">
  <link href="main_P1.css" rel="stylesheet">
  <link href="hb_style_P1.css" rel="stylesheet">
  <link href="hb_hero_P1.css" rel="stylesheet">
  <link href="hb_brand_P1.css" rel="stylesheet">

4) RULES
- No _P1 references in live HTML.
- Do not mix originals and _P1 in one HTML document.
- Keep CSS order: main -> hb_style -> hb_hero -> hb_brand.

5) CODEX
- Run on originals in /css for production changes.
- P1_PACKAGE is for review/testing only.
