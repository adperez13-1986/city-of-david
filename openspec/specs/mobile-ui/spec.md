# mobile-ui Specification

## Purpose
TBD - created by archiving change add-mobile-ui-shell. Update Purpose after archive.
## Requirements
### Requirement: Boot sequence
The system SHALL on first load: read the journal from storage, pick the first inquiry whose id is not in `journal.resolvedInquiries`, call `startDay` to produce a Day, set the screen to `'play'`. If there is no unresolved inquiry, set the screen to `'completed'`. If there is no content at all, set the screen to `'empty-archive'`.

#### Scenario: First-time player
- **WHEN** the user opens the app for the first time with content authored
- **THEN** the screen SHALL be `'play'` with stamina at `DAY_STAMINA`, the first inquiry's question visible, and three offered scrolls rendered

#### Scenario: Returning player mid-progress
- **WHEN** the user has previously resolved inquiry #1 and the journal records that
- **THEN** the boot SHALL skip inquiry #1 and start a day on inquiry #2

#### Scenario: All inquiries resolved
- **WHEN** every inquiry id is in `journal.resolvedInquiries`
- **THEN** the screen SHALL be `'completed'` with no day in progress

#### Scenario: Empty archive
- **WHEN** the bundled content exports zero scrolls and zero inquiries
- **THEN** the screen SHALL be `'empty-archive'` and the app SHALL NOT crash

### Requirement: Play screen layout
The play screen SHALL be laid out top-to-bottom in portrait, fitting a 380-420px wide viewport: an inquiry-and-stamina topbar, a vertical offer column with three scroll cards, and a 2x2 desk grid anchored to the bottom inside the thumb arc. A journal-open button SHALL be visible in the topbar.

#### Scenario: Topbar contents
- **WHEN** the play screen renders
- **THEN** the topbar SHALL show the current inquiry's `question`, a stamina indicator showing remaining vs `DAY_STAMINA`, the day number (from `journal.daysPlayed + 1`), and a tap target labelled "Journal"

#### Scenario: Offer column
- **WHEN** the play screen renders with `n` offered scrolls (1-3)
- **THEN** the middle section SHALL render `n` scroll cards in a vertical stack, each showing title, reference, stamina cost, and the first ~80 characters of the text excerpt

#### Scenario: Desk at the bottom
- **WHEN** the play screen renders
- **THEN** the desk SHALL be a 2x2 grid at the bottom of the viewport, each slot occupying a square cell, with empty slots visually distinct from filled slots

### Requirement: Tap-scroll-then-tap-slot interaction
The interaction model SHALL be two taps: first tap a scroll in the offer to "select" it (highlighted), second tap an empty desk slot to place it. Tapping a selected scroll again SHALL deselect it. Tapping a different scroll while one is selected SHALL change the selection.

#### Scenario: Place a scroll
- **WHEN** the user taps scroll A, then taps empty slot 1
- **THEN** scroll A SHALL be in slot 1, stamina SHALL drop by A's `staminaCost`, the offer SHALL refresh, and selection SHALL clear

#### Scenario: Deselect
- **WHEN** the user taps scroll A, then taps scroll A again
- **THEN** no placement SHALL occur and selection SHALL clear

#### Scenario: Change selection
- **WHEN** the user taps scroll A, then taps scroll B (still in the offer)
- **THEN** the selection SHALL switch to B with no placement

#### Scenario: Tap occupied slot
- **WHEN** a scroll is selected and the user taps an already-occupied slot
- **THEN** no placement SHALL occur and selection SHALL remain

### Requirement: End-of-day flow
When the engine reports the day is over, the system SHALL: call `endDay`, call `resolveDay` against the current journal and inquiry, call `saveJournal` with the resulting journal, transition the screen to `'end-of-day'`, and show a panel listing the scrolls drafted today and any fragments newly unlocked.

#### Scenario: End-of-day summary
- **WHEN** the day ends with two newly unlocked fragments
- **THEN** the end-of-day panel SHALL list both fragments by their `text`, and SHALL include a "Continue" tap target

#### Scenario: Continue starts next day
- **WHEN** the player taps "Continue" on the end-of-day panel and the current inquiry is not yet resolvable
- **THEN** the system SHALL call `startDay` for the same inquiry and return the screen to `'play'`

#### Scenario: Continue offers resolution
- **WHEN** the player taps "Continue" on the end-of-day panel and `isInquiryResolvable` returns true for the current inquiry
- **THEN** the system SHALL show a "Commit your answer" tap target; tapping it SHALL add the inquiry id to `journal.resolvedInquiries`, save, and either start a day on the next unresolved inquiry or transition to `'completed'`

### Requirement: Journal overlay
The system SHALL provide a full-screen journal overlay reachable from the play screen. The overlay SHALL list every unlocked fragment by its `text`, grouped under their parent inquiry's `question`, with resolved inquiries marked clearly.

#### Scenario: Open journal
- **WHEN** the user taps the "Journal" button in the topbar
- **THEN** the overlay SHALL appear and the play screen SHALL be visually replaced (the day's state is preserved underneath)

#### Scenario: Close journal
- **WHEN** the user taps the close affordance on the overlay
- **THEN** the overlay SHALL dismiss and the previous screen SHALL be visible

### Requirement: Visual style
The shell SHALL use the parchment palette already defined in `src/style.css` (warm off-white background, dark serif text, restrained red/gold accent). Animations SHALL be limited to opacity fades (≤ 250 ms) for screen transitions; no transforms, no movement-heavy effects.

#### Scenario: Card hover/active state is restrained
- **WHEN** a scroll card is in the selected state
- **THEN** the visual change SHALL be a border / inner-glow effect using the accent color, not a transform or scale

### Requirement: Empty archive screen
When the bundled content has no scrolls or no inquiries, the play screen SHALL NOT render. Instead an empty-archive screen SHALL show a calm message indicating the archive is being prepared.

#### Scenario: Empty archive copy
- **WHEN** scrolls or inquiries are empty
- **THEN** the screen SHALL display a serif heading and a one-sentence subhead, both in the parchment palette

