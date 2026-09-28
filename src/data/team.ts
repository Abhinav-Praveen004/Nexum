export interface TeamMember {
  id: string
  slug: string
  name: string
  role: "Team Captain" | "Vice-Captain" | "Team Member"
  qualification: string
  bio: string
  teaser: string
  tags: string[]
  photoUrl?: string
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "janhavi",
    slug: "janhavi-j",
    name: "Janhavi J",
    role: "Team Captain",
    qualification: "BSc Psychology",
    bio: "An ambitious and versatile MBA student who combines analytical thinking, people-oriented insight, and creative problem-solving. Brings communication, leadership, decision-making, and persuasion skills, along with the ability to adapt to different roles and challenges. Actively involved in extracurricular activities and career counselling initiatives. Interested in understanding people, connecting ideas, and bridging human behaviour with business thinking.",
    teaser: "An ambitious and versatile MBA student who combines analytical thinking, people-oriented insight, and creative problem-solving.",
    tags: [
      "analytical thinking",
      "creative problem-solving",
      "communication",
      "leadership",
      "decision-making",
      "persuasion",
      "extracurricular activities",
      "career counselling",
    ],
  },
  {
    id: "rubikaa",
    slug: "rubikaa-v",
    name: "Rubikaa V",
    role: "Vice-Captain",
    qualification: "BCom (Business Analytics)",
    bio: "An MBA student with a strong interest in entrepreneurship, business development, and the fashion industry. Creative, adaptable, and goal-oriented, with an ambition to build her own clothing brand. Interested in learning new skills, taking on challenges, and continuously developing her communication, leadership, and business abilities.",
    teaser: "An MBA student with a strong interest in entrepreneurship, business development, and the fashion industry.",
    tags: [
      "entrepreneurship",
      "business development",
      "fashion industry",
      "communication",
      "leadership",
      "business abilities",
    ],
  },
  {
    id: "rithvika",
    slug: "rithvika-k",
    name: "Rithvika K",
    role: "Team Member",
    qualification: "BBA",
    bio: "A motivated and enthusiastic MBA student interested in management, teamwork, leadership, and business strategies. Hardworking, responsible, and willing to learn. Enjoys interacting with people, participating in team activities, and improving communication and professional skills. Aims to build confidence and develop a successful career in management.",
    teaser: "A motivated and enthusiastic MBA student interested in management, teamwork, leadership, and business strategies.",
    tags: [
      "management",
      "teamwork",
      "leadership",
      "business strategies",
      "communication",
      "professional skills",
    ],
  },
  {
    id: "unni-mia",
    slug: "unni-mia-roy",
    name: "Unni Mia Roy",
    role: "Team Member",
    qualification: "BCom, MA History",
    bio: "Born in Uttar Pradesh into a Kerala family and raised in Chennai and Coimbatore, Unni Mia brings a cross-cultural perspective shaped by her upbringing. Social and focused on self-improvement, she enjoys reading, fishkeeping, and upcycling. She values balancing studies, fitness, and extracurricular interests, and brings communication, research, and analytical skills.",
    teaser: "Born in Uttar Pradesh into a Kerala family and raised in Chennai and Coimbatore, Unni Mia brings a cross-cultural perspective.",
    tags: [
      "reading",
      "fishkeeping",
      "upcycling",
      "fitness",
      "communication",
      "research",
      "analytical skills",
    ],
  },
  {
    id: "dhanvi",
    slug: "dhanvi-a",
    name: "Dhanvi A",
    role: "Team Member",
    qualification: "BCom (Accounting & Finance)",
    bio: "Experienced in working with teams through volunteering in a healthcare club and later serving as its president. Also participated in the Students Forum's leadership structure and gained experience leading and conducting college events. Her experience reflects involvement in student leadership, teamwork, and event coordination.",
    teaser: "Experienced in working with teams through volunteering in a healthcare club and serving as its president.",
    tags: ["leadership", "teamwork", "event coordination"],
  },
  {
    id: "dharani",
    slug: "dharani-s",
    name: "Dharani S",
    role: "Team Member",
    qualification: "BCom (Professional Accounting)",
    bio: "An MBA student at GRG School of Management Studies with a strong interest in business, leadership, and continuous learning. Calm, adaptable, and responsible, with a belief in observing, learning, and growing through experience. Curious about new ideas and motivated to build meaningful business skills. Aspires to expand her family business and become a confident, capable, forward-thinking professional.",
    teaser: "An MBA student with a strong interest in business, leadership, and continuous learning.",
    tags: ["business", "leadership", "continuous learning", "business skills"],
  },
  {
    id: "chahana",
    slug: "chahana-l",
    name: "Chahana L",
    role: "Team Member",
    qualification: "BCom",
    bio: "An MBA student with an undergraduate foundation in accounting, business fundamentals, and economics. Focused on developing management, analytical, and leadership skills. Eager to learn, adapt, and take on real-world business challenges. Interested in applying her commerce background and management training across areas such as finance, marketing, operations, or strategy.",
    teaser: "An MBA student with an undergraduate foundation in accounting, business fundamentals, and economics.",
    tags: [
      "accounting",
      "business fundamentals",
      "economics",
      "management",
      "analytical skills",
      "leadership",
      "finance",
      "marketing",
      "operations",
      "strategy",
    ],
  },
  {
    id: "sandhiya",
    slug: "sandhiya-gs-nayer",
    name: "Sandhiya GS Nayer",
    role: "Team Member",
    qualification: "BCom (Financial Service)",
    bio: "A calm and introverted MBA student who becomes more open and friendly as she gets comfortable with people. Interested in learning, personal and professional development, editing, driving, and creative and aesthetic activities. Values using time productively, developing useful skills, and building a career.",
    teaser: "A calm and introverted MBA student who becomes more open and friendly as she gets comfortable with people.",
    tags: [
      "learning",
      "personal development",
      "professional development",
      "editing",
      "driving",
      "creative activities",
      "aesthetic activities",
    ],
  },
]

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((member) => member.slug === slug)
}
