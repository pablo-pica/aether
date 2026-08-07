export default function Loading() {
  return (
    <div className="min-h-[100dvh] bg-aid-paper px-4 py-6 text-aid-ink sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1180px] rounded-3xl border border-aid-ink/10 bg-white/70 p-6 shadow-sm">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-aid-trust-blue">Loading workspace</p>
        <div className="mt-4 h-3 w-40 rounded-full bg-aid-ink/10" />
        <div className="mt-3 h-3 w-64 max-w-full rounded-full bg-aid-ink/10" />
      </div>
    </div>
  );
}
