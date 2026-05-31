export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
      <div>
        <h1 className="text-sm font-semibold tracking-wide text-zinc-100">
          Solly Query Builder
        </h1>
        <p className="text-xs text-zinc-500">Visual filters, live syntax, simulated results</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <span className="rounded border border-zinc-800 px-2 py-1 text-zinc-400">Draft</span>
        <span>HNG</span>
      </div>
    </header>
  )
}
