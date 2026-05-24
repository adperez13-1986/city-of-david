## MODIFIED Requirements

### Requirement: Journal type SHALL persist cross-run knowledge
The system SHALL provide a `Journal` type aggregating everything that survives between runs: unlocked fragment ids, resolved inquiry ids, the union of every scroll the scribe has drafted across all runs, and the days-played counter.

#### Scenario: Empty journal on first run
- **WHEN** the player has never played a day
- **THEN** the journal SHALL be `{ unlockedFragments: [], resolvedInquiries: [], draftedScrollIds: [], daysPlayed: 0 }`

#### Scenario: Drafted scrolls accumulate across runs
- **WHEN** the player drafts scroll `A` on day 1 and scrolls `B` and `C` on day 2
- **THEN** at the end of day 2 the journal's `draftedScrollIds` SHALL contain `A`, `B`, and `C` exactly once each (order is undefined; duplicates are not added)
