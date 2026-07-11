# Astro + Svelte Landing Page Starter

A static-by-default starter for landing pages and marketing sites: Astro for
structure and static HTML, Svelte islands for the handful of sections that
need interactivity, GSAP for animation, and typed JSON-LD for SEO.

## Commands

This project uses **pnpm**. Don't use npm or yarn — the lockfile is
`pnpm-lock.yaml`.

| Command          | Purpose                                              |
| ---------------- | ----------------------------------------------------- |
| `pnpm install`   | Install dependencies                                   |
| `pnpm dev`       | Start the dev server (`astro dev --background` if run by an agent, so it doesn't block the session — manage it with `astro dev stop` / `status` / `logs`) |
| `pnpm build`     | Type-check, build static output to `dist/`, generate `sitemap.xml` and optimized images |
| `pnpm preview`   | Serve the built `dist/` output locally                |
| `pnpm astro ...` | Run any Astro CLI command directly                     |

## Islands / hydration model

Every section in `src/components/*.astro` renders to static HTML with **zero
client-side JavaScript** by default. Only the components in `src/islands/`
are Svelte, and only those get a `client:*` directive, so only those ship JS:

| Island                            | Directive       | Why                                                          |
| ---------------------------------- | --------------- | ------------------------------------------------------------- |
| `ScrollAnimations.svelte`          | `client:load`   | Drives the hero entrance timeline immediately on page load    |
| `PricingToggle.svelte`             | `client:visible`| Below the fold — hydrate only once it scrolls into view       |
| `FaqAccordion.svelte`              | `client:visible`| Same — no need to pay the JS cost until the user gets there   |
| `ContactForm.svelte`               | `client:visible`| Same                                                           |

When adding a new interactive section:

1. Build the static markup as an `.astro` component first.
2. If (and only if) it needs interactivity, extract just the interactive
   part into a `.svelte` component in `src/islands/`.
3. Pick the narrowest `client:*` directive that works — `client:visible` for
   anything below the fold, `client:load` only when it must run immediately
   (like the entrance animation).
4. Don't hydrate a whole section just to make one button interactive —
   hydrate the button.

There is **no global state management library** in this starter (no
nanostores, no cross-component Svelte stores) and that's deliberate. A
landing page's only real "state" is usually a single form, and it stays
local to whichever island owns it via plain Svelte `$state`. Only reach for
shared state if a future page genuinely needs to coordinate state across
multiple islands — don't add it preemptively.

**Escape hatch:** the point to reach for shared state is when a feature
needs it to cross the boundary between independently-hydrated Svelte
islands — a cart badge in the header updated from a product-detail island, a
multi-step booking selection read by both a date picker and a summary
island, a wishlist toggled from a listing page and read on a detail page.
When (and only when) that's real, add `nanostores` and, if the state should
survive a reload, `@nanostores/persistent`. That's a small, deliberate
addition at the point of need — not a rearchitect, and not something to
install ahead of time on the assumption it'll eventually be needed.

## Content collections

`src/content.config.ts` is the generic extension point for turning this
starter into anything with "a typed list of things and a detail page per
thing" — a product catalog, a room directory, a blog, a portfolio. (This
Astro version rejects the older `src/content/config.ts` location at build
time — `LegacyContentConfigError` — so the config file lives at
`src/content.config.ts`, a sibling of `src/content/`, not inside it.) It
ships with one example collection, `items`, defined with a zod schema and a
`glob()` loader over `src/content/items/*.md`:

```ts
// src/content.config.ts
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

`src/pages/items/index.astro` (listing) and `src/pages/items/[slug].astro`
(detail) demonstrate the routing pattern: `getCollection('items', ...)` to
fetch entries, `getStaticPaths()` to generate one static page per entry, and
`render(entry)` to get that entry's `<Content />`. Neither route knows or
cares what an "item" is — that's what makes it the extension point.

To add a collection of your own:

1. Add a new `defineCollection()` in `src/content.config.ts` with a schema
   that matches your content (see the worked examples inside
   `src/content/items/*.md` for what changes to go from `items` to
   products, rooms, or posts).
2. Add the matching Markdown files under `src/content/<your-collection>/`.
3. Copy `src/pages/items/index.astro` and `src/pages/items/[slug].astro`
   into `src/pages/<your-collection>/`, swapping the collection name.
4. On the detail route, swap the JSON-LD `@type` from `CreativeWork` to
   whatever schema.org type actually matches — `Product`, `LodgingBusiness`,
   `Article`, etc.

`@astrojs/sitemap` needs no changes to pick up the new routes — it crawls
the static build output, not a route list, so any page under `dist/` after
`pnpm build` is included automatically.

## GSAP lifecycle rule

Astro server-renders `.astro` (and the static output of `.svelte`)
components at build time, where `document`/`window` don't exist. **Any**
GSAP call — including `gsap.registerPlugin(...)` — must happen inside a
Svelte `onMount()`, never at component top level or in a plain `<script>`
that runs on import. See `src/islands/ScrollAnimations.svelte` for the
reference pattern:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';

  let scrollTriggers = [];

  onMount(async () => {
    const { gsap } = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    // ...timelines and ScrollTrigger.create(...) / tween scrollTrigger configs here...
    // push any ScrollTrigger instance you create into scrollTriggers
  });

  onDestroy(() => {
    // Always kill ScrollTrigger instances on unmount. Skipping this means a
    // remount (client-side nav, HMR) registers a second set of triggers on
    // top of the first and animations double-fire.
    scrollTriggers.forEach((trigger) => trigger.kill());
    scrollTriggers = [];
  });
</script>
```

Follow this pattern for any new GSAP-animated island.

## Sitemap config requirement

`@astrojs/sitemap` needs `site` set in `astro.config.mjs` to the real,
absolute production domain — it uses this to build absolute URLs for
`sitemap.xml`. It currently points at a placeholder:

```js
// astro.config.mjs
export default defineConfig({
  // TODO: replace with the real production domain before deploying.
  site: 'https://example.com',
  ...
});
```

**Before deploying, replace that placeholder** with your actual domain, or
`sitemap.xml` and the JSON-LD `url`/`@id` fields on the homepage
(`src/pages/index.astro`) will point at `example.com`.

## SEO / structured data

`src/pages/index.astro` uses the `<Schema>` component from
`astro-seo-schema` (powered by `schema-dts` for typed JSON-LD) to emit an
`Organization` + `WebSite` graph in `<head>`. `schema-dts` is pinned to
`1.1.5` because `astro-seo-schema`'s peer dependency requires `schema-dts@^1.1.0`
— check that peer range again before bumping `schema-dts` to its current
major (2.x at time of writing), since installing a mismatched major will
produce type errors even though pnpm won't hard-fail the install.

## Images

Use Astro's built-in `astro:assets` `<Image>` component (see
`src/components/Hero.astro`) for any local image — it handles optimization
and responsive output at build time. Don't add a separate image
optimization library. `sharp` is a required dev dependency for this to work
during `pnpm build`.
