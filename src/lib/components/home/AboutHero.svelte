<script lang="ts">
  import Github from 'lucide-svelte/icons/github';
  import Linkedin from 'lucide-svelte/icons/linkedin';
  import Mail from 'lucide-svelte/icons/mail';
  import { contactData } from '#lib/contact-data.ts';
  import profilePhoto from '../../assets/ProfilePhoto.webp';
  import PortraitReveal from '../effects/PortraitReveal.svelte';
  import InkArtwork from '../effects/InkArtwork.svelte';
</script>

<section class="flex flex-1 items-center">
  <div class="mp-shell">
    <div class="mp-grid--mosaic">
      <article
        class="mp-card mp-card--ink mp-on-ink mp-span-7 min-h-[440px] justify-between md:min-h-[520px]"
      >
        <div>
          <p class="mp-eyebrow">MEP Engineer / Software Developer</p>
          <h1 class="home-hero-name mp-display mp-display--xl mp-on-ink">
            Stephen <span class="mp-italic">Frederick</span>
          </h1>
        </div>
        <div class="home-hero-copy mp-stack">
          <p class="mp-body mp-body--lg">
            At
            <strong class="mp-on-ink font-medium">
              Advanced Engineering Consultants
            </strong>, I design MEP systems and manage the company&apos;s IT. I
            also build internal software that reduces repetitive drawing and
            project delivery work.
          </p>
          <p class="mp-body">
            Outside work, I build Forewit at Surfside Software, engineering
            software for people and AI agents.
          </p>
        </div>

        <div class="mp-row mt-8">
          <a
            href={contactData.github}
            target="_blank"
            rel="noopener noreferrer"
            class="mp-btn mp-btn--secondary mp-btn--sm"
            aria-label="GitHub"
          >
            <Github class="mp-icon" /> GitHub
          </a>
          <a
            href={contactData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            class="mp-btn mp-btn--secondary mp-btn--sm"
            aria-label="LinkedIn"
          >
            <Linkedin class="mp-icon" /> LinkedIn
          </a>
          <a
            href={`mailto:${contactData.emails[0].address}`}
            class="mp-btn mp-btn--accent mp-btn--sm"
          >
            <Mail class="mp-icon" /> Email
          </a>
        </div>
      </article>

      <article class="mp-feature-tile mp-span-5 min-h-[520px]">
        <div
          class="home-hero-photo mp-card__media m-6 mb-0 min-h-0 flex-1 border border-white/20"
        >
          <PortraitReveal src={profilePhoto} alt={contactData.name} />
        </div>
        <div class="mp-feature-tile__body">
          <p class="mp-eyebrow mp-on-violet">Brooksville, Florida</p>
          <h2 class="mp-feature-tile__title">
            Engineering systems. Building useful software.
          </h2>
        </div>
        <InkArtwork class="home-ink-strip" />
      </article>
    </div>
  </div>
</section>
