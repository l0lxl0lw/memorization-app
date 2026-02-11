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
