"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "@/components/icons";
import { MediaPlaceholder } from "@/components/media-placeholder";
import type { ShowcaseCategory, ShowcaseItem } from "@/data/portfolio";

type Filter = "All" | ShowcaseCategory;

const filters: Filter[] = ["All", "Technology", "Legal Practice", "Academic Engagement"];

type EvidenceArchiveProps = {
  items: ShowcaseItem[];
  showFilters?: boolean;
};

export function EvidenceArchive({ items, showFilters = true }: EvidenceArchiveProps) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = filter === "All" ? items : items.filter((item) => item.category === filter);

  return (
    <div>
      {showFilters ? (
        <div className="filter-row" role="group" aria-label="Filter experience entries">
          {filters.map((entry) => (
            <button
              key={entry}
              type="button"
              className={filter === entry ? "is-active" : ""}
              aria-pressed={filter === entry}
              onClick={() => setFilter(entry)}
            >
              {entry}
            </button>
          ))}
        </div>
      ) : null}

      <div className="evidence-grid" aria-live="polite">
        {visible.map((item) => (
          <article className="evidence-card" key={item.slug}>
            <Link href={`/showcase/${item.slug}`} aria-label={`View details for ${item.title}`} tabIndex={-1}>
              <MediaPlaceholder label={item.media.label} tone={item.media.tone} className="evidence-card__media" />
            </Link>
            <div className="evidence-card__content">
              <div className="card-meta">
                <span>{item.category}</span>
                <span>{item.period}</span>
              </div>
              <h3><Link href={`/showcase/${item.slug}`}>{item.title}</Link></h3>
              <p>{item.summary}</p>
              <div className="evidence-card__foot">
                <span>{item.organisation}</span>
                <Link href={`/showcase/${item.slug}`} aria-label={`Read ${item.title}`}><ArrowUpRight /></Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
