import type { Inquiry } from '../model/index.ts';

export const inquiries: Inquiry[] = [
  {
    id: 'cave-mercy',
    question: 'Why did David spare Saul in the cave?',
    requiredScrollIds: ['cave-narrative', 'psalm-of-the-cave', 'cave-witness'],
    adjacencyBonus: ['cave-narrative', 'psalm-of-the-cave', 'cave-witness'],
    fragments: [
      {
        id: 'cave-fragment-voices',
        text: "Three voices reach David in the cave: the chronicler's pen, his own psalm, and his men's urgent counsel. Each says something true. He listens to all and chooses the anointing.",
        unlockedBy: {
          scrollIds: ['cave-narrative', 'psalm-of-the-cave', 'cave-witness'],
        },
      },
      {
        id: 'cave-fragment-anointing',
        text: "Saul is still the Lord's anointed, even while he hunts the next one. To honor the office while suffering the man — this is what kingship has cost David already, and what it will keep costing.",
        unlockedBy: {
          scrollIds: ['cave-narrative', 'psalm-of-the-cave', 'cave-witness'],
          requireAdjacency: true,
        },
      },
    ],
  },
  {
    id: 'goliath-seam',
    question: 'Did David really kill Goliath?',
    requiredScrollIds: ['david-and-giant', 'elhanan-roll', 'chronicler-lahmi'],
    adjacencyBonus: ['david-and-giant', 'elhanan-roll', 'chronicler-lahmi'],
    fragments: [
      {
        id: 'goliath-fragment-seam',
        text: "Two scrolls and a corrector: Samuel praises the shepherd, the Heroes' Roll praises Elhanan, Chronicles names a brother. Scripture preserves its own seam rather than smoothing it.",
        unlockedBy: {
          scrollIds: ['david-and-giant', 'elhanan-roll', 'chronicler-lahmi'],
        },
      },
      {
        id: 'goliath-fragment-witness',
        text: "Whether the spear-shaft fell to David or to Elhanan, the giant fell. The text is not embarrassed to remember twice and to clarify once — the whole canon is the witness, not the brightest verse.",
        unlockedBy: {
          scrollIds: ['david-and-giant', 'elhanan-roll', 'chronicler-lahmi'],
          requireAdjacency: true,
        },
      },
    ],
  },
  {
    id: 'bathsheba-line',
    question: "Why is Bathsheba named in Matthew's genealogy?",
    requiredScrollIds: [
      'rooftop',
      'psalm-penitence',
      'nathan-lamb',
      'matthew-genealogy',
    ],
    adjacencyBonus: [
      'rooftop',
      'psalm-penitence',
      'nathan-lamb',
      'matthew-genealogy',
    ],
    fragments: [
      {
        id: 'bathsheba-fragment-wound',
        text: "The genealogy of the Messiah does not edit the rooftop. It names her by the wound — 'her who had been the wife of Uriah' — and lets the marriage line carry the memory of the marriage that should not have ended.",
        unlockedBy: {
          scrollIds: [
            'rooftop',
            'psalm-penitence',
            'nathan-lamb',
            'matthew-genealogy',
          ],
        },
      },
      {
        id: 'bathsheba-fragment-grace',
        text: "Grace does not require amnesia. The bloodline of the kingdom passes through people who were wronged and people who did wrong — sometimes both inside one house, sometimes inside one king.",
        unlockedBy: {
          scrollIds: [
            'rooftop',
            'psalm-penitence',
            'nathan-lamb',
            'matthew-genealogy',
          ],
          requireAdjacency: true,
        },
      },
    ],
  },
];
