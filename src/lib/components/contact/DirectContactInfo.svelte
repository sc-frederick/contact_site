<script lang="ts">
  import Mail from 'lucide-svelte/icons/mail';
  import Phone from 'lucide-svelte/icons/phone';
  import MapPin from 'lucide-svelte/icons/map-pin';
  import AtSign from 'lucide-svelte/icons/at-sign';
  import { contactData } from '#lib/contact-data.ts';
  import SignalArtwork from '../effects/SignalArtwork.svelte';

  let { sent }: { sent: boolean } = $props();
</script>

<aside class="mp-card mp-card--ink mp-on-ink contact-details mp-span-5">
  <div>
    <p class="mp-eyebrow">Direct details</p>
    <h2 class="mp-headline mp-on-ink mb-3">Get in Touch</h2>
    <p class="mp-body">
      Send me a message about a project or collaboration. I will reply as soon
      as I can.
    </p>
  </div>

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
      <div class="contact-row__icon">
        <AtSign class="mp-icon" />
      </div>
      <div class="flex-1">
        <p class="mp-eyebrow mb-1">Elsewhere</p>
        <ul class="contact-socials">
          {#each [{ label: 'GitHub', href: contactData.github }, { label: 'LinkedIn', href: contactData.linkedin }, { label: 'X', href: contactData.x }] as social (social.label)}
            <li>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                class="mp-body mp-on-ink contact-link hover:underline"
                >{social.label}</a
              >
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  <SignalArtwork {sent} />
</aside>
