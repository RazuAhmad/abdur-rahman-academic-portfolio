import type { ReactNode } from "react";

type MediaPlaceholderProps = {
  label: string;
  tone?: "cyan" | "blue" | "violet" | "slate";
  className?: string;
  children?: ReactNode;
};

export function MediaPlaceholder({
  label,
  tone = "cyan",
  className = "",
  children,
}: MediaPlaceholderProps) {
  return (
    <div className={`media-placeholder media-placeholder--${tone} ${className}`.trim()}>
      <div className="media-placeholder__grid" aria-hidden="true" />
      <span>{label}</span>
      {children}
    </div>
  );
}
