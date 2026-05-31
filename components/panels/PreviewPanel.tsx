"use client"

import { generateMongoDB } from "@/lib/queryGenerator"
import { validateQuery } from "@/lib/queryValidator"
import { useQueryStore } from "@/store/queryStore"

export function PreviewPanel() {
  const tree = useQueryStore((state) => state.tree)
  const generatedQuery = generateMongoDB(tree)
  const formattedQuery = JSON.stringify(generatedQuery, null, 2)
  const validation = validateQuery(tree)

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
            <div className="flex items-center justify-between gap-3">
              <dt className="text-zinc-500">Validation</dt>
              <dd className={validation.isValid ? "font-medium text-emerald-300" : "font-medium text-amber-300"}>
                {validation.isValid ? "Valid" : `${validation.issues.length} issue(s)`}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid min-h-0 gap-3">
          {validation.issues.length > 0 && (
            <div className="rounded border border-amber-900/70 bg-amber-950/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                Validation issues
              </p>
              <ul className="mt-2 space-y-1 text-xs text-amber-100/80">
                {validation.issues.map((issue) => (
                  <li key={issue.id}>
                    <span className="text-amber-400">{issue.path}</span> {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <pre className="min-h-40 overflow-auto rounded border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs leading-5 text-emerald-300">
            <code>{formattedQuery}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}
