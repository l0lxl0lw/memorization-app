import { getDocument, createDocument } from "./storage";

interface SeedDocument {
  seedId: string;
  title: string;
  text: string;
}

const SEED_DOCUMENTS: SeedDocument[] = [
  {
    seedId: "psalm-8-1-9-esv",
    title: "Psalm 8:1-9 (ESV)",
    text: `#### Part 1: God's Majestic Name (v. 1-2)
O Lord, our Lord,<br>
how majestic is your name in all the earth!<br>
You have set your glory above the heavens.<br>
Out of the mouth of babies and infants,<br>
you have established strength because of your foes,<br>
to still the enemy and the avenger.

#### Part 2: The Wonder of Man (v. 3-5)
When I look at your heavens,<br>
the work of your fingers,<br>
the moon and the stars,<br>
which you have set in place,<br>
what is man that you are mindful of him,<br>
and the son of man that you care for him?<br>
Yet you have made him a little lower than the heavenly beings<br>
and crowned him with glory and honor.

#### Part 3: Dominion Given (v. 6-8)
You have given him dominion over the works of your hands;<br>
you have put all things under his feet,<br>
all sheep and oxen,<br>
and also the beasts of the field,<br>
the birds of the heavens, and the fish of the sea,<br>
whatever passes along the paths of the seas.

#### Part 4: Closing Praise (v. 9)
O Lord, our Lord,<br>
how majestic is your name in all the earth!`,
  },
  {
    seedId: "james-1-2-8-niv",
    title: "James 1:2-8 (NIV)",
    text: `#### Part 1: Joy in Trials (v. 2-4)
Consider it pure joy,<br>
my brothers and sisters,<br>
whenever you face trials of many kinds,<br>
because you know<br>
that the testing of your faith<br>
produces perseverance.<br>
Let perseverance finish its work<br>
so that you may be mature and complete,<br>
not lacking anything.

#### Part 2: Ask for Wisdom (v. 5-6a)
If any of you lacks wisdom,<br>
you should ask God,<br>
who gives generously to all<br>
without finding fault,<br>
and it will be given to you.<br>
But when you ask,<br>
you must believe and not doubt,

#### Part 3: The Doubter (v. 6b-8)
because the one who doubts<br>
is like a wave of the sea,<br>
blown and tossed by the wind.<br>
That person should not expect<br>
to receive anything from the Lord.<br>
Such a person is double-minded<br>
and unstable in all they do.`,
  },
];

const SEEDED_KEY = "memorize-seeded";

export function seedIfNeeded() {
  if (typeof window === "undefined") return;

  const seeded: string[] = JSON.parse(localStorage.getItem(SEEDED_KEY) || "[]");

  for (const seed of SEED_DOCUMENTS) {
    if (!seeded.includes(seed.seedId)) {
      createDocument(seed.title, seed.text);
      seeded.push(seed.seedId);
    }
  }

  localStorage.setItem(SEEDED_KEY, JSON.stringify(seeded));
}
