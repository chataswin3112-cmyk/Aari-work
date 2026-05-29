import { useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  GraduationCap,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  X,
} from "lucide-react";

import { AuroraCanvas } from "./AuroraCanvas";
import {
  AcademyBand,
  AdmissionStep,
  BookingPanel,
  BrandMark,
  CampusMapCard,
  ContactLine,
  CourseCard,
  FeatureCard,
  FaqItem,
  GalleryCard,
  HeroCinematicSequence,
  KineticText,
  LiveCounter,
  MentorCard,
  ParticleField,
  SectionHeading,
  StatTile,
  TestimonialCard,
} from "./components";
import {
  CONTACT,
  academyStories,
  admissionSteps,
  courses,
  faqs,
  futureBannerImage,
  galleryItems,
  liveCounters,
  mentors,
  navLinks,
  testimonials,
  trustStats,
  whyChooseUs,
  type BookingState,
} from "./data";
import {
  useActiveSection,
  useLandingMotion,
  useLenisScroll,
  usePrefersReducedMotion,
  useScrolledNav,
} from "./hooks";

const SECTION_PAD = "section-space px-4 md:px-6";
const MAX_WIDTH = "mx-auto max-w-7xl";

export function LandingPage() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const scrolled = useScrolledNav();
  const activeSection = useActiveSection();
  const activeNavIndex = Math.max(
    0,
    navLinks.findIndex((link) => link.href.slice(1) === activeSection),
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [bookingStep, setBookingStep] = useState(0);
  const [booking, setBooking] = useState<BookingState>({
    academy: "Genius Academy",
    course: "Spoken English",
    schedule: "Weekday Morning",
    name: "",
    phone: "",
    note: "",
  });

  useLenisScroll(pageRef, reducedMotion);
  useLandingMotion(pageRef, reducedMotion);

  const whatsappMessage = useMemo(
    () =>
      encodeURIComponent(
        `Hi GENIUS GROUPS, I want admission details.\nAcademy: ${booking.academy}\nCourse: ${booking.course}\nSchedule: ${booking.schedule}\nName: ${
          booking.name || "Not shared"
        }\nPhone: ${booking.phone || "Not shared"}\nNote: ${booking.note || "No note"}`,
      ),
    [booking],
  );

  const updateBooking = (field: keyof BookingState, value: string) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  return (
    <div ref={pageRef} className="site-shell relative min-h-screen overflow-x-hidden text-white">
      <AuroraCanvas reducedMotion={reducedMotion} />
      <ParticleField />

      <header
        className={`site-navbar fixed left-1/2 top-0 z-50 w-[min(1180px,calc(100%-24px))] -translate-x-1/2 transition-all duration-500 ${
          scrolled ? "site-navbar-scrolled glow-border" : "glass-panel"
        }`}
      >
        <nav className="flex items-center justify-between gap-4 px-4 py-3 md:px-5">
          <a
            href="#home"
            className="flex min-w-0 items-center gap-3"
            aria-label="GENIUS GROUPS home"
          >
            <BrandMark />
            <span className="min-w-0 leading-none">
              <span className="block text-base font-black tracking-wide md:text-lg">GENIUS</span>
              <span className="block text-[10px] font-semibold tracking-[0.42em] text-white/70">
                GROUPS
              </span>
            </span>
          </a>

          <div
            className="nav-link-tray hidden items-center gap-1 lg:grid"
            style={
              {
                "--nav-index": activeNavIndex,
                "--nav-count": navLinks.length,
              } as CSSProperties
            }
          >
            <span className="nav-active-indicator" aria-hidden="true" />
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`nav-link rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  activeSection === link.href.slice(1)
                    ? "nav-link-active text-white"
                    : "text-white/68 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              className="neon-button hidden rounded-full px-4 py-2.5 text-sm font-bold md:inline-flex"
              data-magnetic
            >
              <MessageCircle className="h-4 w-4" />
              Enquire
            </a>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/8 text-white lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 px-4 pb-4 pt-2 lg:hidden">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`rounded-2xl px-3 py-2 text-sm transition ${
                    activeSection === link.href.slice(1)
                      ? "bg-white/12 text-white"
                      : "text-white/76 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div
        className="chapter-rail fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 xl:flex"
        aria-label="Chapter navigation"
      >
        {navLinks.map((link, index) => {
          const isActive = activeSection === link.href.slice(1);

          return (
            <a
              key={link.href}
              href={link.href}
              className={`chapter-node group ${isActive ? "chapter-node-active" : ""}`}
              aria-label={link.label}
              style={{ "--chapter-index": index } as CSSProperties}
            >
              <span className="chapter-node-dot" />
              <span className="chapter-node-label">{link.label}</span>
            </a>
          );
        })}
      </div>

      <main>
        <section
          id="home"
          className="hero-section cinematic-hero relative overflow-hidden px-4 pb-14 pt-0 md:px-6 md:pb-18"
          data-hero-story
        >
          <div className="hero-cover-bg absolute inset-0" data-hero-cover aria-hidden="true" />
          <span className="hero-ghost-word" aria-hidden="true">
            GENIUS
          </span>
          <span className="hero-light-streak hero-light-streak-one" aria-hidden="true" />
          <span className="hero-light-streak hero-light-streak-two" aria-hidden="true" />
          <HeroCinematicSequence />

          <div
            className={`${MAX_WIDTH} relative z-10 grid min-h-[100svh] items-center gap-0 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]`}
          >
            <div
              className="hero-copy-highlight relative max-w-3xl space-y-7 pt-20 md:pt-24 lg:pb-6"
              data-hero-copy
              data-reveal-group
            >
              <div
                className="hero-eyebrow inline-flex max-w-full items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/78 backdrop-blur-xl"
                data-reveal-child
              >
                <Sparkles className="h-3.5 w-3.5 text-[#00E5FF]" />
                Skills - Technology - Creativity
              </div>

              <div className="space-y-5" data-reveal-child>
                <h1 className="hero-title max-w-4xl text-balance text-4xl font-black leading-[1.02] tracking-normal sm:text-5xl md:text-6xl xl:text-7xl">
                  <KineticText text="One academy." />
                  <span className="hero-outline-word block">Endless opportunities.</span>
                  <span className="hero-outline-word block">Build your future.</span>
                </h1>
                <p className="hero-lead max-w-2xl text-base leading-8 md:text-xl">
                  A scroll-driven learning universe for Genius Academy, CST Computers, and Kalai
                  Fashion Academy, built to make every course feel alive before the first call.
                </p>
              </div>

              <div className="flex flex-wrap gap-3" data-reveal-child>
                <a
                  href="#courses"
                  className="neon-button rounded-full px-6 py-3.5 text-sm font-bold"
                  data-magnetic
                >
                  Explore courses
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  className="neon-outline rounded-full px-6 py-3.5 text-sm font-bold"
                  data-magnetic
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp enquiry
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-12 md:px-6" data-reveal>
          <div className={`${MAX_WIDTH} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
            {trustStats.map((stat) => (
              <StatTile key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        <section id="academies" className={SECTION_PAD}>
          <SectionHeading
            eyebrow="Three academies. One ecosystem."
            title="A cinematic learning path for every ambition."
            body="Each GENIUS GROUPS academy has its own focus, but the experience feels connected: counseling, hands-on practice, visible progress, and confident next steps."
          />

          <div className={`${MAX_WIDTH} mt-10 space-y-5`}>
            {academyStories.map((academy, index) => (
              <AcademyBand key={academy.name} academy={academy} index={index} />
            ))}
          </div>
        </section>

        <section id="why-us" className={SECTION_PAD}>
          <div className={`${MAX_WIDTH} grid gap-8 lg:grid-cols-[0.78fr_1.22fr]`}>
            <div data-reveal>
              <SectionHeading
                align="left"
                eyebrow="Why choose us"
                title="Built for learners who want momentum, not just classes."
                body="Clear guidance, real practice, and trainer feedback make every learner's progress easier to see and easier to continue."
              />
              <div className="image-frame mt-7 aspect-[16/10] overflow-hidden rounded-[28px] border border-white/12">
                <img
                  src={futureBannerImage}
                  alt="Students building their future with GENIUS GROUPS"
                  className="h-[112%] w-full object-cover"
                  data-parallax="-7"
                  loading="lazy"
                  width={1200}
                  height={700}
                />
              </div>
            </div>

            <div className="bento-grid grid gap-4 sm:grid-cols-2">
              {whyChooseUs.map((item) => (
                <FeatureCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        <section id="courses" className={SECTION_PAD} data-course-story>
          <div className={MAX_WIDTH}>
            <div
              className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
              data-reveal
            >
              <SectionHeading
                align="left"
                eyebrow="Course carousel"
                title="Explore the programs students ask for most."
                body="From English and coding to tailoring and Aari work, every program is built around practice, confidence, and next-step readiness."
              />
            </div>

            <div
              className="course-mosaic mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6"
              aria-label="Popular GENIUS GROUPS courses"
              data-course-grid
            >
              {courses.map((course, index) => (
                <CourseCard key={course.name} course={course} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="stories" className={SECTION_PAD}>
          <SectionHeading
            eyebrow="Success stories"
            title="Students arrive with goals. They leave with proof."
            body="Confidence, employable skills, and creative portfolios are the outcomes that make GENIUS GROUPS feel alive."
          />

          <div className={`${MAX_WIDTH} mt-10 grid gap-4 md:grid-cols-3`}>
            {testimonials.map((story) => (
              <TestimonialCard key={story.name} {...story} />
            ))}
          </div>
        </section>

        <section id="gallery" className={SECTION_PAD}>
          <div className={MAX_WIDTH}>
            <SectionHeading
              eyebrow="Gallery"
              title="A real campus mood across skills, tech, and creativity."
              body="Step into a learning space shaped by conversation labs, computer practice, fashion studios, and creative projects."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryItems.map((item) => (
                <GalleryCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </section>

        <section className={SECTION_PAD}>
          <div className={MAX_WIDTH}>
            <SectionHeading
              eyebrow="Mentors"
              title="Guides for communication, technology, and fashion craft."
              body="Mentors are grouped by academy so learners quickly understand who will help them move forward."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.name} {...mentor} />
              ))}
            </div>
          </div>
        </section>

        <section id="admissions" className={SECTION_PAD}>
          <div className={`${MAX_WIDTH} grid gap-6 lg:grid-cols-[0.95fr_1.05fr]`}>
            <div data-reveal>
              <SectionHeading
                align="left"
                eyebrow="Admission process"
                title="Four simple steps from interest to first class."
                body="The admissions journey is intentionally lightweight so students can move from curiosity to action without friction."
              />
              <div className="mt-8 space-y-4">
                {admissionSteps.map((step, index) => (
                  <AdmissionStep key={step.title} step={step} index={index} />
                ))}
              </div>
            </div>

            <BookingPanel
              booking={booking}
              bookingStep={bookingStep}
              updateBooking={updateBooking}
              setBookingStep={setBookingStep}
              whatsappMessage={whatsappMessage}
            />
          </div>
        </section>

        <section className="px-4 py-10 md:px-6" data-reveal>
          <div className={`${MAX_WIDTH} grid gap-3 sm:grid-cols-2 lg:grid-cols-4`}>
            {liveCounters.map((counter) => (
              <LiveCounter key={counter.label} {...counter} />
            ))}
          </div>
        </section>

        <section id="faq" className={SECTION_PAD}>
          <div className={`${MAX_WIDTH} grid gap-8 lg:grid-cols-[0.82fr_1.18fr]`}>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Clear answers before you call."
              body="A few essentials are here, and the admissions team can help with the exact batch and course details."
            />

            <div className="space-y-3" data-reveal>
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.question}
                  faq={faq}
                  index={index}
                  isOpen={openFaq === index}
                  onToggle={() => setOpenFaq((current) => (current === index ? -1 : index))}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="final-cta-section section-space relative overflow-hidden px-4 pb-8 md:px-6"
        >
          <span className="final-cta-giant" aria-hidden="true">
            FUTURE
          </span>
          <div className={`${MAX_WIDTH} relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]`}>
            <div
              className="final-cta-card glass-strong glow-border rounded-[32px] p-5 md:p-8"
              data-reveal
            >
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#00E5FF]">
                Final chapter
              </p>
              <h2 className="mt-4 text-4xl font-black leading-none md:text-6xl">
                Start your next
                <span className="block text-gradient">future story.</span>
              </h2>
              <div className="mt-7 grid gap-3">
                <ContactLine
                  icon={Phone}
                  label="Phone / WhatsApp"
                  value={CONTACT.phone}
                  href="tel:+919750097500"
                />
                <ContactLine
                  icon={Mail}
                  label="Email"
                  value={CONTACT.email}
                  href={`mailto:${CONTACT.email}`}
                />
                <ContactLine icon={MapPin} label="Location" value={CONTACT.location} />
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${CONTACT.whatsapp}`}
                  className="neon-button rounded-full px-5 py-3 text-sm font-bold"
                  data-magnetic
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href="#admissions"
                  className="neon-outline rounded-full px-5 py-3 text-sm font-bold"
                  data-magnetic
                >
                  <ArrowRight className="h-4 w-4" />
                  Book admission
                </a>
              </div>
            </div>

            <CampusMapCard />
          </div>
        </section>
      </main>

      <footer className="px-4 pb-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 text-sm text-white/64 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-[#00E5FF]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-bold text-white">GENIUS GROUPS</span>
              <span>Genius Academy - CST Computers - Kalai Fashion Academy</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="#courses"
              className="inline-flex min-h-8 min-w-8 items-center justify-center hover:text-white"
            >
              Courses
            </a>
            <a
              href="#faq"
              className="inline-flex min-h-8 min-w-8 items-center justify-center hover:text-white"
            >
              FAQ
            </a>
            <a
              href={`mailto:${CONTACT.email}`}
              className="inline-flex min-h-8 min-w-8 items-center justify-center hover:text-white"
            >
              {CONTACT.email}
            </a>
          </div>
        </div>
      </footer>

      <a
        href={`https://wa.me/${CONTACT.whatsapp}`}
        aria-label="WhatsApp GENIUS GROUPS"
        className="floating-whatsapp neon-button h-14 w-14 rounded-full p-0"
        data-magnetic
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
