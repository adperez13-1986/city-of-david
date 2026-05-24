## ADDED Requirements

### Requirement: Starting a day initializes deck, offer, and desk
The system SHALL provide a `startDay` function that takes an inquiry id, the catalog of all scrolls, and an `Rng` callable, and returns a fresh `Day`. The returned day SHALL have full `DAY_STAMINA`, an empty 4-slot desk, an internal deck containing every scroll id from the catalog, and an `offered` array of `SCROLLS_OFFERED_PER_TURN` distinct scroll ids drawn at random from the deck.

#### Scenario: Fresh day has full stamina and empty desk
- **WHEN** `startDay(inquiryId, catalog, rng)` is called with a non-empty catalog
- **THEN** the returned day has `stamina === DAY_STAMINA`, every desk slot is `null`, and `offered.length === SCROLLS_OFFERED_PER_TURN`

#### Scenario: Offered scrolls are distinct
- **WHEN** `startDay` returns a day
- **THEN** every id in `offered` SHALL appear at most once

#### Scenario: Catalog smaller than offer size
- **WHEN** the catalog has fewer than `SCROLLS_OFFERED_PER_TURN` scrolls
- **THEN** `offered` SHALL contain every catalog scroll exactly once (no padding, no duplicates)

### Requirement: Placing a scroll deducts stamina and re-offers
The system SHALL provide a `playPlacement` function that takes a `Day`, a scroll id from `offered`, a slot index (0-3), a scroll lookup, and an `Rng`, and returns the resulting `Day`. Placement SHALL move the chosen scroll into the chosen empty slot, deduct that scroll's `staminaCost` from `stamina`, remove the chosen scroll from `offered` and from the deck, and refresh `offered` with a new sample of up to `SCROLLS_OFFERED_PER_TURN` distinct scroll ids from the remaining deck.

#### Scenario: Place into empty slot
- **WHEN** `playPlacement(day, scrollId, slotIndex, scrollMap, rng)` is called with a valid id in `offered` and an empty slot index
- **THEN** the returned day has the scroll in `desk[slotIndex]`, `stamina === day.stamina - scroll.staminaCost`, and `offered` no longer contains the placed scroll id

#### Scenario: Reject placement into occupied slot
- **WHEN** `playPlacement` is called targeting an already-occupied slot
- **THEN** the function SHALL throw with a message naming the slot index

#### Scenario: Reject placement of scroll not in offered
- **WHEN** the caller passes a scroll id that is not in `day.offered`
- **THEN** the function SHALL throw with a message naming the offending id

#### Scenario: New offer drawn from remaining deck
- **WHEN** a placement completes and the deck still has scrolls left
- **THEN** `offered` SHALL be refilled to `SCROLLS_OFFERED_PER_TURN` (or fewer if the deck is smaller) using distinct ids none of which is the just-placed scroll

### Requirement: Day-over detection
The system SHALL provide an `isDayOver` predicate that takes a `Day` and a scroll lookup and returns true when (a) every desk slot is filled, or (b) every offered scroll's `staminaCost` exceeds the remaining `stamina`, or (c) `offered` is empty (deck and offer are both exhausted).

#### Scenario: Desk full ends day
- **WHEN** all four desk slots are non-null
- **THEN** `isDayOver(day, scrollMap)` SHALL return `true`

#### Scenario: Stamina too low ends day
- **WHEN** `day.stamina < min(offered.staminaCost)` and the desk is not full
- **THEN** `isDayOver(day, scrollMap)` SHALL return `true`

#### Scenario: Empty deck and empty offer ends day
- **WHEN** the internal deck and `offered` are both empty
- **THEN** `isDayOver(day, scrollMap)` SHALL return `true`

#### Scenario: Mid-day false
- **WHEN** stamina remains, the desk is not full, and at least one offered scroll fits the stamina budget
- **THEN** `isDayOver(day, scrollMap)` SHALL return `false`

### Requirement: Ending a day reports the result
The system SHALL provide an `endDay` function that takes a finished `Day` and returns a `DayResult` containing the inquiry id, the final desk snapshot, the list of scroll ids that were drafted this day (in placement order), and the reason the day ended (`'desk-full' | 'stamina-depleted' | 'deck-exhausted'`).

#### Scenario: Result reports placement order
- **WHEN** scrolls were placed in slots 2, 0, 3 in that order during the day
- **THEN** the `DayResult.draftedScrollIds` SHALL list those ids in that order

#### Scenario: Reason reflects terminal condition
- **WHEN** `endDay` is called on a day where the desk became full
- **THEN** `DayResult.endReason === 'desk-full'`

### Requirement: Adjacency relation for the 2x2 desk
The system SHALL provide a `getAdjacentPairs` function that takes the desk (4 slots) and returns every pair of currently-occupied, edge-adjacent slot positions as `[ScrollId, ScrollId]` tuples in canonical (ascending slot index) order. Adjacency edges SHALL be exactly: (0,1), (0,2), (1,3), (2,3). Diagonals (0,3) and (1,2) SHALL NOT be adjacent.

#### Scenario: Two horizontal neighbours
- **WHEN** slots 0 and 1 hold scrolls and slots 2 and 3 are empty
- **THEN** `getAdjacentPairs(desk)` SHALL return `[[scroll0.id, scroll1.id]]`

#### Scenario: Diagonal not adjacent
- **WHEN** slots 0 and 3 hold scrolls and slots 1 and 2 are empty
- **THEN** `getAdjacentPairs(desk)` SHALL return `[]`

#### Scenario: Full desk yields four pairs
- **WHEN** all four slots are filled
- **THEN** `getAdjacentPairs(desk)` SHALL return exactly four pairs covering edges (0,1), (0,2), (1,3), (2,3)

### Requirement: RNG is an injected callable
The system SHALL define `type Rng = () => number` returning a uniform float in [0, 1) and SHALL accept an `Rng` argument in every function that introduces randomness. The system SHALL ALSO export a `defaultRng` backed by `Math.random` for production use.

#### Scenario: Default RNG returns a float in range
- **WHEN** `defaultRng()` is called
- **THEN** the result SHALL be a number `x` with `0 <= x < 1`

#### Scenario: Custom RNG yields deterministic offers
- **WHEN** the same seeded `Rng` is passed to `startDay` twice with the same catalog
- **THEN** the two returned days SHALL have identical `offered` arrays
