import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronLeft } from "@/components/icons";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { Navigation } from "@/components/navigation";
import { getShowcaseItem, profile, showcaseItems } from "@/data/portfolio";

type ShowcasePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return showcaseItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ShowcasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getShowcaseItem(slug);
  if (!item) return {};

  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/showcase/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      url: `/showcase/${item.slug}`,
    },
  };
}

export default async function ShowcasePage({ params }: ShowcasePageProps) {
  const { slug } = await params;
  const item = getShowcaseItem(slug);
  if (!item) notFound();

  const related = showcaseItems
    .filter((entry) => entry.slug !== item.slug && entry.category === item.category)
    .slice(0, 2);

  return (
    <>
      <Navigation />
      <main className="case-page">
        <header className="case-hero">
          <div className="container">
            <Link className="back-link" href="/#exposure"><ChevronLeft /> Back to Experience &amp; Creative Practice</Link>
            <div className="case-hero__grid">
              <div>
                <div className="card-meta"><span>{item.category}</span><span>{item.period}</span></div>
                <h1>{item.title}</h1>
                <p>{item.summary}</p>
              </div>
              <dl className="case-facts">
                <div><dt>Role</dt><dd>{item.role}</dd></div>
                <div><dt>Organisation</dt><dd>{item.organisation}</dd></div>
                <div><dt>Focus</dt><dd>{item.media.label}</dd></div>
              </dl>
            </div>
          </div>
        </header>

        <div className="container case-media-wrap">
          <MediaPlaceholder label={item.media.label} tone={item.media.tone} className="case-media">
            <span>Project image ready to add</span>
          </MediaPlaceholder>
        </div>

        <article className="container case-content">
          <section className="case-context">
            <p className="eyebrow"><span /> Context</p>
            <h2>Why this experience matters</h2>
            <p className="case-content__lead">{item.context}</p>
          </section>

          <div className="case-columns">
            <section>
              <p className="eyebrow"><span /> Contribution</p>
              <h2>What I worked on</h2>
              <ul>{item.contributions.map((entry) => <li key={entry}>{entry}</li>)}</ul>
            </section>
            <section>
              <p className="eyebrow"><span /> Learning</p>
              <h2>What I took forward</h2>
              <ul>{item.outcomes.map((entry) => <li key={entry}>{entry}</li>)}</ul>
            </section>
          </div>

          {item.employmentProof ? (
            <section className="employment-proof" aria-labelledby="employment-proof-title">
              <div className="employment-proof__details">
                <p className="eyebrow"><span /> Verification</p>
                <h2 id="employment-proof-title">Proof of employment</h2>
                <p>
                  A privacy-safe preview of the certificate confirming this professional experience.
                  Personal identifiers and signatures have been redacted for public display.
                </p>
                <dl className="employment-proof__facts">
                  <div><dt>Document</dt><dd>{item.employmentProof.documentType}</dd></div>
                  <div><dt>Organisation</dt><dd>{item.organisation}</dd></div>
                  <div><dt>Role</dt><dd>{item.role}</dd></div>
                  <div><dt>Employment</dt><dd>{item.period}</dd></div>
                  <div><dt>Issued</dt><dd>{item.employmentProof.issuedOn}</dd></div>
                </dl>
                <a
                  className="employment-proof__link"
                  href={item.employmentProof.previewSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View a larger preview of ${item.employmentProof.title}`}
                >
                  View larger preview <ArrowUpRight />
                </a>
              </div>

              <a
                className="employment-proof__preview"
                href={item.employmentProof.previewSrc}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View a larger preview of ${item.employmentProof.title}`}
              >
                <span className="employment-proof__paper">
                  <Image
                    src={item.employmentProof.previewSrc}
                    alt={item.employmentProof.alt}
                    width={1241}
                    height={1754}
                    sizes="(max-width: 760px) calc(100vw - 64px), (max-width: 1100px) 48vw, 510px"
                  />
                </span>
              </a>
            </section>
          ) : null}
        </article>

        {related.length ? (
          <section className="related-cases" aria-labelledby="related-title">
            <div className="container">
              <div className="related-cases__heading">
                <p className="eyebrow"><span /> Continue exploring</p>
                <h2 id="related-title">Related experience</h2>
              </div>
              <div className="related-cases__grid">
                {related.map((entry) => (
                  <Link key={entry.slug} className="related-card" href={`/showcase/${entry.slug}`}>
                    <div className="card-meta"><span>{entry.category}</span><span>{entry.period}</span></div>
                    <h3>{entry.title}</h3>
                    <span className="text-link">Read case <ArrowUpRight /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="case-contact">
          <div className="container">
            <p>Interested in discussing this experience?</p>
            <a href={`mailto:${profile.email}`}>Start a conversation <ArrowUpRight /></a>
          </div>
        </section>
      </main>
    </>
  );
}
