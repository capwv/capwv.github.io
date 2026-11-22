# Ahmed Wael — Personal Portfolio

Live at **https://capwv.github.io/**

A fast, fully static, single-page portfolio. No build step, no dependencies beyond Google Fonts.

## Structure

```
index.html          page markup
assets/style.css    all styles
assets/app.js       nav, scroll reveal, counters, project rendering
data/projects.json  edit this to add a project
data/certificates.json  edit this to add a certificate
og-image.png        social preview image (1200x630)
_og.html            source page used to render og-image.png
favicon.svg         site icon
```

## Add a new project

Open `data/projects.json` and add one object:

```json
{
  "title": "Project name",
  "badge": "Flagship",            // optional, leave "" to hide
  "description": "What it does and who uses it.",
  "stat": "100+ users",           // optional, leave "" to hide
  "tags": ["Python", "SQL"],
  "url": "https://...",
  "image": "assets/img/optional-card-banner.jpg"   // optional, leave out to hide
}
```

## Add a new certificate

Open `data/certificates.json` and add one object:

```json
{ "title": "Certificate name", "issuer": "Issuer", "date": "Mon 2026", "image": "assets/img/cert.jpg" }
```

Put the certificate image in `assets/img/`. Landscape images around 480x360 or larger work best.

Commit and push. The projects section renders itself from this file, so the new card appears with the same design automatically. Order in the file is the order on the page.

## Deploy

Pushes to `main` publish automatically through GitHub Pages.
