export type Skill = {
  name: string;
  slug: string;
  localSrc?: string;
  keepColor?: boolean;
};

export const SKILL_CATEGORIES: { label: string; skills: Skill[] }[] = [
  {
    label: "Languages",
    skills: [
      { name: "Python", slug: "python" },
      { name: "JavaScript", slug: "javascript" },
      { name: "TypeScript", slug: "typescript" },
      { name: "C", slug: "c" },
      { name: "C++", slug: "cplusplus" },
      { name: "Go", slug: "go" },
      { name: "Swift", slug: "swift" },
    ],
  },
  {
    label: "Data & Infrastructure",
    skills: [
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "MySQL", slug: "mysql" },
      { name: "Redis", slug: "redis" },
      { name: "Cassandra", slug: "apachecassandra" },
      { name: "Kubernetes", slug: "kubernetes" },
      { name: "Docker", slug: "docker" },
      { name: "Git", slug: "git" },
    ],
  },
  {
    label: "Frontend",
    skills: [
      { name: "React", slug: "react" },
      { name: "Next.js", slug: "nextdotjs" },
      { name: "Tailwind", slug: "tailwindcss" },
      { name: "HTML", slug: "html5" },
      { name: "CSS", slug: "css" },
    ],
  },
  {
    label: "Backend & APIs",
    skills: [
      { name: "Node.js", slug: "nodedotjs" },
      { name: "gRPC", slug: "grpc", localSrc: "/images/grpc.svg" },
      { name: "Protobuf", slug: "protocolbuffers", localSrc: "/images/protobuf.svg" },
      { name: "Kafka", slug: "apachekafka" },
    ],
  },
];
