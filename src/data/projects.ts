export type Project = {
  name: string;
  category: string;
  description: string;
  accent: string;
  tech: { name: string; slug: string; localSrc?: string }[];
  github?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "HTTP Capture & Replay",
    category: "Developer Tools",
    description:
      "A local reverse proxy that intercepts HTTP(S) traffic, redacts sensitive data at capture time, and replays full multi-request sessions.",
    accent: "linear-gradient(90deg, #38bdf8, #6366f1)",
    tech: [
      { name: "Go", slug: "go" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "TypeScript", slug: "typescript" },
      { name: "SQLite", slug: "sqlite" },
    ],
    github: "https://github.com/alexfisher03/shigawire-dev",
  },
  {
    name: "Solace",
    category: "Mobile App / AI",
    description:
      "An AI-powered wellness companion that delivers personalized mental health support, mood tracking, and journaling.",
    accent: "linear-gradient(90deg, #a855f7, #ec4899)",
    tech: [
      { name: "React Native", slug: "react" },
      { name: "JavaScript", slug: "javascript" },
      { name: "Firebase", slug: "firebase" },
      { name: "Gemini", slug: "googlegemini" },
    ],
    github: "https://github.com/jtaylor205/Solace",
  },
  {
    name: "Interview Coach",
    category: "Web Development / AI",
    description:
      "A LeetCode-style platform for behavioral interview prep — record answers, get AI feedback, and build structured outlines.",
    accent: "linear-gradient(90deg, #6366f1, #a855f7)",
    tech: [
      { name: "React", slug: "react" },
      { name: "TypeScript", slug: "typescript" },
      { name: "Vite", slug: "vite" },
      { name: "Tailwind CSS", slug: "tailwindcss" },
      { name: "Gemini", slug: "googlegemini" },
    ],
    github: "https://github.com/jtaylor205/interview-practice",
  },
  {
    name: "Food Fridge",
    category: "Mobile App",
    description:
      "An iOS app that tracks fridge inventory, flags expiring items, and suggests recipes based on what you already have.",
    accent: "linear-gradient(90deg, #22c55e, #14b8a6)",
    tech: [
      { name: "Swift", slug: "swift" },
      { name: "Firebase", slug: "firebase" },
    ],
    github: "https://github.com/jtaylor205/food-fridge",
  },
  {
    name: "Chess Analysis",
    category: "Data & Algorithms",
    description:
      "A meta-analysis tool that processes large tournament datasets to evaluate opening strategies, player performance, and competitive match statistics.",
    accent: "linear-gradient(90deg, #93c5fd, #6ee7b7)",
    tech: [{ name: "Python", slug: "python" }],
    github: "https://github.com/jtaylor205/Chess-Analysis",
  },
  {
    name: "File System",
    category: "Operating Systems",
    description:
      "A userspace filesystem daemon using the FUSE API, designed to read from and write to WAD files.",
    accent: "linear-gradient(90deg, #ef4444, #f97316)",
    tech: [
      { name: "C", slug: "c" },
      { name: "C++", slug: "cplusplus" },
      { name: "Linux", slug: "linux" },
    ],
  },
];
