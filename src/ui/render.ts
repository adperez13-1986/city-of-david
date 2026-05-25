import { DAY_STAMINA, DESK_SLOT_COUNT } from '../model/index.ts';
import type { Day, Journal, Noticing } from '../model/index.ts';
import { noticingsByTheme } from '../engine/index.ts';
import { scrollIndex, themes } from '../content/index.ts';
import {
  dispatch,
  getState,
  subscribe,
  type LastDay,
} from '../state.ts';
import { escapeHtml as esc } from './escape.ts';

const EXCERPT_PREVIEW = 80;
const MAX_TAGS_DISPLAYED = 3;

export function mount(root: HTMLElement): void {
  subscribe(() => render(root));
  root.addEventListener('click', onClick);
  render(root);
}

function render(root: HTMLElement): void {
  const state = getState();
  switch (state.screen) {
    case 'play':
      if (!state.day) {
        root.innerHTML = renderEmptyArchive();
        return;
      }
      root.innerHTML = renderPlay(state.day, state.journal, state.selectedScrollId);
      return;
    case 'end-of-day':
      root.innerHTML = renderEndOfDay(state.journal, state.lastDay);
      return;
    case 'journal':
      root.innerHTML = renderJournal(state.journal);
      return;
    case 'empty-archive':
      root.innerHTML = renderEmptyArchive();
      return;
  }
}

function onClick(event: Event): void {
  const target = event.target as HTMLElement | null;
  if (!target) return;
  const actionEl = target.closest<HTMLElement>('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const arg = actionEl.dataset.arg;
  switch (action) {
    case 'select-scroll':
      if (arg) dispatch({ kind: 'select-scroll', scrollId: arg });
      return;
    case 'place-here':
      if (arg !== undefined) {
        dispatch({ kind: 'place-here', slotIndex: Number(arg) });
      }
      return;
    case 'open-journal':
      dispatch({ kind: 'open-journal' });
      return;
    case 'close-journal':
      dispatch({ kind: 'close-journal' });
      return;
    case 'continue-day':
      dispatch({ kind: 'continue-day' });
      return;
    case 'clear-selection':
      dispatch({ kind: 'clear-selection' });
      return;
  }
}

function renderPlay(
  day: Day,
  journal: Journal,
  selectedScrollId: string | null,
): string {
  return `
    ${renderTopbar(day, journal)}
    ${renderOffer(day, selectedScrollId)}
    ${renderDesk(day, selectedScrollId)}
  `;
}

function renderTopbar(day: Day, journal: Journal): string {
  const dayNumber = journal.daysPlayed + 1;
  return `
    <header class="topbar fade-in">
      <div class="topbar__row">
        <span class="topbar__meta">Day ${dayNumber}</span>
        <span class="topbar__stamina" aria-label="Stamina">${day.stamina}/${DAY_STAMINA}</span>
        <button class="topbar__journal" data-action="open-journal" type="button">Journal</button>
      </div>
      <p class="topbar__byline">A day at the scribe's desk. Place scrolls that share a theme adjacent to each other to notice what they share.</p>
    </header>
  `;
}

function deskThemeSet(day: Day): Set<string> {
  const set = new Set<string>();
  for (const slot of day.desk) {
    if (!slot) continue;
    for (const themeId of slot.themeIds) set.add(themeId);
  }
  return set;
}

function renderOffer(day: Day, selectedScrollId: string | null): string {
  if (day.offered.length === 0) {
    return `<section class="offer offer--empty">The archive is dry today.</section>`;
  }
  const deskThemes = deskThemeSet(day);
  const cards = day.offered
    .map((id) => {
      const scroll = scrollIndex[id];
      if (!scroll) return '';
      const selected = id === selectedScrollId;
      const sharesWithDesk =
        deskThemes.size > 0 &&
        scroll.themeIds.some((t) => deskThemes.has(t));
      const excerpt =
        scroll.textExcerpt.length > EXCERPT_PREVIEW
          ? scroll.textExcerpt.slice(0, EXCERPT_PREVIEW) + '…'
          : scroll.textExcerpt;
      const tags = scroll.tags
        .slice(0, MAX_TAGS_DISPLAYED)
        .map((t) => `<span class="tag">${esc(t)}</span>`)
        .join('');
      return `
        <button
          type="button"
          class="scroll-card${selected ? ' scroll-card--selected' : ''}${sharesWithDesk ? ' scroll-card--echo' : ''}"
          data-action="select-scroll"
          data-arg="${esc(id)}"
        >
          <div class="scroll-card__head">
            <span class="scroll-card__title">${esc(scroll.title)}</span>
            <span class="scroll-card__cost" aria-label="Stamina cost">${scroll.staminaCost}</span>
          </div>
          <p class="scroll-card__reference">${esc(scroll.reference)}</p>
          ${tags ? `<div class="scroll-card__tags">${tags}</div>` : ''}
          <p class="scroll-card__excerpt">${esc(excerpt)}</p>
        </button>
      `;
    })
    .join('');
  return `<section class="offer">${cards}</section>`;
}

function renderDesk(day: Day, selectedScrollId: string | null): string {
  const placing = selectedScrollId !== null;
  const cells: string[] = [];
  for (let i = 0; i < DESK_SLOT_COUNT; i++) {
    const scroll = day.desk[i];
    if (scroll) {
      cells.push(`
        <div class="slot slot--full">
          <span class="slot__title">${esc(scroll.title)}</span>
          <span class="slot__reference">${esc(scroll.reference)}</span>
        </div>
      `);
    } else if (placing) {
      cells.push(`
        <button
          type="button"
          class="slot slot--empty slot--target"
          data-action="place-here"
          data-arg="${i}"
          aria-label="Place here"
        >
          <span class="slot__hint">Place</span>
        </button>
      `);
    } else {
      cells.push(`<div class="slot slot--empty" aria-hidden="true"></div>`);
    }
  }
  return `
    <section class="desk" aria-label="Desk">
      <svg class="desk__edges" viewBox="0 0 2 1" preserveAspectRatio="none" aria-hidden="true">
        <line x1="0.5" y1="0.25" x2="1.5" y2="0.25"></line>
        <line x1="0.5" y1="0.75" x2="1.5" y2="0.75"></line>
        <line x1="0.5" y1="0.25" x2="0.5" y2="0.75"></line>
        <line x1="1.5" y1="0.25" x2="1.5" y2="0.75"></line>
      </svg>
      ${cells.join('')}
    </section>
  `;
}

function renderEndOfDay(journal: Journal, lastDay: LastDay | null): string {
  const drafted = lastDay?.draftedCount ?? 0;
  const noticings = lastDay?.newNoticings ?? [];
  return `
    <div class="overlay fade-in">
      <div class="end-panel">
        <h2 class="end-panel__title">The day closes</h2>
        <p class="end-panel__subtitle">
          ${drafted} scroll${drafted === 1 ? '' : 's'} drafted${noticings.length === 0 ? ' · the day was quiet' : ''}
        </p>
        ${renderEndNoticings(noticings)}
        <p class="end-panel__journal-stat">
          ${journal.noticings.length} noticing${journal.noticings.length === 1 ? '' : 's'} in the chronicle so far
        </p>
        <div class="end-panel__actions">
          <button type="button" class="btn btn--primary" data-action="continue-day">Continue</button>
          <button type="button" class="btn btn--ghost" data-action="open-journal">Open journal</button>
        </div>
      </div>
    </div>
  `;
}

function renderEndNoticings(noticings: readonly Noticing[]): string {
  if (noticings.length === 0) {
    return `<p class="end-panel__none">You sat at the desk. That was enough.</p>`;
  }
  const items = noticings
    .map((n) => {
      const a = scrollIndex[n.scrollIds[0]];
      const b = scrollIndex[n.scrollIds[1]];
      const pair =
        a && b
          ? `${esc(a.title)} <span class="whisper__sep">·</span> ${esc(b.title)}`
          : '';
      return `
        <li class="whisper">
          <span class="whisper__line">${esc(n.whisper)}</span>
          ${pair ? `<span class="whisper__pair">${pair}</span>` : ''}
        </li>
      `;
    })
    .join('');
  return `
    <div class="end-panel__whispers">
      <h3 class="end-panel__whispers-title">You noticed</h3>
      <ul class="whispers">${items}</ul>
    </div>
  `;
}

function renderJournal(journal: Journal): string {
  const grouped = noticingsByTheme(journal);
  const sections = themes
    .map((theme) => {
      const list = grouped.get(theme.id) ?? [];
      return renderJournalTheme(theme.id, list, theme.whisper, theme.description);
    })
    .join('');
  const totalNoticings = journal.noticings.length;
  return `
    <div class="overlay overlay--full fade-in">
      <header class="overlay__header">
        <h2 class="overlay__title">Chronicle</h2>
        <button type="button" class="overlay__close" data-action="close-journal">Close</button>
      </header>
      <p class="journal__stats">
        Day ${journal.daysPlayed} · ${journal.draftedScrollIds.length} scroll${journal.draftedScrollIds.length === 1 ? '' : 's'} drafted · ${totalNoticings} noticing${totalNoticings === 1 ? '' : 's'}
      </p>
      <div class="journal__list">${sections}</div>
    </div>
  `;
}

function renderJournalTheme(
  themeId: string,
  noticings: readonly Noticing[],
  whisper: string,
  description: string | undefined,
): string {
  const items =
    noticings.length === 0
      ? `<p class="journal-theme__empty">Not yet noticed.</p>`
      : `<ul class="whispers whispers--journal">${noticings
          .map((n) => {
            const a = scrollIndex[n.scrollIds[0]];
            const b = scrollIndex[n.scrollIds[1]];
            const pair =
              a && b
                ? `${esc(a.title)} <span class="whisper__sep">·</span> ${esc(b.title)}`
                : '';
            return `
              <li class="whisper whisper--journal">
                <span class="whisper__pair">${pair}</span>
                <span class="whisper__day">Day ${n.day}</span>
              </li>
            `;
          })
          .join('')}</ul>`;
  return `
    <section class="journal-theme" data-theme="${esc(themeId)}">
      <h3 class="journal-theme__title">${esc(whisper)}</h3>
      ${description ? `<p class="journal-theme__description">${esc(description)}</p>` : ''}
      ${items}
    </section>
  `;
}

function renderEmptyArchive(): string {
  return `
    <main class="state-screen fade-in">
      <h1 class="state-screen__title">The archive is being prepared</h1>
      <p class="state-screen__subtitle">
        Return when the scribes have written the first scrolls.
      </p>
    </main>
  `;
}
