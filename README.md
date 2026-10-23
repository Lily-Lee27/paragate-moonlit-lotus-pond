# Paragate · Moonlit Lotus Pond

**月下莲池** is a quiet, private digital pond for releasing lotus lanterns that carry wishes, memories, passing thoughts, or unresolved worries.

> 莲池只负责承载，不负责评判。

This MVP is a static, mobile-first web experience built with semantic HTML, CSS, vanilla JavaScript, and inline SVG. It has no backend, accounts, analytics, advertising, third-party tracking, or AI interpretation.

## Project structure

```text
.
├── index.html                 # Semantic interface and reusable SVG lotus symbol
├── styles.css                 # Responsive scene, panels, accessibility, and motion
├── app.js                     # Local records, interactions, validation, import/export, i18n
├── assets/images/
│   ├── moonlit-pond-bg.png     # Full-scene background
│   └── lotus- lantern.png      # Interactive lantern artwork
└── README.md
```

## Preview locally

No installation or build step is required.

From this folder, run the preview on an unused port:

```bash
python3 -m http.server 4188 --bind 127.0.0.1
```

Then open [http://localhost:4188](http://localhost:4188).

Using an explicit address and a dedicated port avoids accidentally opening another local project that is also bound to `localhost`.

Opening `index.html` directly also works in most modern browsers, but a local server gives behavior closer to GitHub Pages.

## Using the pond

- Choose **放下一盏莲花灯 / Release a Lotus Lantern** to write up to 500 characters. Empty lanterns are also allowed.
- Select any lantern to read its original text and creation time.
- Drag a lantern with a mouse, finger, or stylus to place it elsewhere on the water. A short tap still opens the record; moving beyond the drag threshold repositions it without opening the record.
- Dragged positions are saved as normalized coordinates and restored after reload. Moving a lantern never changes its ID, original text, or creation timestamp.
- Open the upper-right menu for **My Pond**, language selection, import, export, and privacy information.
- **Export My Pond** downloads a UTF-8 JSON backup named `paragate-lotus-pond-YYYY-MM-DD.json`.
- **Import Pond** reads an exported JSON file locally, validates it, and merges only new IDs. Duplicate IDs are skipped; conflicting IDs never overwrite existing content.

## Data and privacy

Records use this shape:

```json
{
  "schemaVersion": 1,
  "entries": [
    {
      "id": "collision-resistant-id",
      "text": "Original text, unchanged",
      "createdAt": "2026-10-18T15:30:00.000+08:00",
      "position": { "x": 0.45, "y": 0.62 }
    }
  ]
}
```

The app stores records only in browser `localStorage`. User text is inserted with `textContent`, never as HTML. Imported files are read locally and are not uploaded or executed.

`localStorage` is not permanent storage. Records can disappear when browser data is cleared, private browsing ends, storage is restricted, or the user changes browsers or devices. Exported JSON files may contain personal information and should be stored with care.

Import safeguards:

- Schema version must be `1`.
- Files are limited to 2 MB and 2,000 entries.
- IDs, text length, timestamps, and normalized positions are validated.
- Duplicate IDs with identical content are skipped.
- ID collisions with different content are reported and left unchanged.
- Existing records are never silently overwritten.

## Accessibility and performance

- Keyboard-operable buttons and native modal dialogs
- Pointer Events for mouse, touch, and stylus dragging, with page-scroll prevention while a lantern is being moved
- Visible focus states and comfortable touch targets
- Plain-text rendering for user content
- Chinese and English interface without altering user-written entries
- `prefers-reduced-motion` disables non-essential animation
- The water renders the newest 140 lanterns for performance; all saved records remain accessible in **My Pond** and in exports

## GitHub Pages deployment

1. Create a GitHub repository and add these files at its root.
2. Commit and push the project.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the branch (usually `main`) and the `/ (root)` folder, then save.
6. GitHub will show the public URL when deployment finishes.

No deployment is performed automatically by this project.

## Cloudflare Pages deployment

This repository is a buildless static site. It does not require Node.js, a package manager, a framework preset, environment variables, Pages Functions, or a backend.

1. Push the repository to GitHub with `main` as its default branch.
2. In Cloudflare, open **Workers & Pages → Create application → Pages → Import an existing Git repository**.
3. Authorize the Cloudflare GitHub App for this repository and choose the repository.
4. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Framework preset | `None` |
   | Root directory | Leave blank (repository root) |
   | Build command | `exit 0` |
   | Build output directory | `.` |
   | Environment variables | None |

5. Select **Save and Deploy**. The top-level `index.html` is served at the generated `*.pages.dev` URL.
6. Subsequent pushes to `main` trigger production deployments. Other enabled branches can receive preview deployment URLs.

The Git-integrated Pages project should remain Git-integrated. Cloudflare documents Git integration and Direct Upload as different project modes, so choose Git integration when creating the project.

### Production storage note

`localStorage` is isolated by browser origin. Records created at `http://localhost:4188`, a GitHub Pages URL, a `*.pages.dev` URL, and a future custom domain are separate. Deploying does not delete or migrate any records. Export from the old origin and import on the production origin when a user intentionally wants to move a pond.

## Browser support

The MVP targets current Safari, Chrome, Edge, and Firefox releases on mobile and desktop. It uses native `<dialog>`, `localStorage`, `Blob`, `crypto.randomUUID` (with a secure random fallback), and `Intl.DateTimeFormat`.

## Product boundary

The application does not score, categorise, summarise, translate, advise on, or reinterpret entries. There are no streaks, reminders, rankings, public sharing, or tasks to complete. A lantern is only a quiet place for the original words to remain.

## Source of truth

The project root is the source of truth. `index.html` loads `styles.css` and `app.js` directly; there is no generated build output or separate prototype to update. Keep future changes in these files so local preview and GitHub Pages use the same code.
