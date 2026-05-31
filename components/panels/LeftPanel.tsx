"use client"

import { useState } from "react"
import { mockDataset, schema } from "@/lib/mockData"
import { queryPresets } from "@/lib/queryPresets"
import { useQueryStore } from "@/store/queryStore"
import { Group, isGroup } from "@/types"

const fieldEntries = Object.entries(schema)
const tabs = ["Schema", "Presets", "History"] as const

type SidebarTab = (typeof tabs)[number]

function countNodes(group: Group): number {
  return group.conditions.reduce((count, condition) => {
    if (isGroup(condition)) {
      return count + 1 + countNodes(condition)
    }

    return count + 1
  }, 0)
}

export function LeftPanel() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("Schema")
  const history = useQueryStore((state) => state.history)
  const loadQuery = useQueryStore((state) => state.loadQuery)
  const restoreHistory = useQueryStore((state) => state.restoreHistory)
  const clearHistory = useQueryStore((state) => state.clearHistory)
  const recentHistory = history.slice(0, 5)

  return (
    <aside className="flex min-h-0 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <section className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Data source</p>
        <div className="mt-3 rounded border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Users</h2>
              <p className="text-xs text-zinc-500">Mock customer dataset</p>
            </div>
            <span className="rounded bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-300">
              Active
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
              <dt className="text-zinc-500">Rows</dt>
              <dd className="mt-1 font-semibold text-zinc-200">{mockDataset.length}</dd>
            </div>
            <div className="rounded border border-zinc-800 bg-zinc-950 p-2">
              <dt className="text-zinc-500">Fields</dt>
              <dd className="mt-1 font-semibold text-zinc-200">{fieldEntries.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mt-5 grid grid-cols-3 rounded border border-zinc-800 bg-zinc-900/60 p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded px-2 py-1.5 text-xs font-medium ${
              activeTab === tab ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-auto">
        {activeTab === "Schema" && (
          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Schema</p>
              <span className="text-xs text-zinc-600">{fieldEntries.length} fields</span>
            </div>

            <div className="mt-3 space-y-3">
              {fieldEntries.map(([fieldName, field]) => (
                <article key={fieldName} className="rounded border border-zinc-800 bg-zinc-900/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-zinc-100">{fieldName}</h3>
                    <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-400">
                      {field.type}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {field.operators.map((operator) => (
                      <span
                        key={operator}
                        className="rounded border border-zinc-800 px-2 py-1 text-[11px] text-zinc-400"
                      >
                        {operator}
                      </span>
                    ))}
                  </div>

                  {field.options && (
                    <p className="mt-3 text-xs leading-5 text-zinc-500">
                      Options: <span className="text-zinc-400">{field.options.join(", ")}</span>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === "Presets" && (
          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Presets</p>
              <span className="text-xs text-zinc-600">{queryPresets.length} saved</span>
            </div>

            <div className="mt-3 space-y-2">
              {queryPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadQuery(preset.tree)}
                  className="w-full rounded border border-zinc-800 bg-zinc-900/60 p-3 text-left hover:border-zinc-600"
                >
                  <span className="block text-sm font-medium text-zinc-200">{preset.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-zinc-500">{preset.description}</span>
                  <span className="mt-2 block text-[11px] text-zinc-600">
                    {preset.tree.logic} / {countNodes(preset.tree)} node
                    {countNodes(preset.tree) === 1 ? "" : "s"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "History" && (
          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">History</p>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-zinc-600 hover:text-zinc-300">
                  Clear
                </button>
              )}
            </div>

            <div className="mt-3 rounded border border-zinc-800 bg-zinc-900/60 p-3">
              {history.length === 0 ? (
                <p className="text-xs leading-5 text-zinc-500">
                  Query changes will appear here for quick restore.
                </p>
              ) : (
                <div className="space-y-2">
                  {recentHistory.map((snapshot, index) => {
                    const nodeCount = countNodes(snapshot)

                    return (
                      <button
                        key={`${snapshot.id}-${index}`}
                        onClick={() => restoreHistory(index)}
                        className="flex w-full items-center justify-between rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-left hover:border-zinc-600"
                      >
                        <span>
                          <span className="block text-xs font-medium text-zinc-300">
                            Restore change {index + 1}
                          </span>
                          <span className="text-[11px] text-zinc-600">
                            {snapshot.logic} / {nodeCount} node{nodeCount === 1 ? "" : "s"}
                          </span>
                        </span>
                        <span className="text-xs text-zinc-600">Use</span>
                      </button>
                    )
                  })}

                  {history.length > recentHistory.length && (
                    <p className="pt-1 text-xs text-zinc-600">
                      {history.length - recentHistory.length} older change
                      {history.length - recentHistory.length === 1 ? "" : "s"} hidden
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </aside>
  )
}
