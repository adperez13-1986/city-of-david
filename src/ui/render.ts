import { DAY_STAMINA, DESK_SLOT_COUNT } from '../model/index.ts';
import type { Day, Fragment, Inquiry, Journal } from '../model/index.ts';
import { isInquiryResolvable } from '../engine/index.ts';
import { inquiries, scrollIndex } from '../content/index.ts';
import {
  dispatch,
  getState,
  subscribe,
  type LastDay,
} from '../state.ts';
import { escapeHtml as esc } from './escape.ts';

const EXCERPT_PREVIEW = 80;

export function mount(root: HTMLElement): void {
  subscribe(() => render(root));
  root.addEventListener('click', onClick);
  render(root);
}

function render(root: HTMLElement): void {
  const state = getState();
  switch (state.screen) {
    case 'play':
      if (!state.currentInquiry || !state.day) {
        root.innerHTML = renderEmptyArchive();
        return;
      }
      root.innerHTML = renderPlay(
        state.currentInquiry,
        state.day,
        state.journal,
        state.selectedScrollId,
      );
      return;
    case 'end-of-day':
      if (!state.currentInquiry) {
        root.innerHTML = renderEmptyArchive();
        return;
      }
      root.innerHTML = renderEndOfDay(
        state.currentInquiry,
        state.journal,
        state.lastDay,
      );
      return;
    case 'journal':
      root.innerHTML = renderJournal(state.journal);
      return;
    case 'completed':
      root.innerHTML = renderCompleted(state.journal);
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
    case 'commit-answer':
      dispatch({ kind: 'commit-answer' });
      return;
    case 'clear-selection':
      dispatch({ kind: 'clear-selection' });
      return;
  }
}

function renderPlay(
  inquiry: Inquiry,
  day: Day,
  journal: Journal,
  selectedScrollId: string | null,
): string {
  return `
    ${renderTopbar(inquiry, day, journal)}
    ${renderOffer(day, selectedScrollId)}
    ${renderDesk(day, selectedScrollId)}
  `;
}

function renderTopbar(inquiry: Inquiry, day: Day, journal: Journal): string {
  const dayNumber = journal.daysPlayed + 1;
  return `
    <header class="topbar fade-in">
      <div class="topbar__row">
        <span class="topbar__meta">Day ${dayNumber}</span>
        <span class="topbar__stamina" aria-label="Stamina">${day.stamina}/${DAY_STAMINA}</span>
        <button class="topbar__journal" data-action="open-journal" type="button">Journal</button>
      </div>
      <p class="topbar__question">${esc(inquiry.question)}</p>
    </header>
  `;
}

function renderOffer(day: Day, selectedScrollId: string | null): string {
  if (day.offered.length === 0) {
    return `<section class="offer offer--empty">The archive is dry today.</section>`;
  }
  const cards = day.offered
    .map((id) => {
      const scroll = scrollIndex[id];
      if (!scroll) return '';
      const selected = id === selectedScrollId;
      const excerpt =
        scroll.textExcerpt.length > EXCERPT_PREVIEW
          ? scroll.textExcerpt.slice(0, EXCERPT_PREVIEW) + '…'
          : scroll.textExcerpt;
      return `
        <button
          type="button"
          class="scroll-card${selected ? ' scroll-card--selected' : ''}"
          data-action="select-scroll"
          data-arg="${esc(id)}"
        >
          <div class="scroll-card__head">
            <span class="scroll-card__title">${esc(scroll.title)}</span>
            <span class="scroll-card__cost" aria-label="Stamina cost">${scroll.staminaCost}</span>
          </div>
          <p class="scroll-card__reference">${esc(scroll.reference)}</p>
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
  return `<section class="desk" aria-label="Desk">${cells.join('')}</section>`;
}

function renderEndOfDay(
  inquiry: Inquiry,
  journal: Journal,
  lastDay: LastDay | null,
): string {
  const resolvable = isInquiryResolvable(journal, inquiry);
  const newlyUnlocked = lastDay?.newlyUnlocked ?? [];
  const drafted = lastDay?.draftedCount ?? 0;
  return `
    <div class="overlay fade-in">
      <div class="end-panel">
        <h2 class="end-panel__title">The day closes</h2>
        <p class="end-panel__subtitle">
          ${drafted} scroll${drafted === 1 ? '' : 's'} drafted${newlyUnlocked.length === 0 ? ' · no new fragments today' : ''}
        </p>
        ${renderUnlocks(newlyUnlocked)}
        <div class="end-panel__actions">
          <button type="button" class="btn btn--primary" data-action="continue-day">Continue</button>
          ${
            resolvable
              ? `<button type="button" class="btn btn--accent" data-action="commit-answer">Commit your answer</button>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

function renderUnlocks(fragments: Fragment[]): string {
  if (fragments.length === 0) {
    return `<p class="end-panel__none">You showed up. That was enough.</p>`;
  }
  const items = fragments
    .map((f) => `<li class="unlock">${esc(f.text)}</li>`)
    .join('');
  return `
    <div class="end-panel__unlocks">
      <h3 class="end-panel__unlocks-title">New in the journal</h3>
      <ul class="unlocks">${items}</ul>
    </div>
  `;
}

function renderJournal(journal: Journal): string {
  const sections = inquiries
    .map((inquiry) => renderJournalInquiry(inquiry, journal))
    .join('');
  const body =
    inquiries.length === 0
      ? `<p class="journal__empty">The journal has no inquiries yet.</p>`
      : sections;
  const draftedTotal = journal.draftedScrollIds.length;
  return `
    <div class="overlay overlay--full fade-in">
      <header class="overlay__header">
        <h2 class="overlay__title">Journal</h2>
        <button type="button" class="overlay__close" data-action="close-journal">Close</button>
      </header>
      <p class="journal__stats">
        Day ${journal.daysPlayed} · ${draftedTotal} scroll${draftedTotal === 1 ? '' : 's'} drafted in all
      </p>
      <div class="journal__list">${body}</div>
    </div>
  `;
}

function renderJournalInquiry(inquiry: Inquiry, journal: Journal): string {
  const resolved = journal.resolvedInquiries.includes(inquiry.id);
  const unlockedSet = new Set(journal.unlockedFragments);
  const fragments = inquiry.fragments.filter((f) => unlockedSet.has(f.id));
  return `
    <section class="journal-inquiry">
      <h3 class="journal-inquiry__question">
        ${esc(inquiry.question)}
        ${resolved ? `<span class="pill pill--resolved">Answered</span>` : ''}
      </h3>
      ${
        fragments.length === 0
          ? `<p class="journal-inquiry__empty">No fragments unlocked yet.</p>`
          : `<ul class="unlocks">${fragments.map((f) => `<li class="unlock">${esc(f.text)}</li>`).join('')}</ul>`
      }
    </section>
  `;
}

function renderCompleted(journal: Journal): string {
  return `
    <main class="state-screen fade-in">
      <h1 class="state-screen__title">The chronicle is whole</h1>
      <p class="state-screen__subtitle">
        Every inquiry has found its answer. ${journal.daysPlayed} day${journal.daysPlayed === 1 ? '' : 's'} of sitting at the desk.
      </p>
      <button type="button" class="btn btn--ghost" data-action="open-journal">Read the journal</button>
    </main>
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
