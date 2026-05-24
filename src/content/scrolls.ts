import type { Scroll } from '../model/index.ts';

export const scrolls: Scroll[] = [
  // ----- Inquiry 1: cave -----
  {
    id: 'cave-narrative',
    title: 'Samuel — The Cave at En-Gedi',
    reference: '1 Samuel 24:1-22',
    textExcerpt:
      "Saul enters the cave alone. David's men whisper of providence. David cuts the king's robe and then his own heart aches — \"for he is Yahweh's anointed.\" (24:6)",
    tags: ['saul', 'cave', 'mercy', 'anointed', 'samuel'],
    staminaCost: 2,
  },
  {
    id: 'psalm-of-the-cave',
    title: 'A Psalm in the Shadow',
    reference: 'Psalm 57 (superscription)',
    textExcerpt:
      "Composed when he fled from Saul into the cave. \"In the shadow of your wings I will take refuge.\" (57:1) A song of mercy from inside the danger.",
    tags: ['david', 'psalm', 'cave', 'refuge', 'mercy'],
    staminaCost: 1,
  },
  {
    id: 'cave-witness',
    title: 'Voice from the Inner Cave',
    reference: '1 Samuel 24:4 (witness)',
    textExcerpt:
      "David's men name the day Yahweh's: \"Behold, the day.\" The enemy delivered, the sword ready. The voice is not wrong. David refuses anyway.",
    tags: ['witness', 'cave', 'saul', 'vengeance', 'men'],
    staminaCost: 1,
  },

  // ----- Inquiry 2: Goliath -----
  {
    id: 'david-and-giant',
    title: 'Samuel — David and the Giant',
    reference: '1 Samuel 17:48-50',
    textExcerpt:
      "The shepherd runs at the line. One stone from the brook strikes the Philistine's forehead, and the giant falls face-down.",
    tags: ['david', 'goliath', 'shepherd', 'stone', 'giant'],
    staminaCost: 2,
  },
  {
    id: 'elhanan-roll',
    title: "The Heroes' Roll — Elhanan",
    reference: '2 Samuel 21:19',
    textExcerpt:
      "Among David's mighty men: \"Elhanan… struck down Goliath the Gittite, his spear like a weaver's beam.\" (21:19)",
    tags: ['elhanan', 'goliath', 'mighty', 'contradiction'],
    staminaCost: 1,
  },
  {
    id: 'chronicler-lahmi',
    title: "The Chronicler's Correction",
    reference: '1 Chronicles 20:5',
    textExcerpt:
      "Where Samuel says Goliath, Chronicles says Lahmi — \"the brother of Goliath the Gittite.\" (20:5) The same weaver's beam; a different name.",
    tags: ['chronicles', 'lahmi', 'goliath', 'correction'],
    staminaCost: 1,
  },

  // ----- Inquiry 3: Bathsheba -----
  {
    id: 'rooftop',
    title: 'Samuel — The Rooftop and the Letter',
    reference: '2 Samuel 11:1-27',
    textExcerpt:
      "David sees, sends, takes. Uriah dies by a Philistine sword that David's own letter directed. The writer adds: \"the thing David had done displeased Yahweh.\" (11:27)",
    tags: ['bathsheba', 'david', 'uriah', 'sin', 'rooftop'],
    staminaCost: 2,
  },
  {
    id: 'psalm-penitence',
    title: 'Psalm of Penitence',
    reference: 'Psalm 51 (superscription)',
    textExcerpt:
      "After Nathan came to him. \"Have mercy on me, God, according to your loving kindness.\" (51:1) The king on his face.",
    tags: ['david', 'psalm', 'repentance', 'mercy', 'nathan'],
    staminaCost: 1,
  },
  {
    id: 'nathan-lamb',
    title: "Nathan — The Poor Man's Lamb",
    reference: '2 Samuel 12:1-15',
    textExcerpt:
      "Nathan tells of a rich man who took a poor man's only lamb. David's anger burns. Nathan answers: \"You are the man!\" (12:7)",
    tags: ['nathan', 'parable', 'lamb', 'rebuke'],
    staminaCost: 1,
  },
  {
    id: 'matthew-genealogy',
    title: 'Matthew — Her of Uriah',
    reference: 'Matthew 1:6',
    textExcerpt:
      "In the line of Jesse and David: \"…the father of Solomon by her who had been the wife of Uriah.\" (Matt 1:6) She is named by what was taken from her.",
    tags: ['matthew', 'genealogy', 'bathsheba', 'uriah', 'messiah'],
    staminaCost: 2,
  },

  // ----- Filler / texture -----
  {
    id: 'anointing-bethlehem',
    title: 'Samuel — The Anointing at Bethlehem',
    reference: '1 Samuel 16:1-13',
    textExcerpt:
      'Samuel passes over seven brothers. The eighth, ruddy and bright-eyed, comes in from the sheep. The oil is poured.',
    tags: ['samuel', 'anointing', 'bethlehem', 'shepherd', 'calling'],
    staminaCost: 2,
  },
  {
    id: 'three-mighty',
    title: 'The Three Mighty Men',
    reference: '2 Samuel 23:13-17',
    textExcerpt:
      "Three break through enemy lines for water from Bethlehem's well. David refuses to drink and pours it out to Yahweh.",
    tags: ['mighty', 'loyalty', 'water', 'bethlehem'],
    staminaCost: 2,
  },
  {
    id: 'roll-of-thirty',
    title: 'The Roll of the Thirty',
    reference: '2 Samuel 23:24-39',
    textExcerpt:
      "A list of David's warriors — captains, archers, foreigners — ending with \"Uriah the Hittite.\" (23:39) The roll does not flinch.",
    tags: ['mighty', 'uriah', 'roll', 'warriors'],
    staminaCost: 1,
  },
  {
    id: 'shepherd-psalm',
    title: 'Psalm of the Shepherd',
    reference: 'Psalm 23',
    textExcerpt:
      "\"Yahweh is my shepherd; I shall lack nothing.\" (23:1) The song the boy carries from the fields.",
    tags: ['david', 'psalm', 'shepherd', 'trust'],
    staminaCost: 1,
  },
  {
    id: 'ark-comes-home',
    title: 'The Ark Comes Home',
    reference: '2 Samuel 6',
    textExcerpt:
      'David dances before the ark with all his might. Michal watches from a window and despises him.',
    tags: ['ark', 'jerusalem', 'michal', 'worship'],
    staminaCost: 2,
  },
  {
    id: 'jonathan-covenant',
    title: "Jonathan's Covenant",
    reference: '1 Samuel 18:1-4',
    textExcerpt:
      "Jonathan loves David as his own soul. He strips off his robe and gives it — sword, bow, belt, the prince's gift.",
    tags: ['jonathan', 'friendship', 'covenant', 'saul-house'],
    staminaCost: 1,
  },
  {
    id: 'census-and-altar',
    title: 'The Census and the Altar',
    reference: '2 Samuel 24',
    textExcerpt:
      "David numbers the people. The plague comes. He buys the threshing floor and builds an altar — \"I will not offer what costs me nothing.\" (24:24)",
    tags: ['census', 'plague', 'altar', 'repentance'],
    staminaCost: 2,
  },
  {
    id: 'hymn-of-deliverance',
    title: 'Hymn of Deliverance',
    reference: '2 Samuel 22 / Psalm 18',
    textExcerpt:
      "\"The cords of death surrounded me.\" (22:5) David's battle-life carried into song, sung after Yahweh delivered him.",
    tags: ['psalm', 'deliverance', 'battle'],
    staminaCost: 1,
  },
];
