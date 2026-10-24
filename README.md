# Paragate · Moonlit Lotus Pond

**月下莲池 · 一念起，一灯明。**

*A thought rises. A lantern glows.*

An interactive digital sanctuary for quiet reflection, where wishes, memories, passing thoughts, and unresolved feelings can rest upon a moonlit lotus pond.

**[🌕 Enter the Moonlit Lotus Pond](https://paragate-moonlit-lotus-pond.pages.dev)**

<img width="100%" alt="moonlit-lotus-pond" src="https://github.com/user-attachments/assets/c5c521a8-4197-445f-bf57-7205d88521af" />

**First released:** October 24, 2026 · Programmer's Day

---

## About · 关于月下莲池

月下莲池是一方安静的私人莲池。

在这里，你可以写下一份心愿、一段回忆、一个念头，或暂时无解的烦恼，再让一盏莲花灯替你承载。

不必解释，不必寻找答案，也不必急着释怀。

**莲池只负责承载，不负责评判。**

Moonlit Lotus Pond is a quiet, personal digital space inspired by the imagery of lotus flowers, moonlight, and the simple act of letting go.

Write something you wish to remember, something you hope for, or something you are not yet ready to resolve. Release a glowing lotus lantern onto the water and allow your words to remain exactly as they were written.

There is no judgment, no interpretation, and no expectation to feel better.

*The pond holds. It does not judge.*

---

## Experience · 体验

### Release a lantern · 放下一盏莲花灯

Write up to 500 characters, or release an empty lantern when words are unnecessary.

Each lantern carries its original text and creation time.

### A pond of your own · 一方属于自己的莲池

Watch your lanterns rest upon the moonlit water. Tap a lantern to revisit its words, or gently drag it to another place on the pond.

Their positions are remembered when you return using the same browser.

### Preserve your memories · 保存与迁移

Export your pond as a JSON backup and import it again when needed.

Existing records are preserved during import; duplicate entries are skipped, and conflicting records are never silently overwritten.

### Two languages · 中英双语

Switch between Chinese and English without changing the words you have written.

Your thoughts remain yours, in their original language.

---

## Philosophy · 设计理念

Paragate is designed around a simple principle:

**Technology can provide a space without demanding attention, productivity, or improvement.**

There are no scores, streaks, rankings, reminders, public feeds, or achievements to unlock.

The application does not analyse, categorise, summarise, translate, evaluate, or reinterpret what you write.

It does not offer unsolicited advice or attempt to turn personal reflection into a task.

A lantern is not a problem to be solved.

It is simply a place for a thought to remain.

---

## Privacy · 隐私与数据

**Your words stay in your browser.**

Moonlit Lotus Pond is a static web application with:

- No user accounts or backend database
- No cloud synchronisation
- No analytics, advertising, or third-party tracking implemented by the application
- No AI interpretation of personal entries
- No uploading of lantern text to an application server

Lantern records are stored locally using the browser's `localStorage`.

**Important:** Local storage is not permanent storage. Clearing browser data, using private browsing, changing browsers, or switching devices may cause your records to become unavailable.

Records do not automatically synchronise between devices, browsers, or website domains.

To preserve or transfer your pond, use **Export My Pond** and **Import Pond**. Exported files may contain personal information and should be stored carefully.

Imported JSON files are processed locally, validated, and never executed as code. User-written text is rendered as plain text rather than HTML.

---

## Built With · 技术实现

Moonlit Lotus Pond is a lightweight, mobile-first interactive web experience.

| Technology | Purpose |
| --- | --- |
| HTML5 | Semantic page structure and accessible interfaces |
| CSS3 | Responsive layouts, visual styling, and transitions |
| Vanilla JavaScript | Lantern interactions, local persistence, import/export, and language switching |
| Inline SVG | Reusable vector interface elements |
| Browser localStorage | Local-only storage of lantern records |
| Cloudflare Pages | Static website hosting and continuous deployment |
| GitHub | Source control and project management |

The project uses no frontend framework, package manager, or build pipeline.

It is designed to run directly in modern browsers, with support for mouse, touch, and stylus interactions.

Additional considerations include keyboard accessibility, visible focus indicators, reduced-motion preferences, and rendering limits for performance.

---

## Project Structure · 项目结构

```text
.
├── index.html          # Main interface and SVG elements
├── styles.css          # Visual design, responsive layout, and animations
├── app.js              # Interactions, storage, import/export, and i18n
├── assets/
│   └── images/         # Moonlit pond and lotus lantern artwork
├── .gitignore
└── README.md
```

---

## Run Locally · 本地运行

No installation or build step is required.

Clone the repository or download its source files, then start a local static server from the project root:

```bash
python3 -m http.server 4188 --bind 127.0.0.1
```

Open:

`http://localhost:4188`

The project uses relative asset paths and does not require environment variables, API keys, or external services to run locally.

---

## Deployment · 部署

**Live website:** https://paragate-moonlit-lotus-pond.pages.dev

The production website is hosted on **Cloudflare Pages**, connected to the GitHub repository.

- Production branch: `main`
- Framework preset: `None`
- Build output directory: `.`
- No application build step required
- No environment variables required

Changes pushed to `main` automatically trigger a new production deployment through Cloudflare Pages.

The website is publicly accessible independently of the GitHub repository's visibility.

**Storage note:** Browser storage is isolated by origin. Records saved on localhost, the production domain, or a future custom domain are separate. Moving to another domain does not automatically migrate existing records.

---

## Accessibility & Compatibility

The experience is designed for modern desktop and mobile browsers, including Safari, Chrome, Edge, and Firefox.

Accessibility and usability considerations include:

- Semantic HTML and native dialog elements
- Keyboard-accessible controls
- Touch-friendly interactive elements
- Mouse, touch, and stylus support through Pointer Events
- Reduced-motion support for non-essential animations
- Plain-text rendering of user-written content
- Responsive layouts for different screen sizes

For performance, the pond displays up to 140 of the newest lanterns at once. Older saved entries remain available through **My Pond** and exported backups.

---

## A Small Note · 写在最后

Some thoughts do not need to become answers.

Some memories do not need to be explained.

And some things can simply be placed gently upon the water.

愿每一盏莲花灯，都有属于自己的月光。

**一念起，一灯明。**

---

*Paragate · Moonlit Lotus Pond*

*First released on October 24, 2026.*

*Made with care, under the same moon.* 🌕
