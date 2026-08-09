"use client";

import { Mail } from "@/components/icons";
import { profile } from "@/data/portfolio";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="app-error">
      <section aria-labelledby="app-error-title">
        <p className="eyebrow"><span /> Temporary interruption</p>
        <h1 id="app-error-title">The portfolio could not finish loading.</h1>
        <p>Your information is safe. You can retry the page or contact me directly by email.</p>
        <div>
          <button className="button button--primary" type="button" onClick={reset}>Try again</button>
          <a className="button button--secondary" href={`mailto:${profile.email}`}><Mail /> Email directly</a>
        </div>
      </section>
    </main>
  );
}
