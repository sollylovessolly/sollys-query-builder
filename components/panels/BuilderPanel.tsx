"use client"

import { QueryGroup } from "@/components/builder/QueryGroup"
import { useQueryStore } from "@/store/queryStore"

export function BuilderPanel() {
  const tree = useQueryStore((state) => state.tree)

  return (
    <section className="min-h-0 overflow-auto border-b border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-200">Builder</h2>
        <span className="text-xs text-zinc-500">Recursive query tree</span>
      </div>

      <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4">
        <QueryGroup group={tree} isRoot />
      </div>
    </section>
  )
}
