<script lang="ts">
  import { cn } from '#lib/utils.ts';
  import type { Experience } from '#lib/resume-data.ts';
  import { getMotion } from '../effects/motion.svelte.ts';

  let { items }: { items: Experience[] } = $props();

  const motion = getMotion();

  // A bare four-digit year ("2026") means the month is not stated.
  function isYearOnly(dateStr: string | null): boolean {
    return Boolean(dateStr && /^\d{4}$/.test(dateStr));
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Present';

    if (isYearOnly(dateStr)) return dateStr;
    const date = new Date(dateStr);

    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  function getDuration(startDate: string, endDate: string | null): string {
    if (isYearOnly(startDate) || isYearOnly(endDate)) return '';
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    const totalMonths = years * 12 + months;
    const displayYears = Math.floor(totalMonths / 12);
    const displayMonths = totalMonths % 12;

    if (displayYears === 0) {
      return `${displayMonths} mo${displayMonths !== 1 ? 's' : ''}`;
    } else if (displayMonths === 0) {
      return `${displayYears} yr${displayYears !== 1 ? 's' : ''}`;
    } else {
      return `${displayYears} yr${displayYears !== 1 ? 's' : ''} ${displayMonths} mo${displayMonths !== 1 ? 's' : ''}`;
    }
  }

  function track(root: HTMLDivElement) {
    const entries = Array.from(
      root.querySelectorAll<HTMLElement>('.timeline-entry'),
    );

    let frame = 0;

    function update() {
      frame = 0;
      const target = window.innerHeight * 0.38;

      const positions = entries.map((entry) => ({
        entry,
        bounds: entry.getBoundingClientRect(),
      }));

      const covering = positions.find(
        ({ bounds }) => bounds.top <= target && bounds.bottom >= target,
      );

      const closest = positions.reduce<(typeof positions)[number] | undefined>(
        (nearest, position) => {
          return !nearest ||
            Math.abs(position.bounds.top - target) <
              Math.abs(nearest.bounds.top - target)
            ? position
            : nearest;
        },
        undefined,
      );

      const active = (covering ?? closest)?.entry;

      for (const entry of entries)
        entry.dataset.active = String(entry === active);
      const node = active?.querySelector<HTMLElement>('.timeline-node');
      const tracker = root.querySelector<HTMLElement>('.timeline-tracker');

      if (node && tracker && root) {
        const bounds = root.getBoundingClientRect();
        const marker = node.getBoundingClientRect();
        tracker.style.setProperty(
          '--timeline-x',
          `${marker.left - bounds.left + marker.width / 2 - 2}px`,
        );
        tracker.style.setProperty(
          '--timeline-y',
          `${marker.top - bounds.top - 12}px`,
        );

        if (!tracker.dataset.positioned) {
          // Commit the first position without sweeping across the date column.
          tracker.getBoundingClientRect();
          tracker.dataset.positioned = 'true';
        }
      }
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }
</script>

<div {@attach track} class="timeline" data-motion={motion.motionAllowed}>
  <div class="timeline-tracker" aria-hidden="true"></div>
  {#each items as item (item.id)}
    <div
      class="timeline-entry grid grid-cols-1 md:grid-cols-[auto_1rem_1fr] md:gap-x-4"
    >
      <div class="hidden md:flex flex-col items-end text-right pt-1">
        <div class="mp-meta whitespace-nowrap tabular-nums">
          {formatDate(item.startDate)}
        </div>
        <div class="mp-meta whitespace-nowrap tabular-nums">
          {formatDate(item.endDate)}
        </div>
        {#if getDuration(item.startDate, item.endDate)}
          <div class="mp-meta mt-1 whitespace-nowrap text-accent tabular-nums">
            {getDuration(item.startDate, item.endDate)}
          </div>
        {/if}
      </div>

      <div class="hidden md:flex flex-col items-center">
        <div
          class="timeline-node mt-1.5 h-3 w-3 shrink-0 rounded-full bg-accent ring-2 ring-[var(--color-paper)]"
        ></div>
        <div class="w-px flex-1 bg-border"></div>
      </div>

      <div
        class="min-w-0 border-b border-border pb-8 last:border-b-0 last:pb-0"
      >
        <div class="md:hidden mb-2">
          <span class="mp-meta tabular-nums">
            {formatDate(item.startDate)} — {formatDate(item.endDate)}
          </span>{#if getDuration(item.startDate, item.endDate)}
            <span class="mp-meta ml-2 text-accent tabular-nums">
              ({getDuration(item.startDate, item.endDate)})
            </span>
          {/if}
        </div>

        <h3 class="mp-title mb-1">
          {item.title}
        </h3>
        <div class={cn('mp-body text-accent', item.location ? 'mb-1' : 'mb-3')}>
          {item.company}
        </div>
        {#if item.location}
          <div class="mp-meta mb-3">{item.location}</div>
        {/if}

        <ul class="experience-list">
          {#each item.description as desc (desc)}
            <li class="mp-body">
              {desc}
            </li>
          {/each}
        </ul>

        {#if item.technologies && item.technologies.length > 0}
          <div class="flex flex-wrap gap-2">
            {#each item.technologies as tech (tech)}
              <span class="mp-chip">
                {tech}
              </span>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
