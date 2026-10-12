/** Shown instantly while a panel page waits for the backend, so tab switches feel immediate. */
export default function PanelLoading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="mb-[26px]">
        <div className="h-7 w-48 rounded-full bg-black/[0.08]" />
        <div className="mt-2 h-4 w-72 max-w-full rounded-full bg-black/[0.06]" />
      </div>
      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-[92px] rounded-[20px] bg-white/60" />
        ))}
      </div>
      <div className="h-[320px] rounded-[20px] bg-white/60" />
    </div>
  );
}
