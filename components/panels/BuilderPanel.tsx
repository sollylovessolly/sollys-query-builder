"use client"

import { QueryGroup } from "@/components/builder/QueryGroup"
import { useQueryStore } from "@/store/queryStore"

export function BuilderPanel() {
  const tree = useQueryStore((state) => state.tree)

  return (
    <section className="app-panel min-h-0 overflow-auto border p-4 ">
      <div className="mb-3 flex items-center justify-between ">
        <h2 className="text-sm font-semibold text-gray-100">Builder</h2>
        <span className="text-xs text-gray-500">Recursive query tree</span>
      </div>

      <div className="app-builder-canvas rounded-lg border p-4">
        <QueryGroup group={tree} isRoot />
      </div>
    </section>
  )
}
