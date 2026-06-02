"use client"

import { useMemo, useState } from "react"
import { dataSources, getDataSource } from "@/lib/mockData"
import { queryPresets } from "@/lib/queryPresets"
import { useQueryStore } from "@/store/queryStore"
import { Group, isGroup } from "@/types"

const tabs = ["Schema", "Presets", "History"] as const
const presetFilters = ["all", "users", "orders", "products"] as const

type SidebarTab = (typeof tabs)[number]
type PresetFilter = (typeof presetFilters)[number]

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
  const [presetFilter, setPresetFilter] = useState<PresetFilter>("all")
  const history = useQueryStore((state) => state.history)
  const dataSourceId = useQueryStore((state) => state.dataSourceId)
  const setDataSource = useQueryStore((state) => state.setDataSource)
  const loadQuery = useQueryStore((state) => state.loadQuery)
  const restoreHistory = useQueryStore((state) => state.restoreHistory)
  const clearHistory = useQueryStore((state) => state.clearHistory)
  const recentHistory = useMemo(() => history.slice(0, 5), [history])
  const activeSource = getDataSource(dataSourceId)
  const fieldEntries = useMemo(() => Object.entries(activeSource.schema), [activeSource.schema])
  const presetSummaries = useMemo(
    () =>
      queryPresets.map((preset) => ({
        ...preset,
        sourceName: getDataSource(preset.dataSourceId).name,
        nodeCount: countNodes(preset.tree),
      })),
    [],
  )
  const filteredPresets = useMemo(() => {
    if (presetFilter === "all") {
      return presetSummaries
    }

    return presetSummaries.filter((preset) => preset.dataSourceId === presetFilter)
  }, [presetFilter, presetSummaries])
  const historySummaries = useMemo(
    () =>
      recentHistory.map((snapshot, index) => ({
        index,
        snapshot,
        nodeCount: countNodes(snapshot),
      })),
    [recentHistory],
  )

  return (
    <aside className="app-panel flex min-h-0 flex-col border p-4">
      <section className="shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Data source</p>
        <div className="app-animate-panel app-sidebar-card mt-3 rounded-lg border p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <label htmlFor="data-source" className="sr-only">
                Data source
              </label>
              <select
                id="data-source"
                value={dataSourceId}
                onChange={(event) => setDataSource(event.target.value)}
                className="w-full rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-sm font-semibold text-gray-100"
              >
                {dataSources.map((source) => (
                  <option key={source.id} value={source.id}>
                    {source.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">{activeSource.description}</p>
            </div>
            <span className="rounded-lg bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-300">
              Active
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-2">
              <dt className="text-gray-500">Rows</dt>
              <dd className="mt-1 font-semibold text-gray-200">{activeSource.rows.length}</dd>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-900/60 p-2">
              <dt className="text-gray-500">Fields</dt>
              <dd className="mt-1 font-semibold text-gray-200">{fieldEntries.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="app-sidebar-card mt-5 grid grid-cols-3 rounded-lg border p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`app-animate-soft rounded-md px-2 py-1.5 text-xs font-medium ${
              activeTab === tab ? "bg-rose-950/50 text-rose-200" : "text-gray-500 hover:text-gray-300"
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
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Schema</p>
              <span className="text-xs text-gray-600">{fieldEntries.length} fields</span>
            </div>

            <div className="mt-3 space-y-3">
              {fieldEntries.map(([fieldName, field]) => (
                <article key={fieldName} className="app-animate-list app-sidebar-card rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-gray-100">{fieldName}</h3>
                    <span className="rounded-lg bg-gray-800 px-2 py-1 text-xs text-gray-400">
                      {field.type}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {field.operators.map((operator) => (
                      <span
                        key={operator}
                        className="rounded-md border border-gray-800 bg-gray-900/50 px-2 py-1 text-[11px] text-gray-400"
                      >
                        {operator}
                      </span>
                    ))}
                  </div>

                  {field.options && (
                    <p className="mt-3 text-xs leading-5 text-gray-500">
                      Options: <span className="text-gray-400">{field.options.join(", ")}</span>
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
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Presets</p>
              <span className="text-xs text-gray-600">{filteredPresets.length} shown</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {presetFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPresetFilter(filter)}
                  className={`app-animate-soft rounded-md border px-2 py-1 text-[11px] font-medium capitalize ${
                    presetFilter === filter
                      ? "border-rose-800 bg-rose-950/50 text-rose-200"
                      : "border-gray-800 bg-gray-900/50 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-3 space-y-2">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => loadQuery(preset.tree, preset.dataSourceId)}
                  className="app-animate-soft app-sidebar-card w-full rounded-lg border p-3 text-left hover:border-rose-900/80"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="block text-sm font-medium text-gray-200">{preset.name}</span>
                    <span className="rounded-md border border-gray-800 bg-gray-900 px-2 py-1 text-[10px] uppercase tracking-wide text-gray-500">
                      {preset.sourceName}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">{preset.description}</span>
                  <span className="mt-2 block text-[11px] text-gray-600">
                    {preset.tree.logic} / {preset.nodeCount} node
                    {preset.nodeCount === 1 ? "" : "s"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {activeTab === "History" && (
          <section>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">History</p>
              {history.length > 0 && (
                <button onClick={clearHistory} className="app-animate-soft text-xs text-gray-600 hover:text-gray-300">
                  Clear
                </button>
              )}
            </div>

            <div className="app-animate-panel app-sidebar-card mt-3 rounded-lg border p-3">
              {history.length === 0 ? (
                <p className="text-xs leading-5 text-gray-500">
                  Query changes will appear here for quick restore.
                </p>
              ) : (
                <div className="space-y-2">
                  {historySummaries.map(({ index, nodeCount, snapshot }) => {
                    return (
                      <button
                        key={`${snapshot.id}-${index}`}
                        onClick={() => restoreHistory(index)}
                        className="app-animate-soft flex w-full items-center justify-between rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-2 text-left hover:border-rose-900/80"
                      >
                        <span>
                          <span className="block text-xs font-medium text-gray-300">
                            Restore change {index + 1}
                          </span>
                          <span className="text-[11px] text-gray-600">
                            {snapshot.logic} / {nodeCount} node{nodeCount === 1 ? "" : "s"}
                          </span>
                        </span>
                        <span className="text-xs text-gray-600">Use</span>
                      </button>
                    )
                  })}

                  {history.length > recentHistory.length && (
                    <p className="pt-1 text-xs text-gray-600">
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
