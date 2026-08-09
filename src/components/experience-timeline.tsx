"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight } from "@/components/icons";
import type { ShowcaseItem } from "@/data/portfolio";

export function ExperienceTimeline({ items }: { items: ShowcaseItem[] }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 68%", "end 48%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 105, damping: 28, mass: 0.35 });
  const indicatorTop = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={timelineRef} className={`experience-timeline ${reduceMotion ? "is-reduced-motion" : ""}`}>
      <div className="experience-timeline__track" aria-hidden="true">
        <motion.span
          className="experience-timeline__progress"
          style={{ scaleY: reduceMotion ? 1 : smoothProgress }}
        />
        {!reduceMotion ? <motion.i className="experience-timeline__indicator" style={{ top: indicatorTop }} /> : null}
      </div>

      {items.map((item, index) => (
        <motion.article
          className="experience-entry"
          key={item.slug}
          initial={reduceMotion ? false : { opacity: 0.35, y: 24 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.5, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
        >
          <time className="experience-entry__date">{item.period}</time>
          <motion.span
            className="experience-entry__marker"
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 0.72, backgroundColor: "#6d8195", boxShadow: "0 0 0 0 rgba(39,211,194,0)" }}
            whileInView={reduceMotion ? undefined : { scale: 1, backgroundColor: "#27d3c2", boxShadow: "0 0 0 8px rgba(39,211,194,.13), 0 0 28px rgba(39,211,194,.45)" }}
            viewport={{ once: true, amount: 0.55 }}
            transition={{ type: "spring", stiffness: 240, damping: 18 }}
          />
          <div className="experience-entry__card">
            <time className="experience-entry__date-mobile">{item.period}</time>
            <p className="experience-entry__role">{item.role}</p>
            <h3>{item.organisation}</h3>
            <p>{item.summary}</p>
            <Link href={`/showcase/${item.slug}`}>View experience <ArrowUpRight /></Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
