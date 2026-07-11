<script>
  // Form fields, validation error, and submitted status are all local to
  // this island — a landing page's only "state" is typically this one form,
  // so it stays in plain component state rather than a shared store.
  let name = $state('');
  let email = $state('');
  let message = $state('');
  let status = $state(/** @type {'idle' | 'submitted' | 'error'} */ ('idle'));

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      status = 'error';
      return;
    }

    // Wire this up to your form endpoint of choice (Formspree, an API
    // route, etc). Kept as a local no-op here so the starter has no
    // required backend.
    status = 'submitted';
  }
</script>

{#if status === 'submitted'}
  <p class="form-success" role="status">
    Thanks, {name}! We'll be in touch at {email}.
  </p>
{:else}
  <form class="contact-form" onsubmit={handleSubmit} novalidate>
    <div class="contact-form__field">
      <label for="name">Name</label>
      <input id="name" name="name" type="text" bind:value={name} autocomplete="name" />
    </div>
    <div class="contact-form__field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" bind:value={email} autocomplete="email" />
    </div>
    <div class="contact-form__field">
      <label for="message">Message (optional)</label>
      <textarea id="message" name="message" rows="3" bind:value={message}></textarea>
    </div>

    {#if status === 'error'}
      <p class="contact-form__error" role="alert">
        Please fill in your name and email.
      </p>
    {/if}

    <button type="submit" class="btn btn--primary">Send</button>
  </form>
{/if}

<style>
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 28rem;
    margin-inline: auto;
    text-align: left;
  }

  .contact-form__field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  label {
    font-size: 0.85rem;
    font-weight: 600;
  }

  input,
  textarea {
    font: inherit;
    padding: 0.65rem 0.85rem;
    border-radius: var(--radius);
    border: 1px solid var(--color-border);
    background: #fff;
    color: inherit;
  }

  input:focus,
  textarea:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
  }

  .contact-form__error {
    color: #b91c1c;
    font-size: 0.85rem;
    margin: 0;
  }

  .form-success {
    max-width: 28rem;
    margin-inline: auto;
    font-weight: 600;
  }
</style>
