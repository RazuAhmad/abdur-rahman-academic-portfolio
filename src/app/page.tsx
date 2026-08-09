import Image from "next/image";
import { ContactWidget } from "@/components/contact-widget";
import { EmailComposeChooser } from "@/components/email-compose-chooser";
import { ArrowUpRight, Download, FileText, Github, Linkedin } from "@/components/icons";
import { ExperienceCreativePractice } from "@/components/experience-creative-practice";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { Navigation } from "@/components/navigation";
import { Reveal } from "@/components/reveal";
import { photographs, profile, showcaseItems, videoProjects } from "@/data/portfolio";

export const dynamic = "force-static";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  email: `mailto:${profile.email}`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  sameAs: [profile.linkedin, profile.github],
  alumniOf: { "@type": "CollegeOrUniversity", name: "Jagannath University" },
  jobTitle: ["Junior Frontend Developer", "Apprentice Lawyer"],
  knowsAbout: [
    "Technology law",
    "Data protection",
    "Digital Product Passports",
    "EU compliance",
    "Circular economy",
    "Sustainable development",
    "Digital evidence",
    "Digital governance",
    "Photography",
    "Videography",
  ],
};

export default function Home() {
  const timelineItems = showcaseItems
    .filter((item) => item.timelineOrder !== undefined)
    .sort((a, b) => (a.timelineOrder ?? 0) - (b.timelineOrder ?? 0));
  const experienceItems = showcaseItems.filter((item) => item.archiveGroup === "experience");
  const seminarItems = showcaseItems.filter((item) => item.archiveGroup === "seminars-workshops");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <Navigation />

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__glow hero__glow--one" aria-hidden="true" />
          <div className="hero__glow hero__glow--two" aria-hidden="true" />
          <div className="container hero__grid">
            <Reveal className="hero__copy">
              <p className="eyebrow"><span /> Law Graduate · Junior Frontend Developer · EU Digital Product Passport</p>
              <h1 id="hero-title">Bridging law, technology and <span>sustainability.</span></h1>
              <p className="hero__introduction">
                I&apos;m Md. Abdur Rahman, a law graduate with more than two years of software engineering
                experience, currently contributing to an EU-focused Digital Product Passport platform
                through a UK-affiliated company. My work connects product traceability, regulatory
                compliance, circular economy principles and sustainable development.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#work">Explore selected work <ArrowUpRight /></a>
                <a className="button button--secondary" href={profile.cv} download>Download CV <Download /></a>
              </div>
              <div className="hero__proof" aria-label="Profile highlights">
                <div><strong>2+ years</strong><span>Professional software experience</span></div>
                <div><strong>EU DPP</strong><span>Traceability, compliance and circular economy</span></div>
                <div><strong>Master&apos;s focus</strong><span>EU law, sustainability and technology regulation</span></div>
              </div>
            </Reveal>

            <Reveal className="portrait-card" delay={0.1}>
              <div className="portrait-card__visual portrait-card__visual--photo">
                <Image
                  src="/abdur-rahman-photo.jpeg"
                  alt="Portrait of Md. Abdur Rahman"
                  fill
                  priority
                  sizes="(max-width: 760px) min(100vw - 56px, 406px), (max-width: 1020px) 34vw, 360px"
                />
              </div>
              <div className="portrait-card__status">
                <span className="status-dot" aria-hidden="true" />
                <p><strong>Exploring master&apos;s programmes in Europe</strong><small>EU law · Sustainability · Technology and regulation</small></p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section section--work" id="work" aria-labelledby="work-title">
          <div className="container">
            <Reveal className="section-intro">
              <div>
                <p className="eyebrow"><span /> Professional experience</p>
                <h2 id="work-title">Where a legal mind meets Technology to ensure Sustainability Development.</h2>
              </div>
              <p>
                A professional path through compliance-focused product development, legal practice and
                mission-driven software engineering.
              </p>
            </Reveal>
            <ExperienceTimeline items={timelineItems} />
          </div>
        </section>

        <section className="section section--visual" id="exposure" aria-labelledby="exposure-title">
          <div className="container">
            <Reveal className="section-intro section-intro--light">
              <div>
                <p className="eyebrow"><span /> Experience &amp; Creative Practice</p>
                <h2 id="exposure-title">Professional, academic and creative pursuits.</h2>
              </div>
              <p>
                A selected record of professional work, legal practice, seminars and workshops, alongside
                photography and videography shaped by observation, context and attention to detail.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <ExperienceCreativePractice
                experienceItems={experienceItems}
                seminarItems={seminarItems}
                photographs={photographs}
                videos={videoProjects}
              />
            </Reveal>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="container contact__grid">
            <Reveal>
              <p className="eyebrow"><span /> Contact</p>
              <h2 id="contact-title">Interested in master&apos;s programmes across technology, law and sustainable development.</h2>
            </Reveal>
            <Reveal className="contact__details" delay={0.08}>
              <p>
                I welcome conversations about postgraduate study, technology law, data protection,
                digital governance, sustainability and compliance-focused product work.
              </p>
              <div className="contact__channels" aria-label="Contact and profile links">
                <EmailComposeChooser email={profile.email} name={profile.name} />
                <a className="contact__channel" href={profile.linkedin} target="_blank" rel="noreferrer">
                  <span className="contact__channel-icon"><Linkedin /></span>
                  <span className="contact__channel-copy"><strong>LinkedIn</strong><small>Professional profile</small></span>
                  <ArrowUpRight />
                </a>
                <a className="contact__channel" href={profile.github} target="_blank" rel="noreferrer">
                  <span className="contact__channel-icon"><Github /></span>
                  <span className="contact__channel-copy"><strong>GitHub</strong><small>Development work</small></span>
                  <ArrowUpRight />
                </a>
                <a className="contact__channel" href={profile.cv} download>
                  <span className="contact__channel-icon"><FileText /></span>
                  <span className="contact__channel-copy"><strong>Curriculum vitae</strong><small>Download PDF</small></span>
                  <Download />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <ContactWidget email={profile.email} />

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Md. Abdur Rahman</p>
          <p>Law · Technology · Visual practice</p>
          <a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </div>
      </footer>
    </>
  );
}
