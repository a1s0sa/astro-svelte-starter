<script>
  /**
   * @typedef {{ question: string, answer: string }} FaqItem
   * @type {{ items: FaqItem[] }}
   */
  let { items } = $props();

  // Which panel is open lives only in this component's state. A page could
  // have multiple accordions with no risk of them clobbering each other,
  // which is exactly why this doesn't belong in a global store.
  let openIndex = $state(0);

  function toggle(index) {
    openIndex = openIndex === index ? -1 : index;
  }
</script>

<div class="faq">
  {#each items as item, index (item.question)}
    <div class="faq__item" data-animate-item>
      <h3>
        <button
          type="button"
          class="faq__trigger"
          aria-expanded={openIndex === index}
          aria-controls={`faq-panel-${index}`}
          onclick={() => toggle(index)}
        >
          {item.question}
          <span class="faq__icon" class:is-open={openIndex === index} aria-hidden="true">+</span>
        </button>
      </h3>
      {#if openIndex === index}
        <div id={`faq-panel-${index}`} class="faq__panel" role="region">
          <p>{item.answer}</p>
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .faq {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 40rem;
    margin-inline: auto;
  }

  .faq__item {
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .faq h3 {
    margin: 0;
  }

  .faq__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    background: var(--color-bg);
    border: none;
    padding: 1.1rem 1.25rem;
    font: inherit;
    font-weight: 600;
    text-align: left;
    cursor: pointer;
  }

  .faq__icon {
    flex-shrink: 0;
    color: var(--color-primary);
    font-size: 1.25rem;
    transition: transform 0.15s ease;
  }

  .faq__icon.is-open {
    transform: rotate(45deg);
  }

  .faq__panel {
    padding: 0 1.25rem 1.1rem;
    color: var(--color-text-muted);
  }

  .faq__panel p {
    margin: 0;
  }
</style>
