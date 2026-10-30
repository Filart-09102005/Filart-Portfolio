import Image from "next/image";
import Link from "next/link";
import Lanyard from "./Lanyard";
import AnimatedContent from "./AnimatedContent";
import GearScrollReveal from "./GearScrollReveal";
import ProjectScrollCue from "./ProjectScrollCue";
import ProjectHorizontalScroll from "./ProjectHorizontalScroll";
import AboutInteractiveDetails from "./AboutInteractiveDetails";
import BounceCards from "./BounceCards";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import RefineFrame from "./RefineFrame";
import ExperienceTimeline from "./ExperienceTimeline";
import RecommendationBoard from "./RecommendationBoard";
import ConsultingRevealSequence from "./ConsultingRevealSequence";
import AboutFolders from "./AboutFolders";
import HomeFeaturedShowcase from "./HomeFeaturedShowcase";
import HomeIntroSequence from "./HomeIntroSequence";
import GitHubContributionActivity from "./GitHubContributionActivity";
import GearPageReveal from "./GearPageReveal";
import StackPageReveal from "./StackPageReveal";

const ABOUT_IMAGE_GROUPS = [
  {
    number: "01",
    label: "DESK SETUP",
    title: "A space to focus.",
    description: "The tools I use to study, code, and build practical systems.",
    images: [
      {
        src: "/gear/asus-tuf-a15.png",
        alt: "ASUS TUF Gaming A15 laptop",
        title: "ASUS TUF Gaming A15",
        description: "My main machine for studying, coding, and building projects.",
      },
      {
        src: "/gear/aula-s75-pro.png",
        alt: "AULA S75 Pro keyboard",
        title: "AULA S75 Pro",
        description: "Mechanical keys for long coding and study sessions.",
      },
      {
        src: "/gear/huawei-wireless-mouse.png",
        alt: "HUAWEI wireless mouse",
        title: "HUAWEI Mouse",
        description: "A reliable mouse for moving between code and tasks.",
      },
      {
        src: "/gear/desky-sit-stand-desk.png",
        alt: "Desky sit-stand desk",
        title: "DESKY Sit-Stand Desk",
        description: "Room to focus and switch positions during long sessions.",
      },
      {
        src: "/gear/asus-dual-monitors.png",
        alt: "ASUS dual monitor setup",
        title: "ASUS Dual Monitors",
        description: "Extra space for code, docs, and project tools side by side.",
      },
    ],
  },
  {
    number: "02",
    label: "EVERYDAY CARRY",
    title: "Always within reach.",
    description: "My phone and earbuds for the everyday moments between projects.",
    images: [
      {
        src: "/gear/vivo-x200-pro.png",
        alt: "Vivo X200 Pro phone",
        title: "VIVO X200 Pro",
        description: "My everyday phone for photos, notes, and ideas on the go.",
      },
      {
        src: "/gear/vivo-wireless-earbuds.png",
        alt: "Vivo wireless earbuds",
        title: "VIVO Wireless Earbuds",
        description: "Always close for listening to my favorite music between tasks.",
      },
    ],
  },
  {
    number: "03",
    label: "A LITTLE ABOUT ME",
    title: "Hans Filart.",
    description: "A BSIT student, full-stack developer, and lifelong learner from the Philippines.",
    images: [{
      src: "/hans-profile-card.svg",
      alt: "Hans Filart portfolio profile card",
      title: "A little about me",
      description: "BSIT student · Full-stack developer",
    }],
  },
];

const ABOUT_HOBBIES = [
  "Online games",
  "Coding side projects",
  "Pickleball",
  "Music",
  "Bonding with family and friends",
  "Exploring new technology",
  "Learning new skills",
];

const ABOUT_WORK = [
  "Web development",
  "Full-stack systems",
  "Mobile applications",
  "Business tools and dashboards",
  "Database and API integration",
  "UI motion and interaction",
  "Open to web commissions",
];

const CERTIFICATES = [
  {
    number: "01",
    type: "MEMBERSHIP",
    title: "PSITS Region XI Membership",
    issuer: "Philippine Society of Information Technology Students · Davao Region",
    description: "Membership recognition for joining PSITS Region XI during the 2024–2025 academic year.",
    date: "Academic year 2024–2025 · March 10, 2025",
    src: "/certificates/38.jpg",
    width: 4250,
    height: 3006,
    alt: "Certificate of membership in the Philippine Society of Information Technology Students, Davao Region, awarded to Hans Kurvey Filart.",
  },
  {
    number: "02",
    type: "WEBINAR",
    title: "Introduction to Blockchain",
    issuer: "Department of Information and Communications Technology · Region XI",
    description: "Attendance recognition for a four-hour introduction to blockchain webinar.",
    date: "Four-hour webinar · October 5, 2026",
    src: "/certificates/DICT%20Certificate%20of%20Attendance%20(1).png",
    width: 1491,
    height: 1055,
    alt: "DICT Region XI certificate of attendance for the four-hour Introduction to Blockchain webinar.",
  },
  {
    number: "03",
    type: "MICRO-CREDENTIAL",
    title: "Introduction to AI Literacy and Responsible Use",
    issuer: "ACHIEVE micro-credentials",
    description: "A micro-credential covering AI literacy and responsible use of AI.",
    date: "Issued September 16, 2026",
    src: "/certificates/Hans_Kurvey_AI_Literacy_Certificate.png",
    width: 2924,
    height: 2070,
    alt: "Certificate of completion for Introduction to AI Literacy and Responsible Use, awarded to Hans Kurvey Filart.",
  },
  {
    number: "04",
    type: "PARTICIPATION",
    title: "AI Evaluations in Education: Safety, Effectiveness, and Impact",
    issuer: "Dialogues for Design · AI in Learning webinar series, Session 4",
    description: "Participation in a discussion about evaluating AI safety, effectiveness, and impact in education.",
    date: "October 28, 2026 · Arizona State University Design Institute",
    src: "/certificates/Hans_Kurvey_Participation.png",
    width: 2160,
    height: 1215,
    alt: "Certificate of participation in AI Evaluations in Education: Safety, Effectiveness, and Impact, awarded to Hans Kurvey Chan Filart.",
  },
  {
    number: "05",
    type: "2ND PLACE · DEBUGGING",
    title: "Innovation Week 2026 Debugging Contest",
    issuer: "Cor Jesu College, Inc. · Association of Computer Studies Students",
    description: "Awarded second place in the Innovation Week 2026 Debugging Contest.",
    date: "January 29, 2026",
    src: "/certificates/IMG_20260129_171609.jpg",
    width: 2296,
    height: 4080,
    alt: "Photo of Hans Filart's certificate of achievement for second place in the Innovation Week 2026 Debugging Contest.",
  },
  {
    number: "06",
    type: "APPRECIATION",
    title: "DASURECO 44th Annual General Membership Assembly",
    issuer: "Davao del Sur Electric Cooperative, Inc.",
    description: "Recognition for supporting registration at DASURECO’s 44th annual assembly.",
    date: "Registration operator · July 26, 2026",
    src: "/certificates/IMG_20260726_125352.jpg",
    width: 2296,
    height: 4080,
    alt: "Photo of Hans Filart's certificate of appreciation for serving as a registration operator at the DASURECO 44th Annual General Membership Assembly.",
  },
];

function AboutImageStackCard({ item }) {
  return (
    <ScrollStackItem itemClassName="about-image-stack__card">
      <div className="about-image-stack__copy">
        <span className="about-image-stack__eyebrow">{item.number} / {item.label}</span>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>
      <div className={`about-image-stack__media about-image-stack__media--single${item.label === "A LITTLE ABOUT ME" ? " about-image-stack__media--profile" : ""}`}>
        <div className="about-image-stack__tile about-image-stack__tile--captioned">
          <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width: 700px) 82vw, 48vw" />
          <div className="about-image-stack__tile-copy">
            <h4>{item.image.title}</h4>
            <p>{item.image.description}</p>
          </div>
        </div>
      </div>
    </ScrollStackItem>
  );
}

function IdentityBlock() {
  return (
    <div className="identity-block">
      <div className="identity-rule" aria-hidden="true" />
      <h1 className="identity-name" id="hero-title">
        <span className="identity-mask">
          <span className="identity-line">HANS</span>
        </span>
        <span className="identity-mask">
          <span className="identity-line">FILART</span>
        </span>
      </h1>
      <p className="identity-role">Full-Stack Developer <span>·</span> BSIT Student</p>
      <p className="identity-statement">Building digital products with purpose.</p>
    </div>
  );
}

export function HeroCopy({ className = "", summary = "", showActions = true, showScrollCue = true }) {
  return (
    <div className={`hero-copy${className ? ` ${className}` : ""}`}>
      {summary && <p className="identity-kicker home-page-index">05 / HOME</p>}
      <IdentityBlock />
      {summary && (
        <div className="home-profile-summary">
          <p className="home-profile-summary__label">A LITTLE ABOUT ME</p>
          <p className="home-profile-summary__copy">{summary}</p>
          <nav className="home-profile-socials" aria-label="Hans Filart social profiles">
            <a href="https://www.facebook.com/hanschan.filart" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M13.6 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6H17V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.5v3.2h2.8V21h3.3Z" fill="currentColor" /></svg>
              <span>Facebook</span>
            </a>
            <a href="https://www.instagram.com/chanfilart?xtok=NnRwcHhtdm8wYmh6" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.7" cy="6.6" r="1.1" fill="currentColor" /></svg>
              <span>Instagram</span>
            </a>
            <a href="https://github.com/Filart-09102005" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.3.8-.6v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 2.1 3.9 1.5.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3 0 0 .9-.3 3 1.1a10.4 10.4 0 0 1 5.5 0c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2v2.9c0 .3.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" /></svg>
              <span>GitHub</span>
            </a>
          </nav>
        </div>
      )}
      {showActions && (
        <div className="hero-actions">
          <Link className="button button-primary" href="/Projects">Explore selected work <span aria-hidden="true">↓</span></Link>
          <Link className="button button-text" href="/AboutMe">A little about me <span aria-hidden="true">↗</span></Link>
        </div>
      )}
      {showScrollCue && (
        <p className="hero-footnote"><span>SCROLL TO EXPLORE</span><span className="scroll-mark" aria-hidden="true">↓</span></p>
      )}
    </div>
  );
}

const homeOverviewItems = [
  { number: "01", title: "Recommendations", description: "Perspectives on my portfolio, projects, and how I work.", href: "/Recommendation" },
  { number: "02", title: "Experience", description: "Study, practice, and progress so far.", href: "/Experience" },
  { number: "03", title: "Projects", description: "Selected work and interface explorations.", href: "/Projects" },
  { number: "04", title: "Gear", description: "A look at my everyday setup.", href: "/Gear" },
  { number: "06", title: "Stacks", description: "Tools and technologies I work with.", href: "/Stack" },
  { number: "07", title: "About me", description: "A little more about the person behind the work.", href: "/AboutMe" },
  { number: "08", title: "Consulting", description: "Have a project, idea, or question to discuss?", href: "/Consulting" },
  { number: "09", title: "Certifications", description: "Credentials and continued learning.", href: "/Certification" },
];

const HOME_FEATURED_STACK = [
  { name: "PHP", mark: "PHP", area: "BACKEND LANGUAGE", highlight: "MOST USED", accent: "#a8b99f" },
  { name: "Laravel", mark: "LA", area: "PHP FRAMEWORK", highlight: "MOST USED", accent: "#d18b7d" },
  { name: "React + Vite", mark: "R+V", area: "WEB DEVELOPMENT", highlight: "MOST USED", accent: "#79cbe0" },
  { name: "MySQL", area: "DATABASE", highlight: "BEST DATABASE" },
  { name: "Supabase", area: "MOBILE BACKEND", highlight: "BEST FOR MOBILE" },
  { name: "Cursor", area: "DEVELOPMENT TOOL", highlight: "BEST TOOL" },
];

function HomeOverviewRow({ item }) {
  const content = (
    <>
      <span className="home-overview__number">{item.number}</span>
      <span className="home-overview__title">{item.title}</span>
      <span className="home-overview__description">{item.description}</span>
      {item.status ? (
        <span className="home-overview__status">{item.status}</span>
      ) : (
        <span className="home-overview__arrow" aria-hidden="true">↗</span>
      )}
    </>
  );

  const row = item.href ? (
    <Link className="home-overview__row" href={item.href}>
      {content}
    </Link>
  ) : (
    <div className="home-overview__row home-overview__row--soon">{content}</div>
  );

  return row;
}

function HomeFeaturedSnapshot() {
  return (
    <HomeFeaturedShowcase
      projects={HOME_FEATURED_PROJECTS}
      certificates={CERTIFICATES.slice(0, 3)}
      stack={HOME_FEATURED_STACK}
    />
  );
}

export function HomeContent() {
  return (
    <>
      <HomeIntroSequence afterRays={<GitHubContributionActivity />}>
        <div className="hero-grid hero-grid--home-profile">
          <div className="hero-profile-visual">
            <div className="hero-profile-stage">
              <Image
                className="home-profile-image"
                src="/profile/hansfilart.png"
                alt="Hans Filart"
                width={768}
                height={1344}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 760px) 36vw, (max-width: 1200px) 34vw, 330px"
              />
            </div>
          </div>
          <div data-site="hero-copy">
            <HeroCopy
              className="hero-copy--home"
              showActions={false}
              showScrollCue={false}
              summary="I’m a BSIT student and full-stack developer from the Philippines who loves coding and turning ideas into useful web and mobile experiences. I enjoy working across the stack and learning with every project."
            />
          </div>
        </div>
      </HomeIntroSequence>

      <HomeFeaturedSnapshot />

      <GearScrollReveal
        className="home-overview-reveal"
        targetSelector=".section-heading, .home-overview__intro, .home-overview__row"
        distance={18}
        blur={6}
        duration={0.64}
        stagger={0.045}
        threshold={0.2}
        requireScroll
      >
        <section className="home-overview content-section" aria-labelledby="home-overview-title">
          <div className="section-heading">
            <p className="section-kicker"><span>00</span> / PORTFOLIO INDEX</p>
            <span className="section-year">A QUICK OVERVIEW</span>
          </div>
          <div className="home-overview__intro">
            <h2 id="home-overview-title">Explore the<br /><span>portfolio.</span></h2>
            <p>A quick guide to what I build, what I’m learning, and where to find me.</p>
          </div>
          <div className="home-overview__list">
            {homeOverviewItems.map((item) => <HomeOverviewRow key={item.number} item={item} />)}
          </div>
        </section>
      </GearScrollReveal>
    </>
  );
}

const PROJECTS = [
    {
      number: "01",
      group: "personal",
      name: "Pickle App",
      type: "PERSONAL PROJECT",
      description: "A personal pickleball platform for tournaments and Open Play events.",
      href: "https://pickleapp.online",
      linkLabel: "Visit live site",
      visual: "pickle",
      image: "/personal-projects/pickleapp.png",
      imageAlt: "Pickle App website for pickleball events and open play",
    },
    {
      number: "02",
      group: "personal",
      name: "Admin Dashboard Template",
      type: "ADMIN DASHBOARD TEMPLATE",
      description: "A dashboard template for tracking key metrics and managing business operations.",
      href: "https://admin-dashboard-template-five-inky.vercel.app/",
      linkLabel: "Visit live site",
      visual: "dashboard",
      image: "/personal-projects/admin-dashboard.png",
      imageAlt: "Dark admin dashboard with revenue, orders, and transaction metrics",
    },
    {
      number: "03",
      group: "personal",
      name: "Hansflix",
      type: "STREAMING WEB APP",
      description: "A Netflix-inspired site for browsing movies and series.",
      href: "https://hansflix.vercel.app/",
      linkLabel: "Visit live site",
      visual: "hansflix",
      image: "/personal-projects/hansflix.png",
      imageAlt: "Hansflix streaming homepage inspired by Netflix",
    },
    {
      number: "04",
      group: "client",
      name: "JN Grill",
      type: "RESTAURANT POS SYSTEM",
      description: "A point-of-sale system for managing restaurant orders and sales.",
      href: "https://jngrill.com",
      linkLabel: "Visit live site",
      visual: "grill",
      image: "/client/jngrill.png",
      imageAlt: "JN Grill point-of-sale system login page",
    },
    {
      number: "05",
      group: "school",
      name: "SCMBI Health Kiosk",
      type: "CAPSTONE PROJECT",
      description: "A student health kiosk that uses IoT sensors to measure height, weight, heart rate, SpO₂, and body temperature.",
      monogram: "H+",
      visual: "health",
    },
    {
      number: "06",
      group: "school",
      name: "Barcode Attendance System",
      type: "SCHOOL WEB APP",
      description: "A web-based school system for recording attendance with barcode scans.",
      visual: "barcode",
      image: "/mobileapp/barcode.jpg",
      imageAlt: "Barcode attendance app login screen",
      imageFit: "contain",
    },
    {
      number: "07",
      group: "mobile",
      name: "QR Code Attendance App",
      type: "CLUB ATTENDANCE APP",
      description: "A QR code attendance app used by clubs to record member attendance.",
      monogram: "QR",
      visual: "qr",
    },
    {
      number: "08",
      group: "mobile",
      name: "OTTI Finance",
      type: "MOBILE APP",
      description: "Manage income, expenses, and balances across cash, cards, and e-wallets.",
      href: "https://expo.dev/accounts/hansieee/projects/budget-students/builds/986118fc-a4c8-454c-8df2-34cd13449e97",
      linkLabel: "Install APK",
      visual: "finance",
      image: "/mobileapp/oti.jpg",
      imageAlt: "OTTI student budget app login screen",
      imageFit: "contain",
    },
    {
      number: "09",
      group: "web",
      name: "Formora",
      type: "WEB APP",
      description: "Create forms for evaluations, quizzes, and other needs.",
      monogram: "F",
      visual: "forms",
      image: "/personal-projects/formora.png",
      imageAlt: "Formora form builder interface for creating and reviewing forms",
    },
];

const HOME_FEATURED_PROJECTS = PROJECTS.filter((project) => ["01", "04", "08"].includes(project.number));

export function ProjectsContent() {
  const projects = PROJECTS;
  const projectGroups = [
    { id: "personal", number: "01", title: "Personal" },
    { id: "client", number: "02", title: "Client" },
    { id: "school", number: "03", title: "School" },
    { id: "mobile", number: "04", title: "Mobile App" },
    { id: "web", number: "05", title: "Web-Based" },
  ];
  const getProjectGroup = (id) => projectGroups.find((group) => group.id === id);

  return (
    <section className="projects-page content-section" aria-labelledby="projects-title">
      <header className="projects-page__header">
        <AnimatedContent
          className="projects-page__header-reveal"
          stagger={0.38}
          duration={1.25}
          distance={20}
          blur={8}
          ease="power2.out"
          threshold={0.1}
        >
          <div className="projects-page__eyebrow">
            <p><span>03</span> / PROJECTS</p>
            <span>CLIENT, STUDENT &amp; PERSONAL WORK</span>
          </div>
          <div className="projects-page__intro">
            <h1 id="projects-title">Selected<br /><span>projects.</span></h1>
            <span className="projects-page__title-rule" aria-hidden="true" />
            <p>Personal projects, client systems, school work, mobile apps, and web tools, organized by the kind of work they represent.</p>
          </div>
        </AnimatedContent>
        <ProjectScrollCue />
      </header>

      <ProjectHorizontalScroll>
        {projects.map((project) => {
          const group = getProjectGroup(project.group);
          const groupCount = projects.filter((item) => item.group === project.group).length;

          return (
            <article className={`project-card project-card--${project.visual}`} data-project-item key={project.number}>
              <div
                className={`project-card__visual${project.image ? " project-card__visual--image" : ""}`}
                data-project-visual
                aria-hidden={project.image ? undefined : "true"}
              >
                {project.image ? (
                  <>
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 700px) 82vw, 33vw"
                      className={`project-card__image${project.imageFit ? ` project-card__image--${project.imageFit}` : ""}`}
                    />
                    <span className="project-card__visual-index">{project.number} / PROJECT</span>
                    <span className="project-card__visual-type">{project.type}</span>
                  </>
                ) : (
                  <>
                    <span className="project-card__visual-index">{project.number} / PROJECT</span>
                    <span className="project-card__monogram">{project.monogram}</span>
                    <span className="project-card__visual-type">{project.type}</span>
                  </>
                )}
              </div>
              <span className="project-card__marker" data-project-marker aria-hidden="true">{project.number}</span>
              <div className="project-card__copy" data-project-copy>
                <div className="project-card__meta">
                  <span>{group.number} / PORTFOLIO</span>
                  <span>{group.title}</span>
                  <span>{String(groupCount).padStart(2, "0")} PROJECTS</span>
                </div>
                <span className="project-card__type">{project.type}</span>
                <h2>{project.name}</h2>
                <p>{project.description}</p>
                {project.href && (
                  <a href={project.href} target="_blank" rel="noreferrer" aria-label={`${project.linkLabel || "Visit live site"} — ${project.name}`}>
                    {project.linkLabel || "Visit live site"} <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </ProjectHorizontalScroll>
    </section>
  );
}

export function AboutMeContent() {
  const principles = [
    { number: "01", title: "Purposeful work", description: "Start with a real need and make every part of the solution useful." },
    { number: "02", title: "Thoughtful process", description: "Learn, plan, build, and improve through each project." },
    { number: "03", title: "Keep progressing", description: "Stay curious and let each new challenge teach you something." },
  ];

  return (
    <section className="about-page content-section" aria-labelledby="about-title">
      <GearScrollReveal
        className="about-page__hero-reveal"
        stagger={0.14}
        distance={20}
        blur={7}
        duration={0.82}
        threshold={0.14}
      >
      <div className="about-page__hero">
        <div className="about-page__copy">
          <p className="about-page__eyebrow">07 / ABOUT ME · HANS FILART</p>
          <h1 id="about-title">About<br /><span>me.</span></h1>
          <p className="about-page__lead">I&apos;m Hans, a BSIT student and developer who learns by building.</p>
          <p className="about-page__body">My work includes client systems, school projects, and ideas I build to explore web and mobile development. I care about clarity, useful interactions, and the details that make tools feel easy to use.</p>
          <p className="about-page__method"><span aria-hidden="true" /> LEARN&nbsp; / &nbsp;DESIGN&nbsp; / &nbsp;BUILD&nbsp; / &nbsp;IMPROVE</p>
        </div>

        <aside className="about-page__lanyard-stage" aria-label="Interactive hanging ID card for Hans Filart. Tap or drag the card to flip it.">
          <Lanyard
            frontImage="/profile/hansfilart.png"
            backImage="/hans-profile-back.svg"
            cardColor="#171a17"
            orientation="portrait"
            finish="matte"
            cornerRadius={0.34}
            size={0.68}
            strapLength={0.52}
            strapColor="#20231f"
            strapWidth={0.48}
            metal="silver"
            gravity={0.9}
            damping={0.58}
            elasticity={0.46}
            breeze={0.42}
            className="about-page-lanyard"
          />
          <span className="about-page-lanyard-cue" aria-hidden="true">
            <span>↻</span> TAP OR DRAG TO FLIP
          </span>
        </aside>
      </div>
      </GearScrollReveal>

      <GearScrollReveal
        className="about-principles-reveal"
        stagger={0.12}
        distance={18}
        blur={6}
        duration={0.76}
        threshold={0.18}
      >
      <div className="about-principles">
        {principles.map((principle) => (
          <article key={principle.number}>
            <span className="about-principles__number">{principle.number}</span>
            <span className="about-principles__shape" aria-hidden="true" />
            <h2>{principle.title}</h2>
            <p>{principle.description}</p>
          </article>
        ))}
      </div>
      </GearScrollReveal>
      <GearScrollReveal distance={18} blur={6} duration={0.76} threshold={0.18}>
        <AboutInteractiveDetails />
      </GearScrollReveal>

      <section className="about-image-stack-section" aria-labelledby="about-image-stack-title">
        <GearScrollReveal
          className="about-image-stack-section__header-reveal"
          stagger={0.12}
          distance={18}
          blur={6}
          duration={0.76}
          threshold={0.18}
        >
        <header className="about-image-stack-section__header">
          <p className="about-image-stack-section__eyebrow">A FEW THINGS IN MY WORLD</p>
          <h2 id="about-image-stack-title">My everyday snapshots.</h2>
          <p>A quick look at the setup and daily carry that make room for learning, building, and everything in between.</p>
        </header>
        </GearScrollReveal>
        <ScrollStack
          className="about-image-stack"
          useWindowScroll
          stackPosition="15%"
          itemDistance={74}
          itemStackDistance={26}
          itemScale={0.035}
          dimAmount={0.16}
          smoothScroll={false}
          holdDistance={160}
        >
          {ABOUT_IMAGE_GROUPS.flatMap((group) =>
            group.images.map((image) => (
              <AboutImageStackCard item={{ ...group, image }} key={image.src} />
            )),
          )}
        </ScrollStack>
      </section>

      <section className="about-hobbies" aria-label="What I do and my hobbies">
        <GearScrollReveal
          className="about-hobbies__reveal"
          stagger={0.16}
          distance={18}
          blur={7}
          duration={0.8}
          threshold={0.16}
        >
          <AboutFolders hobbies={ABOUT_HOBBIES} work={ABOUT_WORK} />
        </GearScrollReveal>
      </section>
    </section>
  );
}

export function ExperienceContent() {
  const experiences = [
    {
      id: "bsit-student",
      type: "CURRENT STUDY",
      title: "BSIT Student",
      period: "ONGOING",
      description: "Studying Information Technology while building practical software and growing as a full-stack developer.",
    },
    {
      id: "pickle-app",
      type: "PERSONAL PROJECT",
      title: "Pickle App",
      description: "A personal pickleball platform for organizing tournaments and Open Play events.",
      href: "https://pickleapp.online",
      linkLabel: "Visit live site",
    },
    {
      id: "admin-dashboard",
      type: "PERSONAL PROJECT",
      title: "Admin Dashboard Template",
      description: "A dashboard template for tracking key metrics and managing business operations.",
      href: "https://admin-dashboard-template-five-inky.vercel.app/",
      linkLabel: "Visit live site",
    },
    {
      id: "hansflix",
      type: "PERSONAL PROJECT",
      title: "Hansflix",
      description: "A Netflix-inspired site for browsing movies and series.",
      href: "https://hansflix.vercel.app/",
      linkLabel: "Visit live site",
    },
    {
      id: "jn-grill",
      type: "CLIENT SYSTEM",
      title: "JN Grill",
      description: "A point-of-sale system for managing restaurant orders and sales.",
      href: "https://jngrill.com",
      linkLabel: "Visit live site",
    },
    {
      id: "scmbi-health-kiosk",
      type: "CAPSTONE PROJECT",
      title: "SCMBI Health Kiosk",
      description: "A student health kiosk that uses IoT sensors to measure height, weight, heart rate, SpO₂, and body temperature.",
    },
    {
      id: "barcode-attendance",
      type: "SCHOOL WEB APP",
      title: "Barcode Attendance System",
      description: "A web-based school system for recording attendance with barcode scans.",
    },
    {
      id: "qr-attendance-app",
      type: "CLUB ATTENDANCE APP",
      title: "QR Code Attendance App",
      description: "A QR code attendance app used by clubs to record member attendance.",
    },
    {
      id: "otti-finance",
      type: "MOBILE APP",
      title: "OTTI Finance",
      description: "Manage income, expenses, and balances across cash, cards, and e-wallets.",
      href: "https://expo.dev/accounts/hansieee/projects/budget-students/builds/986118fc-a4c8-454c-8df2-34cd13449e97",
      linkLabel: "Install APK",
    },
    {
      id: "formora",
      type: "WEB APP",
      title: "Formora",
      description: "Create forms for evaluations, quizzes, and other needs.",
    },
  ];

  return (
    <section className="experience-page content-section" aria-labelledby="experience-title">
      <header className="experience-page__header">
        <AnimatedContent
          className="experience-page__eyebrow-reveal"
          distance={12}
          blur={8}
          duration={0.9}
          threshold={0.18}
        >
          <p className="experience-page__eyebrow"><span>02</span> / JOURNEY</p>
        </AnimatedContent>
        <AnimatedContent
          className="experience-page__title-reveal"
          distance={16}
          blur={8}
          duration={0.95}
          delay={0.14}
          threshold={0.18}
        >
          <h1 id="experience-title">Experience</h1>
        </AnimatedContent>
        <AnimatedContent
          className="experience-page__intro-reveal"
          distance={12}
          blur={8}
          duration={0.95}
          delay={0.28}
          threshold={0.18}
        >
          <p>As a BSIT student, I’m building experience through client systems, capstone and school projects, and independent work.</p>
        </AnimatedContent>
      </header>

      <ExperienceTimeline entries={experiences} />
    </section>
  );
}

export function RecommendationContent() {
  return <RecommendationBoard />;
}

export function ConsultingContent() {
  return <ConsultingRevealSequence><SiteFooter /></ConsultingRevealSequence>;
}

export function LinksContent() {
  const socials = [
    { number: "01", name: "facebook", symbol: "f" },
    { number: "02", name: "instagram", symbol: "◎" },
    { number: "03", name: "github", symbol: "GH" },
  ];

  return (
    <section className="social-links-page content-section" aria-labelledby="social-links-title">
      <GearScrollReveal
        className="social-links-page__header"
        stagger={0.12}
        distance={18}
        blur={6}
        duration={0.76}
        threshold={0.14}
      >
        <p className="social-links-page__eyebrow">A FEW PLACES TO FIND ME</p>
        <h1 id="social-links-title">Social links</h1>
        <p>Find me around the web and follow along as I learn, build, and share new work.</p>
      </GearScrollReveal>
      <GearScrollReveal
        className="social-links-page__grid-reveal"
        stagger={0.14}
        distance={20}
        blur={7}
        duration={0.8}
        threshold={0.16}
      >
        <div className="social-link-grid" role="list">
          {socials.map((social) => (
            <article className={`social-link-card social-link-card--${social.name}`} key={social.name} role="listitem">
              <span className="social-link-card__number">{social.number} / SOCIAL</span>
              <div className="social-link-card__visual" aria-hidden="true">
                <span className="social-link-card__orbit" />
                <span className="social-link-card__symbol">{social.symbol}</span>
              </div>
              <div className="social-link-card__footer">
                <h2>{social.name}</h2>
                <span className="social-link-card__arrow" aria-hidden="true">↗</span>
              </div>
            </article>
          ))}
        </div>
      </GearScrollReveal>
    </section>
  );
}

const deskSetupGear = [
  {
    brand: "ASUS",
    name: "TUF Gaming A15",
    description: "My main machine for studying, coding, and building full-stack projects.",
    image: "/gear/asus-tuf-a15.png",
    alt: "Open matte-black gaming laptop with a dark display and subtle green lighting.",
  },
  {
    brand: "AULA",
    name: "S75 Pro",
    description: "Mechanical keys make long coding and study sessions more comfortable.",
    image: "/gear/aula-s75-pro.png",
    alt: "Compact dark mechanical keyboard with gray and sage accent keys.",
  },
  {
    brand: "HUAWEI",
    name: "Mouse",
    description: "A reliable wireless mouse for navigating code and moving between tasks.",
    image: "/gear/huawei-wireless-mouse.png",
    alt: "Minimal black wireless mouse photographed on a dark surface.",
  },
  {
    brand: "DESKY",
    name: "Sit-Stand Desk",
    description: "A sit-stand workspace that gives me room to focus and change position during long sessions.",
    image: "/gear/desky-sit-stand-desk.png",
    alt: "Dark wood sit-stand desk with black adjustable legs.",
  },
  {
    brand: "ASUS",
    name: "Dual Monitors",
    description: "Extra screen space for code, documentation, and project tools side by side.",
    image: "/gear/asus-dual-monitors.png",
    alt: "Two slim black monitors side by side with dark abstract screens.",
  },
];

const everydayCarryGear = [
  {
    brand: "VIVO",
    name: "X200 Pro",
    description: "My 512GB everyday phone, with a 200MP camera for photos and capturing ideas on the go.",
    image: "/gear/vivo-x200-pro.png",
    alt: "Graphite smartphone shown from the back with a prominent circular camera array.",
  },
  {
    brand: "VIVO",
    name: "Airpods",
    description: "Always close by for listening to my favorite music while I study, code, or take a break.",
    image: "/gear/vivo-wireless-earbuds.png",
    alt: "Pair of graphite wireless earbuds in an open charging case.",
  },
];

export function GearContent() {
  return <GearPageReveal deskSetupGear={deskSetupGear} everydayCarryGear={everydayCarryGear} />;
}

export function StackContent() {
  const stackGroups = [
    {
      number: "01",
      title: "Web Development",
      note: "CORE WEB STACK",
      wide: true,
      items: [
        { name: "PHP", detail: "Backend language", mark: "PHP", highlight: "MOST USED" },
        { name: "Laravel", detail: "PHP framework", mark: "L", highlight: "MOST USED" },
        { name: "React", detail: "UI library", mark: "R", highlight: "MOST USED" },
        { name: "Vite", detail: "Build tool", mark: "V", highlight: "MOST USED" },
        { name: "Next.js", detail: "React framework", mark: "N" },
        { name: "Vue", detail: "UI framework", mark: "V" },
        { name: "HTML", detail: "Web markup", mark: "H" },
        { name: "CSS", detail: "Web styling", mark: "C" },
      ],
    },
    {
      number: "02",
      title: "Mobile App Development",
      note: "CROSS-PLATFORM AND NATIVE",
      items: [
        { name: "React Native", detail: "Mobile framework", mark: "RN" },
        { name: "Kotlin", detail: "Programming language", mark: "K" },
        { name: "Java", detail: "Programming language", mark: "J" },
      ],
    },
    {
      number: "03",
      title: "Frameworks & Libraries",
      note: "UI AND COMPONENTS",
      items: [
        { name: "Tailwind CSS", detail: "CSS framework", mark: "TW" },
        { name: "daisyUI", detail: "Tailwind component library", mark: "D" },
        { name: "shadcn/ui", detail: "Reusable UI components", mark: "SH" },
        { name: "React Bits", detail: "React component library", mark: "RB" },
      ],
    },
    {
      number: "04",
      title: "Programming Languages",
      note: "ADDITIONAL LANGUAGE",
      items: [
        { name: "C++", detail: "Programming language", mark: "C++", highlight: "BEST FOR ARDUINO / IOT" },
      ],
    },
    {
      number: "05",
      title: "Databases & Backend Platforms",
      note: "DATA AND SERVICES",
      items: [
        { name: "MySQL", detail: "Relational database", mark: "MY", highlight: "BEST DATABASE" },
        { name: "Supabase", detail: "Backend platform", mark: "SU", highlight: "BEST FOR MOBILE" },
        { name: "Firebase", detail: "App development platform", mark: "FI" },
      ],
    },
    {
      number: "06",
      title: "Development tools",
      note: "EDITORS AND WORKSPACE",
      items: [
        { name: "VS Code", detail: "Code editor", mark: "VS" },
        { name: "Cursor", detail: "Code editor", mark: "CU", highlight: "BEST TOOL" },
        { name: "Antigravity", detail: "Development environment", mark: "AG" },
      ],
    },
    {
      number: "07",
      title: "AI & Authentication",
      note: "AI PLATFORMS AND ACCESS",
      items: [
        { name: "OAuth", detail: "Authorization protocol", mark: "OA" },
        { name: "OpenAI", detail: "AI models and API", mark: "AI" },
        { name: "Anthropic", detail: "Claude models and API", mark: "AN" },
      ],
    },
  ];
  const stackItems = stackGroups.flatMap((group, categoryIndex) => {
    const categoryLabels = ["WEB", "MOBILE", "LIBRARIES", "LANGUAGES", "DATA", "TOOLS", "AI / AUTH"];
    return group.items.map((item) => ({
      ...item,
      group: group.title,
      categoryLabel: categoryLabels[categoryIndex],
      categoryIndex,
    }));
  });

  return <StackPageReveal items={stackItems} />;
}

export function CertificationContent() {
  return (
    <section className="certification-page content-section" aria-labelledby="certification-title">
      <header className="certification-page__header">
        <GearScrollReveal
          className="certification-page__header-reveal"
          stagger={0.18}
          duration={0.8}
          distance={20}
          blur={8}
          initialDelay={0.12}
          ease="power2.out"
          threshold={0.1}
        >
          <div className="certification-page__eyebrow">
            <p><span>09</span> / CREDENTIALS</p>
            <span>LEARN · BUILD · GROW</span>
          </div>
          <h1 id="certification-title">Certifications</h1>
          <p>A few certificates and learning milestones from my studies, community, and ongoing development.</p>
        </GearScrollReveal>
      </header>

      <div className="certification-bounce" aria-label="Selected certificate previews">
        <GearScrollReveal
          className="certification-bounce__reveal"
          stagger={0.16}
          duration={0.72}
          distance={18}
          blur={6}
          delay={0.12}
          initialDelay={1.3}
          ease="power2.out"
          threshold={0.1}
        >
          <p className="certification-bounce__label">SELECTED CERTIFICATES · 06</p>
          <BounceCards
            images={CERTIFICATES}
            containerWidth={360}
            containerHeight={280}
            cardSize={176}
            spread={45}
            rotation={6}
            arc={8}
            animationDelay={1.5}
            animationStagger={0.08}
            borderWidth={2}
            borderColor="rgba(168, 185, 159, 0.42)"
            radius={18}
            hoverScale={1.04}
            style={{ width: "min(100%, 360px)", height: 280 }}
          />
        </GearScrollReveal>
        <GearScrollReveal
          className="certification-scroll-cue"
          duration={0.68}
          distance={12}
          blur={5}
          delay={0.08}
          initialDelay={2.5}
          ease="power2.out"
          threshold={0.1}
        >
          <span>SCROLL DOWN TO VIEW ALL CERTIFICATES</span>
          <span className="certification-scroll-cue__line" aria-hidden="true" />
        </GearScrollReveal>
      </div>

      <div className="certification-list" aria-label="Certificate details">
        {CERTIFICATES.map((certificate) => (
          <GearScrollReveal
            className="certification-entry-reveal"
            distance={18}
            blur={7}
            duration={0.76}
            delay={0.04}
            ease="power2.out"
            threshold={0.45}
            requireScroll
            key={certificate.number}
          >
            <a
              className="certification-entry"
              href={certificate.src}
              target="_blank"
              rel="noreferrer"
            >
              <RefineFrame
                className="certification-entry__frame"
                status="complete"
                aspectRatio={`${certificate.width} / ${certificate.height}`}
                width={640}
                radius={9}
                background="#f7f7f4"
                sweep={false}
                showStatus={false}
                labels={{ complete: certificate.alt }}
              >
                <Image
                  className="certification-entry__image"
                  src={certificate.src}
                  alt={certificate.alt}
                  fill
                  sizes="(max-width: 760px) calc(100vw - 48px), 44vw"
                  loading={Number(certificate.number) <= 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </RefineFrame>
              <div className="certification-entry__meta">
                <span>{certificate.number} / {certificate.type}</span>
                <span aria-hidden="true">↗</span>
              </div>
              <h2>{certificate.title}</h2>
              <p>{certificate.issuer}</p>
              <p className="certification-entry__description">{certificate.description}</p>
              <span className="certification-entry__date">{certificate.date}</span>
            </a>
          </GearScrollReveal>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© 2026 HANS FILART</span>
      <Link href="/Home">BACK TO HOME <span aria-hidden="true">↑</span></Link>
      <span>BUILT WITH CARE</span>
    </footer>
  );
}
