"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { EvidenceArchive } from "@/components/evidence-archive";
import { VisualPortfolio } from "@/components/visual-portfolio";
import type { Photograph, ShowcaseItem, VideoProject } from "@/data/portfolio";

type PracticeTab = "experience" | "seminars-workshops" | "photography" | "videography";

type ExperienceCreativePracticeProps = {
  experienceItems: ShowcaseItem[];
  seminarItems: ShowcaseItem[];
  photographs: Photograph[];
  videos: VideoProject[];
};

export function ExperienceCreativePractice({
  experienceItems,
  seminarItems,
  photographs,
  videos,
}: ExperienceCreativePracticeProps) {
  const [activeTab, setActiveTab] = useState<PracticeTab>("experience");

  const tabs: Array<{ id: PracticeTab; label: string; count: number }> = [
    { id: "experience", label: "Experience", count: experienceItems.length },
    { id: "seminars-workshops", label: "Seminars & Workshops", count: seminarItems.length },
    { id: "photography", label: "Photography", count: photographs.length },
    { id: "videography", label: "Videography", count: videos.length },
  ];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(`experience-creative-${activeTab}-panel`)
        ?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeTab]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    document.getElementById(`experience-creative-${nextTab.id}-tab`)?.focus();
  };

  const visualTab = activeTab === "photography" || activeTab === "videography" ? activeTab : null;

  return (
    <div className="experience-creative-practice">
      <div
        className="visual-tabs visual-tabs--combined"
        role="tablist"
        aria-label="Experience and creative practice"
        aria-orientation="horizontal"
        onKeyDown={handleTabKeyDown}
      >
        {tabs.map((tab) => (
          <button
            id={`experience-creative-${tab.id}-tab`}
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`experience-creative-${tab.id}-panel`}
            className={activeTab === tab.id ? "is-active" : ""}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span>{tab.count.toString().padStart(2, "0")}</span>
          </button>
        ))}
      </div>

      <div
        className="experience-creative-panel"
        id="experience-creative-experience-panel"
        role="tabpanel"
        aria-labelledby="experience-creative-experience-tab"
        hidden={activeTab !== "experience"}
      >
        <EvidenceArchive items={experienceItems} />
      </div>

      <div
        className="experience-creative-panel"
        id="experience-creative-seminars-workshops-panel"
        role="tabpanel"
        aria-labelledby="experience-creative-seminars-workshops-tab"
        hidden={activeTab !== "seminars-workshops"}
      >
        <EvidenceArchive items={seminarItems} showFilters={false} />
      </div>

      <VisualPortfolio photographs={photographs} videos={videos} activeTab={visualTab} />
    </div>
  );
}
