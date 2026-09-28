export type Option = {
  id: string;
  text: string;
  explanation: string;
};

export type Situation = {
  id: number;
  situation: string;
  options: Option[];
};

export const SITUATIONS: Situation[] = [
  {
    id: 1,
    situation: "Orders for your product have suddenly doubled this week and your team can't keep up.",
    options: [
      { id: "A", text: "Ask the current team for overtime.", explanation: "Meets demand fast using people who already know the work, but risks burnout and rising errors if it continues." },
      { id: "B", text: "Bring in temporary extra help.", explanation: "Adds capacity without overloading the team, but takes time to onboard, adds cost, and quality may vary." },
      { id: "C", text: "Prioritise key customers and be honest with others about longer waits.", explanation: "Protects important relationships and is transparent, but some customers may be disappointed and go elsewhere." },
    ]
  },
  {
    id: 2,
    situation: "A key teammate says they'll miss tomorrow's deadline, and others depend on their part.",
    options: [
      { id: "A", text: "Ask what's blocking them and offer help today.", explanation: "Fast, supportive, and may fix the real issue, but uses your time and the deadline may still slip." },
      { id: "B", text: "Reshuffle tasks among other teammates right now.", explanation: "Protects the schedule, but overloads others and can hurt the original owner's ownership." },
      { id: "C", text: "Tell the client the deadline will slip and propose a new date.", explanation: "Honest and manages expectations early, but may cost some trust and puts the timeline on the record." },
    ]
  },
  {
    id: 3,
    situation: "Your budget was cut by 30% halfway through a project.",
    options: [
      { id: "A", text: "Cut lower-priority features to protect the core.", explanation: "Keeps quality where it matters most, but the final product does less than originally planned." },
      { id: "B", text: "Keep the full scope and negotiate for more time.", explanation: "Preserves ambition, but the extra time has its own costs and may not be granted." },
      { id: "C", text: "Look for cheaper tools or suppliers for the same scope.", explanation: "Might save money without cutting scope, but switching takes effort and risks quality." },
    ]
  },
  {
    id: 4,
    situation: "Two teammates disagree about the project's direction in a live meeting, and the discussion is going in circles.",
    options: [
      { id: "A", text: "Pause and ask each to explain their reasoning, then look for shared goals.", explanation: "Builds understanding and often finds common ground, but takes meeting time." },
      { id: "B", text: "Propose a quick small test of both ideas.", explanation: "Replaces opinion with evidence, but the test needs time and resources." },
      { id: "C", text: "Make the call as leader and move on.", explanation: "Fast and unblocks the group, but may leave people feeling unheard." },
    ]
  }
];
