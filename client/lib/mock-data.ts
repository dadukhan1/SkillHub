export interface Course {
  id: string;
  title: string;
  instructor: { name: string; avatar: string };
  category: string;
  rating: number;
  students: number;
  price: number;
  originalPrice?: number;
  thumbnail: { tone: string };
  level: "Beginner" | "Intermediate" | "Advanced";
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  students: number;
  courses: number;
  rating: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export const featuredCourses: Course[] = [
  {
    id: "1",
    title: "Advanced React Patterns & Architecture",
    instructor: { name: "Sarah Chen", avatar: "SC" },
    category: "Development",
    rating: 4.9,
    students: 12400,
    price: 89,
    originalPrice: 129,
    thumbnail: { tone: "#5e6ad2" },
    level: "Advanced",
  },
  {
    id: "2",
    title: "Product Design Systems Masterclass",
    instructor: { name: "Marcus Webb", avatar: "MW" },
    category: "Design",
    rating: 4.8,
    students: 8700,
    price: 79,
    thumbnail: { tone: "#e4e4e8" },
    level: "Intermediate",
  },
  {
    id: "3",
    title: "Machine Learning Fundamentals",
    instructor: { name: "Dr. Aisha Patel", avatar: "AP" },
    category: "Data Science",
    rating: 4.9,
    students: 15200,
    price: 99,
    originalPrice: 149,
    thumbnail: { tone: "#e0e0e6" },
    level: "Beginner",
  },
  {
    id: "4",
    title: "Growth Marketing for Startups",
    instructor: { name: "James Okonkwo", avatar: "JO" },
    category: "Marketing",
    rating: 4.7,
    students: 6300,
    price: 69,
    thumbnail: { tone: "#dcdce2" },
    level: "Intermediate",
  },
];

export const categories: Category[] = [
  { id: "1", name: "Development", count: 142, icon: "code" },
  { id: "2", name: "Design", count: 86, icon: "palette" },
  { id: "3", name: "Data Science", count: 64, icon: "chart" },
  { id: "4", name: "Business", count: 98, icon: "briefcase" },
  { id: "5", name: "Marketing", count: 72, icon: "megaphone" },
  { id: "6", name: "AI & ML", count: 45, icon: "sparkles" },
];

export const instructors: Instructor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Engineer @ Vercel",
    avatar: "SC",
    students: 42000,
    courses: 8,
    rating: 4.9,
  },
  {
    id: "2",
    name: "Marcus Webb",
    role: "Design Lead @ Linear",
    avatar: "MW",
    students: 31000,
    courses: 6,
    rating: 4.8,
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    role: "ML Researcher @ Stanford",
    avatar: "AP",
    students: 58000,
    courses: 12,
    rating: 4.9,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "SkillHub completely changed how I approach learning. The quality rivals anything I've used in my career — polished, focused, and genuinely effective.",
    author: "Elena Rodriguez",
    role: "Product Manager at Stripe",
    avatar: "ER",
  },
  {
    id: "2",
    quote:
      "Finally a platform that respects my time. No fluff, no outdated content. Every course feels like it was built by people who care about craft.",
    author: "David Kim",
    role: "Staff Engineer at Notion",
    avatar: "DK",
  },
  {
    id: "3",
    quote:
      "The learning paths are brilliantly structured. I went from beginner to shipping production apps in three months.",
    author: "Priya Sharma",
    role: "Founder, Nexa Labs",
    avatar: "PS",
  },
];

export const dashboardCourses = [
  {
    id: "1",
    title: "Advanced React Patterns",
    progress: 72,
    lessonsCompleted: 18,
    totalLessons: 25,
    lastAccessed: "2 hours ago",
    thumbnail: { from: "#5e6ad2", to: "#8b5cf6" },
  },
  {
    id: "2",
    title: "TypeScript Deep Dive",
    progress: 45,
    lessonsCompleted: 9,
    totalLessons: 20,
    lastAccessed: "Yesterday",
    thumbnail: { tone: "#e0e0e6" },
  },
  {
    id: "3",
    title: "System Design Fundamentals",
    progress: 12,
    lessonsCompleted: 3,
    totalLessons: 24,
    lastAccessed: "3 days ago",
    thumbnail: { tone: "#dcdce2" },
  },
];

export const analyticsStats = [
  { label: "Hours learned", value: "47.5", change: "+12%", trend: "up" as const },
  { label: "Courses active", value: "3", change: "+1", trend: "up" as const },
  { label: "Streak", value: "14 days", change: "Personal best", trend: "neutral" as const },
  { label: "Certificates", value: "2", change: "+1 this month", trend: "up" as const },
];
