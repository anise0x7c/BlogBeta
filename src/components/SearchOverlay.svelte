<script lang="ts">
  // Site-wide search overlay powered by the prebuilt Pagefind index that
  // astro-pagefind writes to /pagefind/ after `astro build`. The bundle is
  // imported lazily on first open: in `astro dev` it is only served after a
  // build has produced dist/pagefind at least once.
  import { tick } from "svelte";
  import { stickerColor } from "../utils/color";

  type PagefindModule = typeof import("/pagefind/pagefind.js");

  interface SearchItem {
    url: string;
    excerpt: string;
    title?: string;
    date?: string;
  }

  interface TagCount {
    tag: string;
    count: number;
  }

  const MAX_RESULTS = 8;

  let open = $state(false);
  let status = $state<"idle" | "loading" | "ready" | "error">("idle");
  let loading = $state(false);
  let query = $state("");
  let results = $state<SearchItem[]>([]);
  let tagCounts = $state<TagCount[]>([]);
  let activeTags = $state<string[]>([]);
  let selected = $state(0);

  let inputEl = $state<HTMLInputElement>();
  let listEl = $state<HTMLElement>();

  let pf: PagefindModule | null = null;
  let searchToken = 0;
  let restoreEl: HTMLElement | null = null;

  function syncTriggerAria(expanded: boolean) {
    document
      .querySelector("[data-search-trigger]")
      ?.setAttribute("aria-expanded", String(expanded));
  }

  async function ensurePagefind() {
    if (pf || status === "loading") return;
    status = "loading";
    try {
      // Runtime-served bundle, absent until the first build. Held in a
      // variable so the bundler must leave this import alone.
      const bundleUrl = "/pagefind/pagefind.js";
      pf = (await import(/* @vite-ignore */ bundleUrl)) as PagefindModule;
      const counts = await pf.filters();
      tagCounts = Object.entries(counts.tag ?? {})
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
      status = "ready";
    } catch {
      status = "error";
    }
  }

  async function openDialog() {
    restoreEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    open = true;
    selected = 0;
    document.documentElement.style.overflow = "hidden";
    syncTriggerAria(true);
    await tick();
    inputEl?.focus();
    await ensurePagefind();
  }

  function close() {
    open = false;
    document.documentElement.style.overflow = "";
    syncTriggerAria(false);
    restoreEl?.focus?.();
    restoreEl = null;
  }

  async function runSearch(q: string, tags: string[]) {
    if (!pf) return;
    const token = ++searchToken;
    if (!q && tags.length === 0) {
      results = [];
      loading = false;
      return;
    }
    loading = true;
    try {
      // An empty query with filters still returns all pages matching them.
      const res = await pf.search(
        q,
        tags.length ? { filters: { tag: tags } } : undefined,
      );
      if (token !== searchToken) return;
      const top = res.results.slice(0, MAX_RESULTS);
      const datas = await Promise.all(top.map((r) => r.data()));
      if (token !== searchToken) return;
      results = datas.map((d) => ({
        url: d.url,
        excerpt: d.excerpt,
        title: d.meta?.title,
        date: d.meta?.date,
      }));
      selected = 0;
    } finally {
      if (token === searchToken) loading = false;
    }
  }

  function toggleTag(tag: string) {
    activeTags = activeTags.includes(tag)
      ? activeTags.filter((t) => t !== tag)
      : [...activeTags, tag];
  }

  function anchorAt(i: number): HTMLAnchorElement | null {
    return listEl?.querySelector<HTMLAnchorElement>(`a[data-index="${i}"]`) ?? null;
  }

  function scrollSelected() {
    anchorAt(selected)?.scrollIntoView({ block: "nearest" });
  }

  function openResult(i: number) {
    // Click the real anchor so <ClientRouter /> intercepts the navigation.
    anchorAt(i)?.click();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selected = Math.min(selected + 1, results.length - 1);
      scrollSelected();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selected = Math.max(selected - 1, 0);
      scrollSelected();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) openResult(selected);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  function onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }

  // Bindings live at document level: with view transitions the trigger button
  // is a fresh DOM node after every navigation, so re-bind on each page load.
  $effect(() => {
    const onTriggerClick = (e: Event) => {
      e.preventDefault();
      void openDialog();
    };
    document
      .querySelector("[data-search-trigger]")
      ?.addEventListener("click", onTriggerClick);

    const onPageLoad = () => {
      if (open) close();
    };
    document.addEventListener("astro:page-load", onPageLoad);

    return () => {
      document
        .querySelector("[data-search-trigger]")
        ?.removeEventListener("click", onTriggerClick);
      document.removeEventListener("astro:page-load", onPageLoad);
      document.documentElement.style.overflow = "";
    };
  });

  // Debounced search: reacts to both the query text and the active filters.
  $effect(() => {
    if (!open || status !== "ready") return;
    const q = query.trim();
    const tags = activeTags;
    const t = setTimeout(() => void runSearch(q, tags), 150);
    return () => clearTimeout(t);
  });

  const showEmptyHint =
    status === "ready" && !query.trim() && activeTags.length === 0;
</script>

{#if open}
  <div
    class="overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Search posts"
    onclick={onBackdrop}
  >
    <div class="panel">
      <div class="box">
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
        <input
          bind:this={inputEl}
          bind:value={query}
          onkeydown={onKeydown}
          type="text"
          placeholder="Search posts…"
          autocomplete="off"
          spellcheck="false"
          aria-label="Search posts"
        />
        <button class="close" type="button" onclick={close} aria-label="Close search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {#if tagCounts.length > 0}
        <div class="tagrow" role="group" aria-label="Filter by tag">
          {#each tagCounts as { tag, count } (tag)}
            <button
              type="button"
              class="chip filter"
              class:active={activeTags.includes(tag)}
              style={`--tag-color: ${stickerColor(tag)}`}
              onclick={() => toggleTag(tag)}
              aria-pressed={activeTags.includes(tag)}
            >
              #{tag}
              <span class="count">{count}</span>
            </button>
          {/each}
        </div>
      {/if}

      <div class="results" bind:this={listEl}>
        {#if status === "error"}
          <p class="hint">
            Search index is unavailable here. Run <code>pnpm build</code> once to
            generate it, then try again.
          </p>
        {:else if showEmptyHint}
          <p class="hint">Type to search across all posts, or pick a tag above.</p>
        {:else if loading && results.length === 0}
          <p class="hint">Searching…</p>
        {:else if status === "ready" && results.length === 0}
          <p class="hint">No results{#if query.trim()} for “{query.trim()}”{/if}.</p>
        {:else if results.length > 0}
          <ul>
            {#each results as r, i (r.url)}
              <li>
                <a
                  class="result"
                  class:selected={i === selected}
                  data-index={i}
                  href={r.url}
                  onclick={close}
                >
                  <span class="row">
                    <span class="title">{r.title ?? r.url}</span>
                    {#if r.date}<span class="date">{r.date}</span>{/if}
                  </span>
                  <span class="excerpt search-excerpt">{@html r.excerpt}</span>
                </a>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 10vh 1rem 1rem;
    background: color-mix(in srgb, #000 45%, transparent);
    backdrop-filter: blur(0.5rem);
    -webkit-backdrop-filter: blur(0.5rem);
    animation: fade 0.15s ease;
  }

  @keyframes fade {
    from {
      opacity: 0;
    }
  }

  .panel {
    width: min(40rem, 100%);
    max-height: 75vh;
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-float);
    overflow: hidden;
    animation: pop 0.18s ease;
  }

  @keyframes pop {
    from {
      opacity: 0;
      transform: translateY(0.5rem) scale(0.98);
    }
  }

  .box {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 0.9rem;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-muted);
  }

  .box:focus-within {
    border-bottom-color: var(--color-accent);
    color: var(--color-accent);
  }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--color-text);
    font: inherit;
    font-size: 1rem;
  }

  input::placeholder {
    color: var(--color-subtle);
  }

  .close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-subtle);
    cursor: pointer;
  }

  .close:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }

  .tagrow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.6rem 0.9rem;
    border-bottom: 1px solid var(--color-border);
  }

  .filter {
    border: none;
    cursor: pointer;
    font: inherit;
    font-size: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .filter .count {
    font-size: 0.68rem;
    opacity: 0.7;
  }

  .filter.active {
    background: var(--tag-color, var(--color-accent));
    color: #241d16;
  }

  .results {
    overflow-y: auto;
    padding: 0.5rem;
  }

  .results ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .result {
    display: block;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius-md);
    text-decoration: none;
  }

  .result:hover,
  .result.selected {
    background: var(--color-surface-hover);
  }

  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .title {
    font-weight: 700;
    color: var(--color-text);
    font-size: 0.95rem;
  }

  .date {
    flex-shrink: 0;
    font-size: 0.75rem;
    color: var(--color-subtle);
  }

  .excerpt {
    display: block;
    margin-top: 0.2rem;
    font-size: 0.85rem;
    line-height: 1.5;
    color: var(--color-muted);
  }

  .hint {
    margin: 0;
    padding: 1.1rem 0.9rem;
    color: var(--color-muted);
    font-size: 0.9rem;
  }

  .hint code {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    background: var(--color-surface-sunk);
    border-radius: 0.25rem;
    padding: 0 0.3rem;
  }
</style>
