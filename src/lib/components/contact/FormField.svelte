<script lang="ts">
  import AlertCircle from 'lucide-svelte/icons/alert-circle';

  // Svelte trims leading literal spaces; preserve the original marker spacing.
  const requiredMarker = ' *';

  let {
    id,
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required,
    isTextarea,
    maxLength,
  }: {
    id: string;
    label: string;
    type?: 'text' | 'email';
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    isTextarea?: boolean;
    maxLength?: number;
  } = $props();
</script>

<div class={['mp-field', error && 'mp-field--error']}>
  <label for={id} class="mp-field__label"
    >{label}{#if required}<span aria-hidden="true">{requiredMarker}</span
      >{/if}</label
  >
  {#if isTextarea}
    <textarea
      {id}
      name={id}
      {value}
      oninput={(event) => onChange(event.currentTarget.value)}
      {placeholder}
      maxlength={maxLength}
      {required}
      rows={5}
      class="mp-textarea"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}></textarea>
  {:else}
    <input
      {id}
      name={id}
      {type}
      {value}
      oninput={(event) => onChange(event.currentTarget.value)}
      {placeholder}
      maxlength={maxLength}
      {required}
      class="mp-input"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
  {/if}
  {#if error}<p id={`${id}-error`} class="mp-field__error">
      <AlertCircle class="mp-icon mp-icon--sm" />{error}
    </p>{/if}
</div>
