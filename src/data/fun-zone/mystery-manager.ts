export type Clue = {
  id: number;
  text: string;
};

export type Option = {
  id: string;
  text: string;
  revealText: string;
  isBest?: boolean;
};

export const STORY = "At Brightwave Studio, a small team was set to launch an app update on Friday. On Thursday evening, the launch was pushed back by a week. Ms. Arora, the project manager, needs to work out what actually went wrong.";

export const CLUES: Clue[] = [
  { id: 1, text: "Two weeks ago, the design team changed the layout of the checkout screen. The change was announced in a Tuesday stand-up meeting." },
  { id: 2, text: "Kabir, the developer, was on leave that Tuesday." },
  { id: 3, text: "The shared project board still shows the old checkout design. No update note or new file was added." },
  { id: 4, text: "Design, development, and testing all report finishing their assigned work on schedule." },
  { id: 5, text: "On Thursday evening, Tom in QA reported that the built checkout screen does not match the latest approved design." },
  { id: 6, text: "The launch date was set six weeks ago; the team agreed it was tight but doable." },
];

export const QUESTION = "Based on the clues, what most likely caused the delay?";

export const OPTIONS: Option[] = [
  { id: "A", text: "Kabir was careless and ignored the deadline.", revealText: "The clues don't support this. Clue 4 says all work was finished on schedule." },
  { id: "B", text: "A design change was communicated only in a meeting and never recorded, so it didn't reach everyone.", revealText: "Nicely reasoned.", isBest: true },
  { id: "C", text: "QA tested too late in the process.", revealText: "QA catching the mismatch is actually the safety net working. The root cause sits earlier in the process." },
  { id: "D", text: "The launch date was unrealistic from the start.", revealText: "Clue 6 says the team agreed the date was doable, and clue 4 shows work was on time, so the schedule wasn't the problem." },
];

export const FULL_EXPLANATION = "Clues 1-3 show the change lived only in a meeting Kabir missed, and the shared board was never updated. Clue 4 rules out carelessness or missed deadlines, and clue 6 weakens the 'unrealistic schedule' theory. The lesson isn't about blame: decisions that affect the whole team should be written down where everyone can see them.";
