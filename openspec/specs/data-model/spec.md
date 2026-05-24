# data-model Specification

## Purpose
TBD - created by archiving change add-core-data-model. Update Purpose after archive.
## Requirements
### Requirement: Scroll type SHALL describe an archival source
The system SHALL provide a `Scroll` type capturing one biblical text fragment the scribe can draft into a day. A scroll SHALL carry an id, a title, a citation reference, a paraphrased text excerpt, a tag list, and a stamina cost.

#### Scenario: Scroll is well-formed
- **WHEN** a scroll is authored as plain data
- **THEN** it SHALL include `id` (string, unique), `title` (string), `reference` (e.g. "1 Samuel 24:1-22"), `textExcerpt` (string, the paraphrased summary plus any quoted material), `tags` (string[]), and `staminaCost` (integer ≥ 1)

#### Scenario: Quoted material in textExcerpt
- **WHEN** a scroll's textExcerpt includes direct biblical quotation
- **THEN** the quoted portion SHALL be under 15 words and SHALL come from a public domain translation (WEB by default)

### Requirement: Fragment type SHALL describe a journal insight
The system SHALL provide a `Fragment` type representing an unlockable insight written into the journal. A fragment SHALL carry an id, text, and an unlock predicate referencing the scrolls that produce it.

#### Scenario: Fragment unlocks by scroll set
- **WHEN** a fragment's `unlockedBy.scrollIds` are all drafted (with `requireAdjacency` honored if present)
- **THEN** the fragment SHALL be eligible to be written into the journal

### Requirement: Inquiry type SHALL describe a thread of inquiry
The system SHALL provide an `Inquiry` type representing one open question the scribe is investigating across runs. An inquiry SHALL carry an id, a question, an ordered list of required scroll ids, an optional adjacency bonus scroll set, a list of associated fragments, and a resolved flag.

#### Scenario: Inquiry can be resolved
- **WHEN** the union of unlocked fragments contains every fragment whose `unlockedBy.scrollIds` are a subset of the inquiry's `requiredScrollIds`
- **THEN** the inquiry SHALL be resolvable (the player may commit an answer)

### Requirement: Journal type SHALL persist cross-run knowledge
The system SHALL provide a `Journal` type aggregating everything that survives between runs: unlocked fragment ids, resolved inquiry ids, and the days-played counter.

#### Scenario: Empty journal on first run
- **WHEN** the player has never played a day
- **THEN** the journal SHALL be `{ unlockedFragments: [], resolvedInquiries: [], daysPlayed: 0 }`

### Requirement: Day type SHALL describe per-run scope
The system SHALL provide a `Day` type representing the transient state of a single run: the active inquiry, current stamina, the deck of remaining scroll ids, the three currently offered scrolls, and the desk's four slots.

#### Scenario: Day begins with full stamina
- **WHEN** a new day starts
- **THEN** `stamina` SHALL equal `DAY_STAMINA` and `desk` SHALL be four empty slots

### Requirement: Tunable constants SHALL be co-located with types
The system SHALL expose tunable game numbers as named constants so balance changes do not require touching gameplay code. The constants SHALL include at minimum `DAY_STAMINA` (default 6), `DESK_SLOT_COUNT` (default 4), and `SCROLLS_OFFERED_PER_TURN` (default 3).

#### Scenario: Constant is the single source of truth
- **WHEN** any consumer needs a stamina or slot count
- **THEN** it SHALL read from the named constant rather than a literal

