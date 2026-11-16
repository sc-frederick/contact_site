<script lang="ts">
  import Mail from 'lucide-svelte/icons/mail';
  import Phone from 'lucide-svelte/icons/phone';
  import MapPin from 'lucide-svelte/icons/map-pin';
  import Github from 'lucide-svelte/icons/github';
  import Linkedin from 'lucide-svelte/icons/linkedin';
  import XLogo from '../icons/XLogo.svelte';
  import { contactData } from '#lib/contact-data.ts';
  import SignalArtwork from '../effects/SignalArtwork.svelte';

  let { sent }: { sent: boolean } = $props();
</script>

<aside class="mp-card mp-card--ink mp-on-ink contact-details mp-span-5">
  <div>
    <div class="contact-row">
      <div class="contact-row__icon">
        <Mail class="mp-icon" />
      </div>
      <div class="flex-1">
        <p class="mp-eyebrow mb-1">Email</p>
        <div class="mp-stack gap-1">
          {#each contactData.emails as email (email.address)}
            <a
              href={`mailto:${email.address}`}
              class="mp-body mp-on-ink contact-link hover:underline"
            >
              {email.address}
            </a>
          {/each}
        </div>
      </div>
    </div>

    <div class="contact-row">
      <div class="contact-row__icon">
        <Phone class="mp-icon" />
      </div>
      <div class="flex-1">
        <p class="mp-eyebrow mb-1">Phone</p>
        <a
          href={`tel:${contactData.phone.number.replace(/\s/g, '')}`}
          class="mp-body mp-on-ink contact-link hover:underline"
        >
          {contactData.phone.number}
        </a>
      </div>
    </div>

    <div class="contact-row">
      <div class="contact-row__icon">
        <MapPin class="mp-icon" />
      </div>
      <div class="flex-1">
        <p class="mp-eyebrow mb-1">Location</p>
        <p class="mp-body mp-on-ink">
          {contactData.location}
        </p>
      </div>
    </div>
    <div class="contact-row">
      <span aria-hidden="true"></span>
      <div class="flex-1">
        <p class="sr-only">Profiles</p>
        <ul class="contact-socials">
          <li>
            <a
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              class="mp-btn mp-btn--secondary mp-btn--icon"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github class="mp-icon" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              class="mp-btn mp-btn--secondary mp-btn--icon"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin class="mp-icon" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={contactData.x}
              target="_blank"
              rel="noopener noreferrer"
              class="mp-btn mp-btn--secondary mp-btn--icon"
              aria-label="X"
              title="X"
            >
              <XLogo class="mp-icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <SignalArtwork {sent} />
</aside>
