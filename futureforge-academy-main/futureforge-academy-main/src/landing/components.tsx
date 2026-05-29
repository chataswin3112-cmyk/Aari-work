import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Gem,
  GraduationCap,
  MapPin,
  MessageCircle,
  Quote,
  Star,
  type LucideIcon,
} from "lucide-react";

import {
  CONTACT,
  bookingCourses,
  type AcademyStory,
  type AdmissionStepItem,
  type BookingState,
  type Course,
  type Faq,
  type GalleryItem,
} from "./data";

type MotionSurfaceProps = {
  as?: "article" | "div";
  children: ReactNode;
  className: string;
  reveal?: boolean;
};

function MotionSurface({ as = "div", children, className, reveal }: MotionSurfaceProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionProps = {
    className,
    "data-reveal": reveal ? "" : undefined,
    transition: { damping: 24, stiffness: 260, type: "spring" as const },
    whileHover: shouldReduceMotion ? undefined : { scale: 1.012, y: -6 },
  };

  return as === "article" ? (
    <motion.article {...motionProps}>{children}</motion.article>
  ) : (
    <motion.div {...motionProps}>{children}</motion.div>
  );
}

export function KineticText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} data-split-text>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`} className="kinetic-word">
          {word}
          {index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </span>
  );
}

export function HeroCinematicSequence() {
  return (
    <div
      className="hero-cinematic-sequence pointer-events-none absolute inset-0"
      data-cinematic-frame-layer
      aria-hidden="true"
    >
      <canvas className="hero-frame-canvas absolute inset-0 h-full w-full" data-hero-frame-canvas />
      <div className="hero-cinematic-bloom absolute inset-0" data-cinematic-bloom />
      <div className="hero-cinematic-fog absolute inset-0" data-cinematic-fog />
      <div className="hero-dissolve-field absolute inset-0" data-hero-dissolve />
      <div className="hero-chromatic-edge hero-chromatic-edge-cyan absolute inset-0" />
      <div className="hero-chromatic-edge hero-chromatic-edge-pink absolute inset-0" />
      <div className="hero-cinematic-grain absolute inset-0" />
      <div className="hero-cinematic-vignette absolute inset-0" />
      <span className="story-progress hero-sequence-progress" data-story-progress />
    </div>
  );
}

export function FloatingHeroCard({
  className,
  icon: Icon,
  title,
}: {
  className: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div
      className={`glass-strong hover-lift absolute rounded-2xl px-3.5 py-3 ${className}`}
      data-floating-orbit
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#00E5FF]" />
        <span className="text-xs font-black uppercase tracking-[0.14em] text-white/86">
          {title}
        </span>
      </div>
    </div>
  );
}

export function StatTile({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <MotionSurface className="stat-tile glass-strong rounded-[28px] p-5" reveal>
      <Icon className="mb-4 h-8 w-8 text-[#00E5FF]" />
      <div className="text-4xl font-black" data-count-value={value}>
        0
      </div>
      <div className="mt-1 text-sm text-white/64">{label}</div>
    </MotionSurface>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  body: string;
  align?: "center" | "left";
}) {
  const titleFragments = title.split(/(cinematic|learning|future|momentum|proof)/i);

  return (
    <div
      className={`section-heading ${align === "center" ? "mx-auto text-center" : "text-left"} max-w-3xl`}
      data-reveal
    >
      <p className="section-eyebrow text-xs font-bold uppercase tracking-[0.34em] text-[#00E5FF]">
        {eyebrow}
      </p>
      <h2 className="section-title mt-4 text-3xl font-black leading-tight md:text-5xl">
        {titleFragments.map((fragment, index) =>
          /^(cinematic|learning|future|momentum|proof)$/i.test(fragment) ? (
            <span key={`${fragment}-${index}`} className="text-gradient">
              {fragment}
            </span>
          ) : (
            <span key={`${fragment}-${index}`}>{fragment}</span>
          ),
        )}
      </h2>
      <p className="section-body mt-4 text-base leading-7 text-white/66 md:text-lg">{body}</p>
    </div>
  );
}

export function AcademyBand({ academy, index }: { academy: AcademyStory; index: number }) {
  const Icon = academy.icon;
  const isReversed = index % 2 === 1;

  return (
    <article
      className={`academy-band glow-border relative overflow-hidden rounded-[32px] p-4 md:p-6 ${
        isReversed ? "academy-band-alt" : ""
      }`}
      data-academy-band
      data-reveal
    >
      <div className="grid gap-6 lg:grid-cols-[86px_1fr_420px] lg:items-center">
        <div className="hidden h-full lg:block">
          <div className="academy-rail h-full">
            <span className="academy-rail-fill" data-rail-fill />
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-sm font-black text-[#00E5FF]">
              0{index + 1}
            </span>
          </div>
        </div>

        <div className={`space-y-5 ${isReversed ? "lg:order-3" : "lg:order-2"}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white/68">
              {academy.eyebrow}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs font-bold text-[#00E5FF]">
              <Icon className="h-3.5 w-3.5" />
              {academy.name}
            </span>
          </div>
          <h3 className="text-2xl font-black leading-tight md:text-4xl">{academy.title}</h3>
          <p className="max-w-3xl text-base leading-7 text-white/66">{academy.body}</p>
          <div className="flex flex-wrap gap-2">
            {academy.courses.map((course) => (
              <span
                key={course}
                className="rounded-full border border-white/12 bg-white/7 px-3 py-1.5 text-xs text-white/72"
              >
                {course}
              </span>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {academy.proof.map((item) => (
              <div
                key={item}
                className="glass-panel rounded-2xl p-3 text-sm font-semibold text-white/82"
              >
                <CheckCircle2 className="mb-2 h-4 w-4 text-[#FF4FD8]" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          className={`academy-media image-frame relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/12 sm:aspect-[16/10] lg:aspect-[5/4] ${
            isReversed ? "lg:order-2" : "lg:order-3"
          }`}
        >
          <img
            src={academy.image}
            alt={`${academy.name} learning program`}
            className="absolute inset-0 h-[116%] w-full object-cover"
            data-parallax="-10"
            loading="lazy"
            width={800}
            height={700}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,22,0.10),rgba(6,8,22,0.82))]" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="glass-strong rounded-2xl p-4">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/62">
                Featured
              </p>
              <p className="mt-1 text-xl font-black">{academy.courses[0]}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  body,
  size,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  size?: string;
}) {
  return (
    <MotionSurface
      className={`bento-card glass-strong light-sweep rounded-[28px] p-5 md:p-6 ${
        size === "lg" ? "md:row-span-2" : ""
      } ${size === "wide" ? "md:col-span-2" : ""}`}
      reveal
    >
      <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-[#00E5FF]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
    </MotionSurface>
  );
}

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/8 text-white transition hover:border-[#00E5FF]/70 hover:bg-white/14"
      data-magnetic
    >
      {children}
    </button>
  );
}

export function CourseCard({ course, index }: { course: Course; index: number }) {
  const Icon = course.icon;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`course-card course-card-${course.layout} light-sweep group relative overflow-hidden rounded-[28px] border border-white/12 bg-white/6`}
      data-course-card
      data-course-tone={course.tone}
      data-reveal
      initial={false}
      transition={{ damping: 24, stiffness: 260, type: "spring" }}
      whileHover={shouldReduceMotion ? undefined : { rotate: index % 2 === 0 ? -0.8 : 0.8, y: -8 }}
    >
      <div className="course-media relative overflow-hidden">
        <img
          src={course.image}
          alt={`${course.name} course`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
          style={{ objectPosition: course.imagePosition }}
          loading="eager"
          width={720}
          height={520}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,22,0.02)_0%,rgba(6,8,22,0.20)_54%,rgba(6,8,22,0.66)_100%)]" />
      </div>

      <div className="course-card-body relative z-10 flex min-h-[250px] flex-col p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/12 text-[#00E5FF] backdrop-blur-xl">
            <Icon className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/76 backdrop-blur-xl">
            {course.academy}
          </span>
        </div>
        <h3 className="text-2xl font-black leading-tight md:text-3xl">{course.name}</h3>
        <p className="mt-3 text-sm leading-6 text-white/66">{course.summary}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/68">
          <span className="rounded-2xl bg-white/9 p-3 backdrop-blur-xl">
            <span className="block font-bold text-white">Duration</span>
            {course.duration}
          </span>
          <span className="rounded-2xl bg-white/9 p-3 backdrop-blur-xl">
            <span className="block font-bold text-white">Mode</span>
            {course.mode}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {course.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/70"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <MotionSurface as="article" className="glass-strong rounded-[28px] p-6" reveal>
      <Quote className="mb-6 h-8 w-8 text-[#FF4FD8]" />
      <p className="text-base leading-7 text-white/78">{quote}</p>
      <div className="mt-7 border-t border-white/10 pt-4">
        <p className="font-black">{name}</p>
        <p className="text-sm text-white/58">{role}</p>
      </div>
    </MotionSurface>
  );
}

export function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <motion.article
      className="image-frame gallery-card group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/12 sm:aspect-[16/11]"
      data-reveal
      transition={{ damping: 24, stiffness: 260, type: "spring" }}
      whileHover={{ scale: 1.015, y: -5 }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.08]"
        loading="lazy"
        width={720}
        height={720}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,22,0.08),rgba(6,8,22,0.84))]" />
      <div className="absolute bottom-4 left-4 right-4">
        <span className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#00E5FF] backdrop-blur-xl">
          {item.tag}
        </span>
        <h3 className="mt-3 text-2xl font-black">{item.title}</h3>
      </div>
    </motion.article>
  );
}

export function MentorCard({
  name,
  academy,
  icon: Icon,
  body,
}: {
  name: string;
  academy: string;
  icon: LucideIcon;
  body: string;
}) {
  return (
    <MotionSurface as="article" className="glass-strong rounded-[28px] p-6" reveal>
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#00E5FF]">
          <Icon className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/62">
          {academy}
        </span>
      </div>
      <h3 className="text-2xl font-black">{name}</h3>
      <p className="mt-3 text-sm leading-6 text-white/64">{body}</p>
    </MotionSurface>
  );
}

export function AdmissionStep({ step, index }: { step: AdmissionStepItem; index: number }) {
  return (
    <div className="admission-step glass-panel flex gap-4 rounded-[24px] p-4" data-reveal>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-sm font-black text-[#00E5FF]">
        {index + 1}
      </span>
      <span>
        <span className="block font-black">{step.title}</span>
        <span className="mt-1 block text-sm leading-6 text-white/62">{step.body}</span>
      </span>
    </div>
  );
}

export function BookingPanel({
  booking,
  bookingStep,
  updateBooking,
  setBookingStep,
  whatsappMessage,
}: {
  booking: BookingState;
  bookingStep: number;
  updateBooking: (field: keyof BookingState, value: string) => void;
  setBookingStep: (step: number) => void;
  whatsappMessage: string;
}) {
  const steps = ["Academy", "Course", "Schedule", "Details"];
  const schedules = ["Weekday Morning", "Weekday Evening", "Weekend", "Flexible"];

  return (
    <div className="glass-strong glow-border booking-shell rounded-[32px] p-5 md:p-7" data-reveal>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#00E5FF]">
            Premium booking
          </p>
          <h3 className="mt-3 text-3xl font-black">Admission request</h3>
        </div>
        <div className="hidden h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#FF4FD8] sm:grid">
          <Gem className="h-6 w-6" />
        </div>
      </div>

      <div className="booking-progress mb-7 grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => setBookingStep(index)}
            className={`booking-step min-h-12 rounded-2xl px-2 py-3 text-xs font-bold transition ${
              bookingStep === index
                ? "booking-step-active bg-[#7B61FF] text-white shadow-[0_0_28px_rgba(123,97,255,0.38)]"
                : "bg-white/7 text-white/58 hover:bg-white/12 hover:text-white"
            }`}
          >
            {step}
          </button>
        ))}
      </div>

      <div className="booking-panel-body min-h-[318px]">
        {bookingStep === 0 && (
          <ChoiceGrid
            label="Select academy"
            value={booking.academy}
            options={["Genius Academy", "CST Computers", "Kalai Fashion Academy"]}
            onChange={(value) => updateBooking("academy", value)}
          />
        )}
        {bookingStep === 1 && (
          <ChoiceGrid
            label="Choose course"
            value={booking.course}
            options={bookingCourses}
            onChange={(value) => updateBooking("course", value)}
          />
        )}
        {bookingStep === 2 && (
          <ChoiceGrid
            label="Preferred schedule"
            value={booking.schedule}
            options={schedules}
            onChange={(value) => updateBooking("schedule", value)}
          />
        )}
        {bookingStep === 3 && (
          <div className="space-y-3">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/78">Name</span>
              <input
                value={booking.name}
                onChange={(event) => updateBooking("name", event.target.value)}
                className="field-control"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/78">Phone</span>
              <input
                value={booking.phone}
                onChange={(event) => updateBooking("phone", event.target.value)}
                className="field-control"
                inputMode="tel"
                placeholder="+91"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/78">Goal or note</span>
              <textarea
                value={booking.note}
                onChange={(event) => updateBooking("note", event.target.value)}
                className="field-control min-h-24 resize-none"
                placeholder="Tell us what you want to learn"
              />
            </label>
          </div>
        )}
      </div>

      <BookingSummary booking={booking} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
        <button
          type="button"
          className="neon-outline rounded-full px-5 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
          disabled={bookingStep === 0}
          onClick={() => setBookingStep(Math.max(0, bookingStep - 1))}
          data-magnetic
        >
          Back
        </button>
        {bookingStep < steps.length - 1 ? (
          <button
            type="button"
            className="neon-button rounded-full px-5 py-3 text-sm font-bold"
            onClick={() => setBookingStep(Math.min(steps.length - 1, bookingStep + 1))}
            data-magnetic
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <a
            href={`https://wa.me/${CONTACT.whatsapp}?text=${whatsappMessage}`}
            className="neon-button rounded-full px-5 py-3 text-sm font-bold"
            data-magnetic
          >
            Send request
            <MessageCircle className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function ChoiceGrid({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-4 text-sm font-bold text-white/78">{label}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-16 rounded-3xl border px-4 py-3 text-left text-sm font-bold transition ${
              value === option
                ? "border-[#00E5FF]/70 bg-[#00E5FF]/14 text-white shadow-[0_0_24px_rgba(0,229,255,0.2)]"
                : "border-white/10 bg-white/7 text-white/66 hover:border-white/20 hover:bg-white/12"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function BookingSummary({ booking }: { booking: BookingState }) {
  const summaryItems = [
    ["Academy", booking.academy],
    ["Course", booking.course],
    ["Schedule", booking.schedule],
  ];

  return (
    <div className="booking-summary mt-5 grid gap-2 rounded-[24px] border border-white/10 bg-white/[0.055] p-3 sm:grid-cols-3">
      {summaryItems.map(([label, value]) => (
        <div key={label} className="rounded-2xl bg-white/[0.055] px-3 py-2">
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-white/42">
            {label}
          </span>
          <span className="mt-1 block truncate text-sm font-bold text-white/86">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function LiveCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-panel rounded-[26px] p-5" data-counter>
      <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/54">
        <span className="h-2 w-2 rounded-full bg-[#00E5FF] shadow-[0_0_18px_rgba(0,229,255,0.9)]" />
        Live
      </div>
      <div className="text-4xl font-black text-gradient">{value}</div>
      <p className="mt-2 text-sm text-white/64">{label}</p>
    </div>
  );
}

export function FaqItem({
  faq,
  index,
  isOpen,
  onToggle,
}: {
  faq: Faq;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`faq-panel rounded-[24px] border border-white/10 bg-white/[0.055] ${
        isOpen ? "faq-panel-open" : ""
      }`}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={isOpen}
        aria-controls={`faq-${index}`}
        onClick={onToggle}
      >
        <span className="text-base font-black md:text-lg">{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#00E5FF] transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={`faq-${index}`}
        className={`grid transition-all duration-300 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-7 text-white/66">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <span className="glass-panel flex items-center gap-4 rounded-3xl p-4 transition hover:bg-white/10">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/10 text-[#00E5FF]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/48">
          {label}
        </span>
        <span className="mt-1 block break-words font-bold text-white">{value}</span>
      </span>
    </span>
  );

  return href ? <a href={href}>{content}</a> : content;
}

export function BrandMark() {
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[linear-gradient(135deg,#00E5FF,#7B61FF,#FF4FD8)] shadow-[0_0_34px_rgba(0,229,255,0.36)]">
      <GraduationCap className="h-6 w-6 text-white" />
    </span>
  );
}

export function SocialProofStack({ images }: { images: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {images.map((image) => (
          <img
            key={image}
            src={image}
            alt=""
            className="h-9 w-9 rounded-full border-2 border-[#060816] object-cover"
            width={96}
            height={96}
          />
        ))}
      </div>
      <div>
        <div className="flex gap-0.5 text-[#00E5FF]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <p className="mt-1 text-xs font-medium text-white/76">
          Practical learning, real outcomes, mentor support.
        </p>
      </div>
    </div>
  );
}

export function CampusMapCard() {
  return (
    <div
      className="relative aspect-[4/3] min-h-[420px] overflow-hidden rounded-[32px] border border-white/12 bg-white/6 p-5"
      data-reveal
    >
      <div className="premium-map absolute inset-0" aria-hidden="true" />
      <span className="map-pin-orbit" aria-hidden="true" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="glass-panel w-fit rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/74">
          Chennai, Tamil Nadu
        </div>
        <div className="glass-strong rounded-[28px] p-5">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-[#00E5FF]">
            <MapPin className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-black">GENIUS GROUPS Campus</h3>
          <p className="mt-2 text-sm leading-6 text-white/68">
            Counseling, training, admissions, and course guidance for all three academies.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ParticleField() {
  return (
    <div
      className="particle-field pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="particles" aria-hidden="true" />
      {Array.from({ length: 44 }).map((_, index) => (
        <span
          key={index}
          className="particle-dot absolute rounded-full"
          style={{
            animation: `particleFloat ${9 + (index % 7)}s ease-in-out ${index * 0.18}s infinite`,
            left: `${(index * 29) % 100}%`,
            top: `${(index * 47) % 100}%`,
          }}
        />
      ))}
    </div>
  );
}
