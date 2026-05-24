# inquiry-resolution Specification

## Purpose
TBD - created by archiving change add-inquiry-resolution. Update Purpose after archive.
## Requirements
### Requirement: Resolve a finished day into a new journal
The system SHALL provide a `resolveDay(journal, dayResult, inquiry)` function returning `{ journal: Journal; newlyUnlocked: Fragment[] }`. The new journal SHALL:

- include every scroll id from `dayResult.draftedScrollIds` in `draftedScrollIds` (deduplicated against the prior set),
- include every newly unlocked fragment id in `unlockedFragments` (deduplicated),
- increment `daysPlayed` by 1,
- leave `resolvedInquiries` unchanged (player commits resolution separately).

#### Scenario: Drafted scrolls accumulate
- **WHEN** the prior journal has `draftedScrollIds: ['a']` and the day's `draftedScrollIds: ['b', 'a', 'c']`
- **THEN** the resolved journal's `draftedScrollIds` SHALL be `['a', 'b', 'c']` (any order, no duplicates)

#### Scenario: daysPlayed increments
- **WHEN** the prior journal has `daysPlayed: 3`
- **THEN** the resolved journal has `daysPlayed: 4`

#### Scenario: Already-unlocked fragments are not duplicated
- **WHEN** a fragment's id is already in `journal.unlockedFragments` and its unlock conditions are met again
- **THEN** `unlockedFragments` SHALL contain that id exactly once and `newlyUnlocked` SHALL NOT include it

### Requirement: Non-adjacency fragments unlock against cumulative drafts
The system SHALL treat a fragment with no `requireAdjacency` (or `requireAdjacency === false`) as unlocked when every scroll id in `unlockedBy.scrollIds` appears in the resolved journal's `draftedScrollIds` (i.e. across all runs, including this one).

#### Scenario: Cross-run unlock
- **WHEN** scroll `a` was drafted on day 1 and scroll `b` is drafted on day 2, and a fragment requires `[a, b]` without adjacency
- **THEN** that fragment SHALL be in `newlyUnlocked` after `resolveDay` on day 2

#### Scenario: Insufficient drafts
- **WHEN** a fragment requires `[a, b, c]` and only `[a, b]` have ever been drafted
- **THEN** that fragment SHALL NOT be in `newlyUnlocked`

### Requirement: Adjacency fragments unlock only when scrolls are connected on the desk today
The system SHALL treat a fragment with `requireAdjacency === true` as unlocked only when every scroll id in `unlockedBy.scrollIds` is currently placed on `dayResult.finalDesk` AND the occupied positions for those scrolls form a connected subgraph under `DESK_EDGES` (i.e. starting from any one of them, every other is reachable through edge-adjacent occupied slots).

#### Scenario: Two adjacent scrolls
- **WHEN** scrolls `a` and `b` are on slots 0 and 1 and the fragment requires `[a, b]` with adjacency
- **THEN** the fragment SHALL unlock

#### Scenario: Two diagonal scrolls
- **WHEN** scrolls `a` and `b` are on slots 0 and 3 (diagonal) and the fragment requires `[a, b]` with adjacency
- **THEN** the fragment SHALL NOT unlock

#### Scenario: Three scrolls in an L
- **WHEN** scrolls `a`, `b`, `c` are placed in slots 0, 1, 2 (an L through slot 0) and the fragment requires `[a, b, c]` with adjacency
- **THEN** the fragment SHALL unlock (all three connected through slot 0)

#### Scenario: One required scroll missing from desk
- **WHEN** the fragment requires `[a, b]` with adjacency but only `a` is on the desk at end-of-day
- **THEN** the fragment SHALL NOT unlock

### Requirement: Inquiry resolvability
The system SHALL provide an `isInquiryResolvable(journal, inquiry)` predicate that returns `true` when every fragment in `inquiry.fragments` whose `unlockedBy.requireAdjacency` is false or undefined has its id in `journal.unlockedFragments`. Adjacency-bonus fragments SHALL NOT be required for resolution; they enrich the answer the scribe writes.

#### Scenario: All core fragments unlocked
- **WHEN** every non-adjacency fragment of the inquiry is in `journal.unlockedFragments`
- **THEN** `isInquiryResolvable(journal, inquiry) === true`

#### Scenario: Adjacency bonus not required
- **WHEN** every non-adjacency fragment is unlocked but the adjacency-bonus fragment is not
- **THEN** `isInquiryResolvable(journal, inquiry) === true`

#### Scenario: One core fragment missing
- **WHEN** one non-adjacency fragment of the inquiry is not in `unlockedFragments`
- **THEN** `isInquiryResolvable(journal, inquiry) === false`

