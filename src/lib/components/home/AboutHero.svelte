<script lang="ts">
  import Github from 'lucide-svelte/icons/github';
  import Linkedin from 'lucide-svelte/icons/linkedin';
  import Mail from 'lucide-svelte/icons/mail';
  import XLogo from '../icons/XLogo.svelte';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
  import { contactData } from '#lib/contact-data.ts';
  import { portfolioItems } from '#lib/portfolio-data.ts';
  import profilePhoto from '../../assets/ProfilePhoto.webp';
  import PortraitReveal from '../effects/PortraitReveal.svelte';
  import InkArtwork from '../effects/InkArtwork.svelte';

  const selectedWork = portfolioItems
    .filter((item) => item.featured)
    .flatMap((item) => {
      const href = item.project_url ?? item.github_url;

      return href ? [{ ...item, href }] : [];
    });
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
          <div class="home-hero-copy mp-stack mt-8">
            <p class="mp-body mp-body--lg">
              At
              <strong class="mp-on-ink font-medium">
                Advanced Engineering Consultants
              </strong>, I design MEP systems and manage the company&apos;s IT.
              I also build internal software that reduces repetitive drawing and
              project delivery work.
            </p>
            <p class="mp-body">
              Outside work, I build engineering software for people and AI
              agents at Surfside Software.
            </p>
          </div>
        </div>

        <div class="home-work">
          <h2 class="mp-eyebrow">Selected work</h2>
          <ul>
            {#each selectedWork as item (item.id)}
              <li>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="home-work__row"
                >
                  <span class="home-work__title">{item.title}</span>
                  <span class="home-work__summary">{item.summary}</span>
                  <ArrowUpRight class="home-work__arrow" aria-hidden="true" />
                  <span class="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            {/each}
          </ul>
        </div>

        <div class="mp-row mt-8">
          <a href="/portfolio" class="mp-btn mp-btn--accent">
            All projects <ArrowRight class="mp-icon" aria-hidden="true" />
          </a>
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
          <a
            href={`mailto:${contactData.emails[0].address}`}
            class="mp-btn mp-btn--secondary mp-btn--icon"
            aria-label="Email"
            title="Email"
          >
            <Mail class="mp-icon" aria-hidden="true" />
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
