<script>
  /**
   * @typedef {{ name: string, monthly: number, annual: number, features: string[], highlighted?: boolean }} Plan
   * @type {{ plans: Plan[] }}
   */
  let { plans } = $props();

  // Local-only state: this island owns its toggle, nothing else on the page
  // needs to know about it, so there's no reason to reach for a shared
  // store.
  let annual = $state(false);

  const format = (value) =>
    value === 0 ? '$0' : `$${value.toLocaleString()}`;
</script>

<div class="pricing-toggle">
  <span class:is-active={!annual}>Monthly</span>
  <button
    type="button"
    class="pricing-toggle__switch"
    role="switch"
    aria-checked={annual}
    aria-label="Toggle annual pricing"
    onclick={() => (annual = !annual)}
  >
    <span class="pricing-toggle__thumb" class:is-annual={annual}></span>
  </button>
  <span class:is-active={annual}>Annual <em>(save ~15%)</em></span>
</div>

<div class="pricing-grid">
  {#each plans as plan (plan.name)}
    <div class="card pricing-card" class:is-highlighted={plan.highlighted} data-animate-item>
      {#if plan.highlighted}
        <p class="pricing-card__badge">Most popular</p>
      {/if}
      <h3>{plan.name}</h3>
      <p class="pricing-card__price">
        {format(annual ? plan.annual : plan.monthly)}
        <span>/ {annual ? 'year' : 'month'}</span>
      </p>
      <ul class="pricing-card__features">
        {#each plan.features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
      <a class="btn {plan.highlighted ? 'btn--primary' : 'btn--secondary'}" href="#cta">
        Choose {plan.name}
      </a>
    </div>
  {/each}
</div>

<style>
  .pricing-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2.5rem;
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  .pricing-toggle span.is-active {
    color: var(--color-text);
    font-weight: 600;
  }

  .pricing-toggle__switch {
    width: 3rem;
    height: 1.75rem;
    border-radius: 999px;
    background: var(--color-border);
    border: none;
    position: relative;
    cursor: pointer;
    padding: 0;
  }

  .pricing-toggle__thumb {
    position: absolute;
    top: 0.1875rem;
    left: 0.1875rem;
    width: 1.375rem;
    height: 1.375rem;
    border-radius: 50%;
    background: var(--color-primary);
    transition: transform 0.15s ease;
  }

  .pricing-toggle__thumb.is-annual {
    transform: translateX(1.25rem);
  }

  .pricing-grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  }

  .pricing-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .pricing-card.is-highlighted {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 1px var(--color-primary);
  }

  .pricing-card__badge {
    color: var(--color-primary);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
  }

  .pricing-card__price {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }

  .pricing-card__price span {
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--color-text-muted);
  }

  .pricing-card__features {
    list-style: none;
    padding: 0;
    margin: 0 0 0.5rem;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .pricing-card__features li::before {
    content: '✓ ';
    color: var(--color-primary);
    font-weight: 700;
  }
</style>
