<script lang="ts">
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  import type { PortfolioItem, ProjectOwner } from '#lib/types.ts';
  import PortfolioCard from './PortfolioCard.svelte';
  import PortfolioModal from './PortfolioModal.svelte';

  let { items }: { items: readonly PortfolioItem[] } = $props();

  // The open dialog lives in history state, so the browser or Android back
  // gesture closes it instead of leaving the page.
  let activeItem = $derived(
    items.find((item) => item.id === page.state.projectId) ?? null,
  );

  /** Projects are grouped by who they were built for, in this order. */
  const groups: readonly {
    readonly owner: ProjectOwner;
    readonly heading: string;
    readonly note?: string;
    readonly href?: string;
    readonly compact: boolean;
  }[] = [
    {
      owner: 'Surfside Software',
      heading: 'Surfside Software',
      note: 'My company: engineering software for people and AI agents.',
      href: 'https://surfside-software.com',
      compact: false,
    },
    {
      owner: 'Advanced Engineering Consultants',
      heading: 'Advanced Engineering Consultants',
      note: 'Internal tools the whole office uses on live projects.',
      compact: true,
    },
    { owner: 'Other', heading: 'Other work', compact: true },
  ];

  let sections = $derived(
    groups
      .map((group) => ({
        ...group,
        id: `projects-${group.owner.toLowerCase().replaceAll(' ', '-')}`,
        items: items
          .filter((item) => item.owner === group.owner)
          .toSorted((a, b) => a.display_order - b.display_order),
      }))
      .map((section) => ({
        ...section,
        spans: section.compact
          ? compactSpans(section.items)
          : section.items.map(() => 4),
      })),
  );

  /**
   * Column spans for a compact section: a card with a screenshot takes eight
   * columns beside a four-column card, the rest run three to a row, and a
   * short final row stretches to fill the width.
   */
  function compactSpans(list: readonly PortfolioItem[]): number[] {
    const spans: number[] = [];
    let index = 0;

    while (index < list.length) {
      const remaining = list.length - index;

      if (list[index]?.image && remaining >= 2) {
        spans.push(8, 4);
        index += 2;
      } else {
        const row = remaining === 4 ? 2 : Math.min(3, remaining);

        spans.push(...Array.from({ length: row }, () => 12 / row));
        index += row;
      }
    }

    return spans;
  }

  function open(item: PortfolioItem) {
    pushState('', { projectId: item.id });
  }
</script>

{#each sections as section (section.owner)}
  {#if section.items.length > 0}
    <section aria-labelledby={section.id} class="project-section">
      <header class="project-section__header">
        <h2 id={section.id} class="mp-title">
          {#if section.href}
            <a href={section.href} target="_blank" rel="noopener noreferrer"
              >{section.heading}</a
            >
          {:else}
            {section.heading}
          {/if}
        </h2>
        {#if section.note}<p class="mp-meta">{section.note}</p>{/if}
      </header>
      <div class="mp-grid">
        {#each section.items as item, index (item.id)}<PortfolioCard
            {item}
            onOpen={open}
            compact={section.compact}
            span={section.spans[index] ?? 4}
          />{/each}
      </div>
    </section>
  {/if}
{/each}
{#if activeItem}<PortfolioModal
    item={activeItem}
    onClose={() => {
      // Back already cleared the state when the gesture closed the dialog.
      if (page.state.projectId !== undefined) history.back();
    }}
  />{/if}
