import { createDocument } from "./storage";

export interface SeedDocument {
  seedId: string;
  title: string;
  text: string;
}

export const SEED_DOCUMENTS: SeedDocument[] = [
  {
    seedId: "hormozi-closer-framework",
    title: "Hormozi's C.L.O.S.E.R. Sales Framework",
    text: `#### C — Clarify Why They're There
Hey [Name], nice to meet you.<br>
So tell me, what made you reach out today?<br>
What's your goal right now?<br>
Why is that important to you?<br>
That's awesome. So just so I make sure I understand...

#### L — Label the Problem
So it sounds like your goal is [restate goal].<br>
But right now you're dealing with [restate obstacle].<br>
And that's been keeping you from [desired outcome].<br>
Does that sound about right?<br>
Got it. And how long has this been going on?

#### O — Overview Past Pain
What have you tried so far to fix this?<br>
How long did you do that for?<br>
And how did that work out for you?<br>
What else have you tried?<br>
So if I'm hearing you right, you've tried [X, Y, Z]<br>
and none of it has really gotten you to where you want to be.

#### S — Sell the Vacation
I totally hear you. So let me paint a picture.<br>
Imagine 90 days from now<br>
you've hit [their specific goal].<br>
You're no longer dealing with [their pain].<br>
You wake up and [describe transformed life].<br>
That's what we help people do.<br>
We don't just give you [feature] —<br>
we get you to [outcome].

#### E — Explain Away Concerns
I totally understand. And that's a fair concern.<br>
Let me ask you this —<br>
if [concern] weren't an issue,<br>
would you want to move forward?<br>
The reason I ask is that<br>
most of our best clients felt the exact same way<br>
before they started.

#### R — Reinforce the Decision
You just made an awesome decision.<br>
Here's exactly what happens next.<br>
You're going to [first step].<br>
Then we'll [second step].<br>
I'm really excited for you<br>
because you're going to look back on today<br>
as the day everything changed.`,
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
  const currentSeedIds = new Set(SEED_DOCUMENTS.map((s) => s.seedId));

  // If old seeds were removed from the list, clear documents and re-seed
  const hasStaleSeeds = seeded.some((id) => !currentSeedIds.has(id));
  if (hasStaleSeeds) {
    localStorage.removeItem("memorize-documents");
    const freshSeeded: string[] = [];
    for (const seed of SEED_DOCUMENTS) {
      createDocument(seed.title, seed.text);
      freshSeeded.push(seed.seedId);
    }
    localStorage.setItem(SEEDED_KEY, JSON.stringify(freshSeeded));
    return;
  }

  for (const seed of SEED_DOCUMENTS) {
    if (!seeded.includes(seed.seedId)) {
      createDocument(seed.title, seed.text);
      seeded.push(seed.seedId);
    }
  }

  localStorage.setItem(SEEDED_KEY, JSON.stringify(seeded));
}
