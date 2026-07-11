# Astro + Svelte Landing Page Starter

A static-by-default starter for landing pages and marketing sites: Astro for
structure and static HTML, Svelte islands for the handful of sections that
need interactivity, GSAP for animation, typed JSON-LD for SEO, and Astro
Content Collections as the extension point for growing into a catalog,
booking site, blog, or portfolio.

Every section renders to plain HTML at build time. Nothing ships
JavaScript unless it actually needs to — the homepage's hero panel lists
the real `client:*` directive for every island on the page, not a claim.

## Quick start

```sh
pnpm install
pnpm dev
```

This project uses **pnpm** — the lockfile is `pnpm-lock.yaml`, don't use npm
or yarn.

## Commands

| Command          | Purpose                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `pnpm install`    | Install dependencies                                                                     |
| `pnpm dev`        | Start the dev server at `localhost:4321`                                                 |
| `pnpm build`      | Build static output to `dist/`, generate `sitemap.xml` and optimized images              |
| `pnpm preview`    | Serve the built `dist/` output locally                                                   |
| `pnpm astro ...`  | Run any Astro CLI command directly (`astro add`, `astro check`, ...)                     |

## Project structure

```text
/
├── src/
│   ├── components/    # Static .astro sections (Header, Hero, Features, ...)
│   ├── islands/       # Svelte components — the only sources of client JS
│   ├── content/        # Content collection entries (src/content.config.ts holds the schema)
│   ├── layouts/        # BaseLayout.astro
│   ├── pages/           # index.astro (homepage) + items/ (collection routes)
│   └── styles/         # global.css — design tokens live in :root
└── public/              # Static assets served as-is (favicon, etc.)
```

## Islands / hydration model

Only components in `src/islands/` are Svelte, and only those get a
`client:*` directive:

| Island                   | Directive        | Why                                                    |
| ------------------------- | ------------------ | --------------------------------------------------------- |
| `ScrollAnimations.svelte` | `client:load`     | Drives the hero entrance timeline immediately on load      |
| `PricingToggle.svelte`    | `client:visible`  | Below the fold — hydrate once it scrolls into view          |
| `FaqAccordion.svelte`     | `client:visible`  | Same                                                          |
| `ContactForm.svelte`      | `client:visible`  | Same                                                          |

There's no global state management library here on purpose — a landing
page's state is usually a single form, kept local to whichever island owns
it. See `AGENTS.md` for the escape hatch (nanostores) once a feature
actually needs state shared across islands.

## Content collections

`src/content.config.ts` defines one example collection, `items`, with a zod
schema and a `glob()` loader. `src/pages/items/index.astro` (listing) and
`src/pages/items/[slug].astro` (detail) demonstrate the pattern: fetch the
collection, generate one static page per entry, wire `<Schema>` for SEO.
The three example entries under `src/content/items/` each document what
changes to grow this into a product catalog, a hotel booking site, or a
blog — that's the intended extension path for a new vertical.

## Before deploying

`astro.config.mjs` points `site` at a placeholder domain
(`https://example.com`). Replace it with your real production domain —
`@astrojs/sitemap` and the homepage's JSON-LD both depend on it to build
absolute URLs.

## For AI coding agents

See `AGENTS.md` (also readable as `CLAUDE.md`, a symlink to the same file)
for the fuller set of conventions: the GSAP lifecycle rule, the SEO/schema
setup, and the state-management escape hatch.
