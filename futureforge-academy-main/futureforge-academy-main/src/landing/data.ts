import {
  BadgeCheck,
  BookOpen,
  Brain,
  Building2,
  Code2,
  Compass,
  Cpu,
  Flower2,
  GraduationCap,
  Handshake,
  Laptop,
  MessageCircle,
  Monitor,
  Palette,
  Rocket,
  Scissors,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

import cAari from "@/assets/c-aari.jpg";
import cComputer from "@/assets/c-computer.jpg";
import cEnglish from "@/assets/c-english.jpg";
import cHandwriting from "@/assets/c-handwriting.jpg";
import cIelts from "@/assets/c-ielts.jpg";
import cKids from "@/assets/c-kids.jpg";
import cMaths from "@/assets/c-maths.jpg";
import cProgramming from "@/assets/c-programming.jpg";
import cTailoring from "@/assets/c-tailoring.jpg";
import futureBanner from "@/assets/future-banner.jpg";

export const CONTACT = {
  phone: "+91 97500 97500",
  whatsapp: "919750097500",
  email: "info@geniusgroups.in",
  location: "Chennai, Tamil Nadu",
};

export type BookingState = {
  academy: string;
  course: string;
  schedule: string;
  name: string;
  phone: string;
  note: string;
};

export type IconType = LucideIcon;

export const HERO_ASSET_VERSION = "20260528-frames-v2";
export const futureBannerImage = futureBanner;

export const HERO_FRAME_COUNT = 300;
export const HERO_STORY_START_FRAME = 1;
export const HERO_MOBILE_SPRITE_VERSION = "20260529-mobile-sprite-v1";
export const HERO_MOBILE_SPRITE = {
  columns: 10,
  frameCount: 60,
  frameHeight: 640,
  frameWidth: 360,
  src: `/hero-mobile-sprite.webp?v=${HERO_MOBILE_SPRITE_VERSION}`,
};

export function heroFrameSrc(index: number) {
  const frame = Math.min(HERO_FRAME_COUNT, Math.max(1, Math.round(index)));
  return `/hero-frames/ezgif-frame-${String(frame).padStart(3, "0")}.jpg?v=${HERO_ASSET_VERSION}`;
}

const academyImages = [cEnglish, cProgramming, cTailoring] as const;
const courseImages = [
  cEnglish,
  cComputer,
  cProgramming,
  cTailoring,
  cAari,
  cMaths,
  cIelts,
  cHandwriting,
  cKids,
] as const;
const galleryImages = [cEnglish, cComputer, cProgramming, cTailoring, cAari, cKids] as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Academies", href: "#academies" },
  { label: "Courses", href: "#courses" },
  { label: "Stories", href: "#stories" },
  { label: "Gallery", href: "#gallery" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export const trustStats = [
  { icon: Users, value: "15K+", label: "Happy students" },
  { icon: BookOpen, value: "100+", label: "Career courses" },
  { icon: Trophy, value: "98%", label: "Success rate" },
  { icon: Building2, value: "10+", label: "Years of excellence" },
];

export const heroChips = [
  { label: "Genius Academy", icon: GraduationCap },
  { label: "CST Computers", icon: Cpu },
  { label: "Kalai Fashion Academy", icon: Scissors },
  { label: "Placement Support", icon: Handshake },
];

export const heroProofCards = [
  { icon: BookOpen, title: "100+ courses" },
  { icon: BadgeCheck, title: "Certified paths" },
  { icon: Users, title: "15K+ learners" },
];

export const heroShowcaseItems = [
  { title: "Spoken English", kicker: "Fluency lab", tone: "pink" },
  { title: "Computer Courses", kicker: "Digital skills", tone: "cyan" },
  { title: "Aari Work", kicker: "Creative studio", tone: "amber" },
  { title: "Speed Maths", kicker: "Fast thinking", tone: "green" },
  { title: "Kids Courses", kicker: "Playful learning", tone: "gold" },
  { title: "Tailoring", kicker: "Hands-on craft", tone: "violet" },
];

export const academyStories = [
  {
    name: "Genius Academy",
    eyebrow: "Academy 01",
    title: "Communication, confidence, school excellence, and global test prep.",
    body: "Build strong fundamentals through spoken English labs, IELTS and TOEFL coaching, speed maths, handwriting, and kids skill programs guided by patient trainers.",
    image: academyImages[0],
    icon: GraduationCap,
    courses: ["Spoken English", "IELTS / TOEFL", "Speed Maths", "Handwriting", "Kids Programs"],
    proof: ["Fluency labs", "Small batches", "Daily practice"],
  },
  {
    name: "CST Computers",
    eyebrow: "Academy 02",
    title: "Computer literacy, programming, office tools, and job-ready tech skills.",
    body: "From MS Office and Tally to DTP, PGDCA, Python, Java, C, C++, and multimedia workflows, CST Computers helps learners move from basics to confident execution.",
    image: academyImages[1],
    icon: Monitor,
    courses: ["MS Office", "Tally", "DTP", "Python", "Java", "Multimedia"],
    proof: ["Lab sessions", "Project work", "Certificate path"],
  },
  {
    name: "Kalai Fashion Academy",
    eyebrow: "Academy 03",
    title: "Fashion, tailoring, Aari work, embroidery, and creative entrepreneurship.",
    body: "Learn practical garment construction, boutique-ready blouse design, Aari embroidery, finishing, measurements, and portfolio-making with mentor-led practice.",
    image: academyImages[2],
    icon: Scissors,
    courses: ["Tailoring", "Aari Work", "Embroidery", "Designer Blouse", "Fashion Basics"],
    proof: ["Hands-on studio", "Portfolio output", "Business guidance"],
  },
];

export const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Trusted training ecosystem",
    body: "Three focused academies under one premium learning brand, with a clear path for every learner.",
    size: "lg",
  },
  {
    icon: Rocket,
    title: "Practical from day one",
    body: "Every batch includes drills, lab work, making sessions, assessments, and measurable outcomes.",
    size: "sm",
  },
  {
    icon: UserCheck,
    title: "Mentor-led batches",
    body: "Expert trainers keep class sizes personal and give feedback that learners can actually act on.",
    size: "sm",
  },
  {
    icon: Handshake,
    title: "Placement and growth support",
    body: "Career guidance, interview practice, portfolio support, and course counseling stay built in.",
    size: "wide",
  },
];

export const courses = [
  {
    name: "Spoken English",
    academy: "Genius Academy",
    image: courseImages[0],
    icon: MessageCircle,
    duration: "45 days",
    mode: "Morning / Evening",
    skills: ["Grammar", "Conversation", "Public speaking"],
    summary: "Daily speaking drills, pronunciation practice, and confidence-first fluency.",
    imagePosition: "center",
    layout: "large",
    tone: "pink",
  },
  {
    name: "Computer Courses",
    academy: "CST Computers",
    image: courseImages[1],
    icon: Laptop,
    duration: "60 days",
    mode: "Lab batches",
    skills: ["MS Office", "Tally", "DTP"],
    summary: "Practical computer literacy, office tools, accounting, and certificate paths.",
    imagePosition: "center 48%",
    layout: "wide",
    tone: "cyan",
  },
  {
    name: "Programming",
    academy: "CST Computers",
    image: courseImages[2],
    icon: Code2,
    duration: "90 days",
    mode: "Project track",
    skills: ["C / C++", "Java", "Python"],
    summary: "Code foundations with projects learners can explain with confidence.",
    imagePosition: "center",
    layout: "standard",
    tone: "blue",
  },
  {
    name: "Tailoring",
    academy: "Kalai Fashion Academy",
    image: courseImages[3],
    icon: Scissors,
    duration: "60 days",
    mode: "Studio practice",
    skills: ["Cutting", "Stitching", "Finishing"],
    summary: "Measurement, garment construction, finishing, and boutique-ready practice.",
    imagePosition: "center 58%",
    layout: "large",
    tone: "amber",
  },
  {
    name: "Aari Work",
    academy: "Kalai Fashion Academy",
    image: courseImages[4],
    icon: Flower2,
    duration: "45 days",
    mode: "Hands-on",
    skills: ["Needle work", "Frames", "Design patterns"],
    summary: "Frame setup, motif practice, embroidery finishing, and portfolio patterns.",
    imagePosition: "center 46%",
    layout: "standard",
    tone: "violet",
  },
  {
    name: "Speed Maths",
    academy: "Genius Academy",
    image: courseImages[5],
    icon: Brain,
    duration: "30 days",
    mode: "Kids / Teens",
    skills: ["Vedic maths", "Mental math", "Confidence"],
    summary: "Fast mental-math techniques with playful challenge-based practice.",
    imagePosition: "center 42%",
    layout: "standard",
    tone: "green",
  },
  {
    name: "IELTS / TOEFL",
    academy: "Genius Academy",
    image: courseImages[6],
    icon: Compass,
    duration: "Flexible",
    mode: "Test prep",
    skills: ["Reading", "Writing", "Speaking"],
    summary: "Structured test prep for speaking, writing, vocabulary, and mock practice.",
    imagePosition: "center",
    layout: "wide",
    tone: "cyan",
  },
  {
    name: "Handwriting",
    academy: "Genius Academy",
    image: courseImages[7],
    icon: Palette,
    duration: "21 days",
    mode: "All ages",
    skills: ["Speed", "Clarity", "Presentation"],
    summary: "Legibility, rhythm, neat presentation, and writing confidence for all ages.",
    imagePosition: "right center",
    layout: "large",
    tone: "gold",
  },
  {
    name: "Kids Programs",
    academy: "Genius Academy",
    image: courseImages[8],
    icon: Sparkles,
    duration: "Weekend",
    mode: "Activity batches",
    skills: ["Creativity", "Logic", "Communication"],
    summary: "Fun activity batches for communication, logic, creativity, and curiosity.",
    imagePosition: "center 44%",
    layout: "standard",
    tone: "amber",
  },
];

export const testimonials = [
  {
    name: "Priya S.",
    role: "Spoken English learner",
    quote:
      "The practice sessions made speaking feel natural. I joined with hesitation and finished with confidence.",
  },
  {
    name: "Arun K.",
    role: "Programming student",
    quote:
      "CST Computers gave me a clean foundation in Python and projects I could explain in interviews.",
  },
  {
    name: "Meena R.",
    role: "Aari work student",
    quote:
      "The fashion studio classes were practical, patient, and full of designs I could use for orders.",
  },
];

export const galleryItems = [
  { title: "English speaking lab", image: galleryImages[0], tag: "Communication" },
  { title: "Computer lab practice", image: galleryImages[1], tag: "Technology" },
  { title: "Programming projects", image: galleryImages[2], tag: "Software" },
  { title: "Tailoring studio", image: galleryImages[3], tag: "Fashion" },
  { title: "Aari design work", image: galleryImages[4], tag: "Creativity" },
  { title: "Kids activity batches", image: galleryImages[5], tag: "Foundation" },
];

export const mentors = [
  {
    name: "Communication Mentors",
    academy: "Genius Academy",
    icon: MessageCircle,
    body: "Fluency, grammar, interview practice, public speaking, and test preparation.",
  },
  {
    name: "Tech Trainers",
    academy: "CST Computers",
    icon: Code2,
    body: "Office tools, accounting software, programming, multimedia, and practical lab work.",
  },
  {
    name: "Fashion Guides",
    academy: "Kalai Fashion Academy",
    icon: Scissors,
    body: "Pattern making, garment finishing, Aari work, embroidery, and boutique guidance.",
  },
];

export const admissionSteps = [
  {
    title: "Choose your academy",
    body: "Pick Genius Academy, CST Computers, or Kalai Fashion Academy based on your goal.",
  },
  {
    title: "Book a counseling call",
    body: "Share your schedule, experience level, and preferred course with the admissions team.",
  },
  {
    title: "Attend a demo",
    body: "Meet the trainer, understand the batch plan, and confirm the right learning track.",
  },
  {
    title: "Start your batch",
    body: "Begin with a clear roadmap, practice rhythm, and progress checkpoints.",
  },
];

export const liveCounters = [
  { value: "28", label: "Active batches this month" },
  { value: "420+", label: "Admissions guided this season" },
  { value: "3", label: "Focused academies" },
  { value: "6", label: "Days a week support" },
];

export const faqs = [
  {
    question: "Which academy should I choose?",
    answer:
      "Choose Genius Academy for communication, school, and test-prep programs; CST Computers for software and computer courses; and Kalai Fashion Academy for tailoring, Aari work, and fashion skills.",
  },
  {
    question: "Do you provide certificates?",
    answer:
      "Yes. Certificate paths are available for selected courses, and the admissions team will confirm the certificate details for your chosen program.",
  },
  {
    question: "Are there weekend or evening batches?",
    answer:
      "Yes. Batch availability changes by course, but morning, evening, and weekend options are supported across popular programs.",
  },
  {
    question: "Can beginners join?",
    answer:
      "Absolutely. Most courses have beginner-friendly tracks, and trainers help place you at the correct level before classes begin.",
  },
];

export const bookingCourses = [
  "Spoken English",
  "Computer Courses",
  "Programming",
  "Tailoring",
  "Aari Work",
  "Speed Maths",
  "IELTS / TOEFL",
  "Kids Programs",
];

export type AcademyStory = (typeof academyStories)[number];
export type Course = (typeof courses)[number];
export type GalleryItem = (typeof galleryItems)[number];
export type AdmissionStepItem = (typeof admissionSteps)[number];
export type Faq = (typeof faqs)[number];
