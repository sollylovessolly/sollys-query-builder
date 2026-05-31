"use client"

import { generateMongoDB } from "@/lib/queryGenerator"
import { useQueryStore } from "@/store/queryStore"

export function PreviewPanel() {
  const tree = useQueryStore((state) => state.tree)
  const generatedQuery = generateMongoDB(tree)
  const formattedQuery = JSON.stringify(generatedQuery, null, 2)

  return (
    <section className="min-h-0 overflow-auto bg-zinc-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">Preview & Results</h2>
        <span className="text-xs text-zinc-500">MongoDB preview</span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr]">
        <div className="rounded border border-zinc-800 bg-zinc-900/60 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Summary</p>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-zinc-500">Format</dt>
              <dd className="font-medium text-zinc-300">MongoDB</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-zinc-500">Root logic</dt>
              <dd className="font-medium text-zinc-300">{tree.logic}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-zinc-500">Top-level nodes</dt>
              <dd className="font-medium text-zinc-300">{tree.conditions.length}</dd>
            </div>
          </dl>
        </div>

        <pre className="min-h-40 overflow-auto rounded border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs leading-5 text-emerald-300">
          <code>{formattedQuery}</code>
        </pre>
      </div>
    </section>
  )
}
