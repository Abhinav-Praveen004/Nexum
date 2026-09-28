export type Option = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  category: string;
  question: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
};

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: "Q1",
    category: "Teamwork",
    question: "In Tuckman's well-known model of team development, which stage comes right after 'storming'?",
    options: [
      { id: "A", text: "Forming" },
      { id: "B", text: "Norming" },
      { id: "C", text: "Performing" },
      { id: "D", text: "Adjourning" },
    ],
    correctOptionId: "B",
    explanation: "The stages run forming, storming, norming, performing (adjourning was added later). After conflicts surface in storming, the team settles into shared ways of working in norming."
  },
  {
    id: "Q2",
    category: "Communication",
    question: "Which of these is an example of active listening?",
    options: [
      { id: "A", text: "Checking your messages while they talk" },
      { id: "B", text: "Preparing your reply while they're still speaking" },
      { id: "C", text: "Finishing their sentences for them" },
      { id: "D", text: "Paraphrasing what you heard to confirm you understood" },
    ],
    correctOptionId: "D",
    explanation: "Paraphrasing shows you're processing what was said and lets the speaker correct any misunderstanding."
  },
  {
    id: "Q3",
    category: "Leadership",
    question: "In the most commonly used version of SMART goals, what does the 'M' stand for?",
    options: [
      { id: "A", text: "Motivating" },
      { id: "B", text: "Manageable" },
      { id: "C", text: "Measurable" },
      { id: "D", text: "Meaningful" },
    ],
    correctOptionId: "C",
    explanation: "A goal is easier to track and achieve when you can measure progress towards it."
  },
  {
    id: "Q4",
    category: "Creativity",
    question: "In the early stage of a brainstorming session, what works best?",
    options: [
      { id: "A", text: "Generating many ideas without judging them yet" },
      { id: "B", text: "Criticising each idea as soon as it's shared" },
      { id: "C", text: "Picking the first workable idea and refining it" },
      { id: "D", text: "Letting only the most senior people speak" },
    ],
    correctOptionId: "A",
    explanation: "Deferring judgment encourages quantity and variety. Evaluating comes later."
  },
  {
    id: "Q5",
    category: "Leadership",
    question: "Effective delegation mainly involves...",
    options: [
      { id: "A", text: "Handing off tasks and never checking in" },
      { id: "B", text: "Giving clear expectations, the authority to act, and appropriate support" },
      { id: "C", text: "Only handing over tasks you dislike" },
      { id: "D", text: "Only delegating to the most experienced person" },
    ],
    correctOptionId: "B",
    explanation: "Delegation works when people know what's expected, can act on it, and can ask for help."
  },
  {
    id: "Q6",
    category: "Communication",
    question: "A teammate is very quiet in meetings. What's a sensible first step?",
    options: [
      { id: "A", text: "Assume they have nothing to add" },
      { id: "B", text: "Call them out in front of the group" },
      { id: "C", text: "Invite their input directly and create space for them to share, perhaps also checking in one-on-one" },
      { id: "D", text: "Stop holding meetings" },
    ],
    correctOptionId: "C",
    explanation: "Quiet doesn't mean disengaged. Making room, and asking in a low-pressure way, helps everyone contribute."
  },
  {
    id: "Q7",
    category: "Management",
    question: "The Pareto principle (the '80/20 rule') suggests that...",
    options: [
      { id: "A", text: "Meetings should be 80% shorter" },
      { id: "B", text: "Work should be 80% planning and 20% doing" },
      { id: "C", text: "20% of a team should do 80% of the work" },
      { id: "D", text: "Roughly 80% of effects often come from 20% of causes" },
    ],
    correctOptionId: "D",
    explanation: "It's a rule of thumb: a small share of causes (customers, tasks, bugs) often drives most of the results, which helps with prioritising."
  },
  {
    id: "Q8",
    category: "Teamwork",
    question: "'Psychological safety' in a team means...",
    options: [
      { id: "A", text: "People feel safe to speak up, ask questions, and admit mistakes without fear of embarrassment or punishment" },
      { id: "B", text: "Nobody ever disagrees" },
      { id: "C", text: "The office has good physical security" },
      { id: "D", text: "Leaders never give feedback" },
    ],
    correctOptionId: "A",
    explanation: "Popularised by researcher Amy Edmondson, it's linked to teams that learn faster because people raise issues early."
  }
];
