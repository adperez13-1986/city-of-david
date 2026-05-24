# journal-persistence Specification

## Purpose
TBD - created by archiving change add-journal-persistence. Update Purpose after archive.
## Requirements
### Requirement: Empty journal factory
The system SHALL provide an `emptyJournal()` function returning a `Journal` with no unlocked fragments, no resolved inquiries, no drafted scrolls, and `daysPlayed === 0`.

#### Scenario: Empty journal is a frozen literal
- **WHEN** `emptyJournal()` is called
- **THEN** the result SHALL deep-equal `{ unlockedFragments: [], resolvedInquiries: [], draftedScrollIds: [], daysPlayed: 0 }`

### Requirement: Load journal from localStorage
The system SHALL provide a `loadJournal()` function that reads from a versioned localStorage key (`cityOfDavid:journal:v1`) and returns the parsed `Journal` if present and well-formed, or an empty journal otherwise.

#### Scenario: Key absent
- **WHEN** localStorage has no entry under the journal key
- **THEN** `loadJournal()` SHALL return `emptyJournal()` and SHALL NOT throw

#### Scenario: Key present and well-formed
- **WHEN** localStorage holds a JSON payload matching the `Journal` shape
- **THEN** `loadJournal()` SHALL return the parsed object

#### Scenario: Key present but corrupt
- **WHEN** localStorage holds malformed JSON or a payload missing required fields
- **THEN** `loadJournal()` SHALL return `emptyJournal()` and SHALL NOT throw

### Requirement: Save journal to localStorage
The system SHALL provide a `saveJournal(journal)` function that serialises the journal to JSON and writes it under the versioned key.

#### Scenario: Save then load round-trip
- **WHEN** `saveJournal(j)` is called and then `loadJournal()` is called
- **THEN** the loaded journal SHALL deep-equal `j`

#### Scenario: Save when storage quota is full
- **WHEN** localStorage throws on `setItem`
- **THEN** `saveJournal` SHALL re-throw the underlying error so the caller can react (e.g. show a toast); the journal SHALL remain valid in memory

### Requirement: Versioned key
The storage key SHALL include a version suffix so future schema migrations can introduce a new key without disturbing existing players' data.

#### Scenario: New version, fresh slate
- **WHEN** a future build of the app uses key `cityOfDavid:journal:v2` and the user previously had data under `:v1`
- **THEN** the new build SHALL start from `emptyJournal()` (this is the intended behaviour; explicit migration is out of scope for the prototype)

