export function PreviewPanel() {
  return (
    <section className="min-h-0 overflow-auto bg-zinc-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">Preview & Results</h2>
        <span className="text-xs text-zinc-500">Live output next</span>
      </div>

      <div className="rounded border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs text-zinc-500">
        Generated query and execution results will appear here.
      </div>
    </section>
  )
}
