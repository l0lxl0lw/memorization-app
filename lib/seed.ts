import { createDocument } from "./storage";

export interface SeedDocument {
  seedId: string;
  title: string;
  text: string;
}

export const SEED_DOCUMENTS: SeedDocument[] = [
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
  {
    seedId: "romans-8-28-39-niv",
    title: "Romans 8:28-39 (NIV)",
    text: `#### Part 1: God's Purpose (v. 28-30)
And we know that in all things<br>
God works for the good<br>
of those who love him,<br>
who have been called according to his purpose.<br>
For those God foreknew<br>
he also predestined<br>
to be conformed to the image of his Son,<br>
that he might be the firstborn<br>
among many brothers and sisters.<br>
And those he predestined, he also called;<br>
those he called, he also justified;<br>
those he justified, he also glorified.

#### Part 2: God Is for Us (v. 31-34)
What, then, shall we say in response to these things?<br>
If God is for us, who can be against us?<br>
He who did not spare his own Son,<br>
but gave him up for us all—<br>
how will he not also, along with him,<br>
graciously give us all things?<br>
Who will bring any charge<br>
against those whom God has chosen?<br>
It is God who justifies.<br>
Who then is the one who condemns?<br>
No one.<br>
Christ Jesus who died—<br>
more than that, who was raised to life—<br>
is at the right hand of God<br>
and is also interceding for us.

#### Part 3: Nothing Can Separate Us (v. 35-37)
Who shall separate us from the love of Christ?<br>
Shall trouble or hardship<br>
or persecution or famine<br>
or nakedness or danger or sword?<br>
As it is written:<br>
"For your sake we face death all day long;<br>
we are considered as sheep to be slaughtered."<br>
No, in all these things<br>
we are more than conquerors<br>
through him who loved us.

#### Part 4: The Unbreakable Love (v. 38-39)
For I am convinced<br>
that neither death nor life,<br>
neither angels nor demons,<br>
neither the present nor the future,<br>
nor any powers,<br>
neither height nor depth,<br>
nor anything else in all creation,<br>
will be able to separate us<br>
from the love of God<br>
that is in Christ Jesus our Lord.`,
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
