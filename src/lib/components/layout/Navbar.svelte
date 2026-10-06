<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/state';
  import Menu from 'lucide-svelte/icons/menu';
  import X from 'lucide-svelte/icons/x';

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Developer Portfolio' },
    { path: '/resume', label: 'Resume' },
    { path: '/contact', label: 'Contact' },
  ];

  let open = $state(false);

  let menu: HTMLDivElement | undefined;

  let menuButton: HTMLButtonElement | undefined;

  afterNavigate(() => (open = false));

  function captureButton(element: HTMLButtonElement) {
    menuButton = element;

    return () => {
      menuButton = undefined;
    };
  }

  function captureMenu(element: HTMLDivElement) {
    menu = element;
    element.querySelector<HTMLAnchorElement>('a')?.focus();

    return () => {
      menu = undefined;
    };
  }

  function outside(event: MouseEvent) {
    if (
      open &&
      event.target instanceof Node &&
      !menu?.contains(event.target) &&
      !menuButton?.contains(event.target)
    )
      open = false;
  }

  function keydown(event: KeyboardEvent) {
    if (open && event.key === 'Escape') {
      open = false;
      menuButton?.focus();
    }
  }

  $effect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });
</script>

<svelte:document onmousedown={outside} onkeydown={keydown} />
<nav class="site-header fixed inset-x-0 top-0 z-40">
  <div
    class="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3.5"
  >
    <a
      href="/"
      class="flex items-center gap-3"
      aria-label="Stephen Frederick, home"
      ><span class="mp-card__monogram">SF</span><span
        class="hidden font-display text-xl sm:block">Stephen Frederick</span
      ></a
    >
    <div class="mp-tabs site-desktop-nav" aria-label="Primary navigation">
      {#each routes as route (route.path)}<a
          href={route.path}
          class="site-nav-link"
          aria-current={page.url.pathname === route.path ? 'page' : undefined}
          >{route.label}</a
        >{/each}
    </div>
    <button
      {@attach captureButton}
      onclick={() => (open = !open)}
      class="mp-btn mp-btn--secondary mp-btn--icon site-mobile-menu-button"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      {#if open}<X class="mp-icon" />{:else}<Menu class="mp-icon" />{/if}
    </button>
  </div>
  {#if open}
    <button
      type="button"
      tabindex="-1"
      aria-label="Close menu backdrop"
      class="fixed inset-0 top-[73px] z-40 bg-[#101010]/30 md:hidden"
      onclick={() => (open = false)}
    ></button>
    <div
      {@attach captureMenu}
      class="fixed right-0 top-[73px] z-50 h-[calc(100vh-73px)] w-72 border-l border-border bg-bg-surface md:hidden"
    >
      <div class="flex flex-col gap-2 p-6">
        {#each routes as route (route.path)}<a
            href={route.path}
            class="site-nav-link text-base"
            aria-current={page.url.pathname === route.path ? 'page' : undefined}
            onclick={() => (open = false)}>{route.label}</a
          >{/each}
      </div>
    </div>
  {/if}
</nav>
