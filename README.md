# Ahmed Wael — Personal Portfolio

Live at **https://capwv.github.io/**

A fast, fully static, single-page portfolio. No build step, no dependencies beyond Google Fonts.

## Structure

```
index.html          page markup
assets/style.css    all styles
assets/app.js       nav, scroll reveal, counters, project rendering
data/projects.json  THE ONLY FILE to edit when adding a project
og-image.png        social preview image (1200x630)
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
  "url": "https://..."
}
```

Commit and push. The projects section renders itself from this file, so the new card appears with the same design automatically. Order in the file is the order on the page.

## Deploy

Pushes to `main` publish automatically through GitHub Pages.
