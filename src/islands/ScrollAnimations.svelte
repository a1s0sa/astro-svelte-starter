<script>
  // GSAP (and gsap.registerPlugin) must only ever run inside onMount: Astro
  // renders this component's markup at build time on the server, where
  // `document`/`window` don't exist. Importing gsap at module/top level would
  // execute plugin registration during SSR and crash the build.
  import { onMount, onDestroy } from 'svelte';

  /** @type {import('gsap').default | undefined} */
  let gsap;
  /** @type {ReturnType<typeof import('gsap/ScrollTrigger').ScrollTrigger.create>[]} */
  let scrollTriggers = [];

  onMount(async () => {
    const gsapModule = await import('gsap');
    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap = gsapModule.gsap;
    gsap.registerPlugin(ScrollTrigger);

    // Entrance timeline: hero elements animate in once, in sequence.
    const heroEls = gsap.utils.toArray('[data-animate-hero]');
    if (heroEls.length) {
      gsap.set(heroEls, { autoAlpha: 0, y: 24 });
      gsap.timeline({ defaults: { ease: 'power2.out' } }).to(heroEls, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
      });
    }

    // Scroll-triggered reveal: each section's cards fade/slide up as the
    // section enters the viewport. One ScrollTrigger per section keeps the
    // stagger scoped to that section's own items.
    const sections = gsap.utils.toArray('[data-animate-section]');
    sections.forEach((section) => {
      const items = section.querySelectorAll('[data-animate-item]');
      if (!items.length) return;

      gsap.set(items, { autoAlpha: 0, y: 32 });

      const tween = gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
      });

      if (tween.scrollTrigger) scrollTriggers.push(tween.scrollTrigger);
    });
  });

  onDestroy(() => {
    // Without this, remounting this island (e.g. during client-side
    // navigation or HMR) would register a second set of ScrollTriggers on
    // top of the first, double-firing the animations.
    scrollTriggers.forEach((trigger) => trigger.kill());
    scrollTriggers = [];
  });
</script>
