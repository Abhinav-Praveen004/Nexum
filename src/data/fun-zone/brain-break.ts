export type Puzzle = {
  id: string;
  question: string;
  options: string[];
  correctOption: string;
  explanation: string;
};

export type Category = {
  id: string;
  name: string;
  puzzles: Puzzle[];
  isMemory?: boolean; // Memory is a special interactive game type
};

export const CATEGORIES: Category[] = [
  {
    id: "logic",
    name: "Logic",
    puzzles: [
      {
        id: "L1",
        question: "Three boxes are labelled Apples, Oranges, and Mixed. Every label is wrong. You take one fruit from the box labelled 'Mixed' and it's an apple. What is in the box labelled 'Oranges'?",
        options: ["Apples", "Oranges", "Mixed", "Can't be determined"],
        correctOption: "Mixed",
        explanation: "The 'Mixed' box can't be mixed, so it holds only apples. The 'Apples' box can't hold apples, and the 'Oranges' box can't hold oranges, so the 'Oranges' box must be the mixed one."
      },
      {
        id: "L2",
        question: "Ravi, Sara, and Leo have three different jobs: designer, developer, tester. Ravi is not the designer. Sara is neither the developer nor the tester. Leo is not the developer. Who is the developer?",
        options: ["Ravi", "Sara", "Leo"],
        correctOption: "Ravi",
        explanation: "Sara can't be developer or tester, so she's the designer. Leo isn't the developer, so he's the tester, leaving Ravi as the developer."
      }
    ]
  },
  {
    id: "pattern",
    name: "Pattern Recognition",
    puzzles: [
      {
        id: "P1",
        question: "What comes next? 2, 6, 12, 20, 30, ?",
        options: ["36", "40", "42", "44"],
        correctOption: "42",
        explanation: "The gaps grow by 2 each time: +4, +6, +8, +10, so the next gap is +12 and 30 + 12 = 42."
      },
      {
        id: "P2",
        question: "What comes next? A, C, F, J, O, ?",
        options: ["S", "T", "U", "V"],
        correctOption: "U",
        explanation: "The letter positions jump by 2, 3, 4, 5, so the next jump is 6: O (15) + 6 = U (21)."
      }
    ]
  },
  {
    id: "memory",
    name: "Memory",
    isMemory: true,
    puzzles: [] // Handled by a specialized component
  },
  {
    id: "reasoning",
    name: "Reasoning",
    puzzles: [
      {
        id: "R1",
        question: "A notebook and a pen cost ₹110 in total. The notebook costs ₹100 more than the pen. How much does the pen cost?",
        options: ["₹1", "₹5", "₹10", "₹15"],
        correctOption: "₹5",
        explanation: "Pen = ₹5, notebook = ₹105: total ₹110 and a ₹100 difference. The tempting answer of ₹10 would make the difference only ₹90."
      },
      {
        id: "R2",
        question: "If 5 machines take 5 minutes to make 5 widgets, how long would 100 machines take to make 100 widgets?",
        options: ["1 minute", "5 minutes", "20 minutes", "100 minutes"],
        correctOption: "5 minutes",
        explanation: "Each machine makes one widget in 5 minutes, so 100 machines make 100 widgets in the same 5 minutes."
      }
    ]
  }
];
