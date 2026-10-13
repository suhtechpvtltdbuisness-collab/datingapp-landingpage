"use client";
import { EmptyState, SectionCard, buttonClass } from "../_components/ui";

/** Shown when a panel page can't load, most often because the backend isn't reachable. */
export default function PanelError({ reset }: { error: Error; reset: () => void }) {
  return (
    <SectionCard>
      <EmptyState icon="🔌">
        Couldn&apos;t load this page from the backend. Check that it&apos;s running and try again.
        <div className="mt-4">
          <button type="button" className={buttonClass("outline")} onClick={reset}>
            Try again
          </button>
        </div>
      </EmptyState>
    </SectionCard>
  );
}
