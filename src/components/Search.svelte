<script lang="ts">
  import { tick } from "svelte";

  interface SearchResult {
    title: string;
    url: string;
    excerpt: string;
  }

  let query = $state("");
  let results = $state<SearchResult[]>([]);
  let open = $state(false);
  let loading = $state(false);
  let unavailable = $state(false);
  let activeIndex = $state(-1);

  let pagefind: any = null;
  let loaded = false;
  let debounceId: ReturnType<typeof setTimeout> | null = null;
  let inputEl = $state<HTMLInputElement | undefined>(undefined);
  let triggerBtn = $state<HTMLButtonElement | undefined>(undefined);

  async function loadPagefind() {
    if (loaded) return;
    loaded = true;
    try {
      const url = "/pagefind/pagefind.js";
      pagefind = await import(/* @vite-ignore */ url);
      await pagefind.init();
    } catch {
      pagefind = null;
      unavailable = true;
    }
  }

  async function runSearch(q: string) {
    if (!pagefind) return;
    const trimmed = q.trim();
    if (!trimmed) {
      results = [];
      activeIndex = -1;
      return;
    }
    loading = true;
    try {
      const search = await pagefind.search(trimmed);
      const top = search.results.slice(0, 6);
      const data = await Promise.all(top.map((r: any) => r.data()));
      results = data.map((d: any) => ({
        title: d.meta?.title ?? d.url,
        url: d.url,
        excerpt: d.excerpt ?? "",
      }))
      .filter((r) => r.url.startsWith("/blogs/"));
      activeIndex = results.length > 0 ? 0 : -1;
    } catch {
      results = [];
      activeIndex = -1;
    } finally {
      loading = false;
    }
  }

  function onInput() {
    if (debounceId) clearTimeout(debounceId);
    debounceId = setTimeout(() => runSearch(query), 180);
  }

  function onKeydown(e: KeyboardEvent) {
    if (results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % results.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + results.length) % results.length;
    } else if (e.key === "Enter") {
      const r = results[activeIndex];
      if (r) {
        e.preventDefault();
        window.location.href = r.url;
      }
    }
  }

  $effect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  });

  async function openOverlay() {
    open = true;
    await loadPagefind();
    await tick();
    inputEl?.focus();
  }

  function closeOverlay() {
    open = false;
    query = "";
    results = [];
    activeIndex = -1;
    triggerBtn?.focus();
  }

  function onOverlayBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) closeOverlay();
  }

  function onOverlayKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") closeOverlay();
  }
</script>

<div class="inline-flex items-center">
  <button
    type="button"
    bind:this={triggerBtn}
    class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-transparent text-muted transition-colors duration-200 hover:border-border-strong hover:bg-surface-hover hover:text-text"
    onclick={openOverlay}
    aria-label="Search"
    aria-haspopup="dialog"
    aria-expanded={open}
    title="Search"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  </button>

  {#if open}
    <div
      class="fixed inset-0 z-100 flex justify-center bg-black/50 animate-fade-in motion-reduce:animate-none"
      onclick={onOverlayBackdrop}
      onkeydown={onOverlayKeydown}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      tabindex="-1"
    >
      <div
        class="relative mt-[clamp(4rem,10vh,7rem)] mb-4 flex max-h-[calc(100vh-clamp(4rem,10vh,7rem)-1rem)] w-[calc(100%-2rem)] max-w-xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-float animate-modal-in motion-reduce:animate-none"
      >
        <div class="flex items-center gap-2 border-b border-border px-5 py-4">
          <input
            bind:this={inputEl}
            type="search"
            class="flex-1 rounded-md border border-border bg-surface-2 px-[0.85rem] py-[0.55rem] font-sans text-base text-text outline-none placeholder:text-subtle focus:border-accent focus:[box-shadow:0_0_0_3px_var(--color-accent-soft)]"
            placeholder="Search…"
            aria-label="Search the site"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={activeIndex >= 0
              ? `search-result-${activeIndex}`
              : undefined}
            autocomplete="off"
            spellcheck="false"
            bind:value={query}
            oninput={onInput}
            onkeydown={onKeydown}
          />
          <button
            type="button"
            class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-transparent text-muted transition-colors duration-200 hover:border-border-strong hover:bg-surface-hover hover:text-text"
            onclick={closeOverlay}
            aria-label="Close search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-2">
          {@render resultsContent()}
        </div>
      </div>
    </div>
  {/if}
</div>

{#snippet resultsContent()}
  {#if loading}
    <div class="px-2 py-4">
      <p class="m-0 text-[0.88rem] text-muted">Searching…</p>
    </div>
  {:else if unavailable}
    <div class="px-2 py-4">
      <p class="m-0 text-[0.88rem] text-muted">
        Search is unavailable in this environment.
      </p>
    </div>
  {:else if query.trim() && results.length === 0}
    <div class="px-2 py-4">
      <p class="m-0 text-[0.88rem] text-muted">
        No results for &ldquo;{query.trim()}&rdquo;.
      </p>
    </div>
  {:else if results.length > 0}
    <ul id="search-results" class="m-0 list-none p-0" role="listbox">
      {#each results as r, i}
        <li
          role="option"
          id={`search-result-${i}`}
          aria-selected={i === activeIndex}
        >
          <a
            href={r.url}
            class="flex flex-col gap-[0.2rem] rounded-md px-3 py-[0.55rem] no-underline transition-colors duration-150 {i === activeIndex ? 'bg-surface-hover' : ''}"
            onfocus={() => (activeIndex = i)}
          >
            <span class="text-[0.92rem] font-semibold leading-[1.3] text-text"
              >{r.title}</span
            >
            {#if r.excerpt}
              <span
                class="search-excerpt line-clamp-2 text-[0.8rem] leading-[1.45] text-muted"
                >{@html r.excerpt}</span
              >
            {/if}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
{/snippet}
