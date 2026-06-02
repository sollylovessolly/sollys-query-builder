"use client"

import { useMemo, useState } from "react"
import { getDataSource } from "@/lib/mockData"
import { generateMongoDB } from "@/lib/queryGenerator"
import { validateQuery } from "@/lib/queryValidator"
import { useQueryStore } from "@/store/queryStore"

const pageSizes = [5, 10, 25]

type SortDirection = "asc" | "desc"

export function PreviewPanel() {
  const [sortColumn, setSortColumn] = useState("id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const dataSourceId = useQueryStore((state) => state.dataSourceId)
  const tree = useQueryStore((state) => state.tree)
  const isRunning = useQueryStore((state) => state.isRunning)
  const results = useQueryStore((state) => state.results)
  const lastRunAt = useQueryStore((state) => state.lastRunAt)
  const runQuery = useQueryStore((state) => state.runQuery)
  const activeSource = getDataSource(dataSourceId)
  const resultColumns = useMemo(() => ["id", ...Object.keys(activeSource.schema)], [activeSource.schema])
  const generatedQuery = useMemo(() => generateMongoDB(tree, activeSource.schema), [activeSource.schema, tree])
  const formattedQuery = useMemo(() => JSON.stringify(generatedQuery, null, 2), [generatedQuery])
  const validation = useMemo(() => validateQuery(tree, activeSource.schema), [activeSource.schema, tree])
  const hasExecuted = lastRunAt !== null
  const sortedResults = useMemo(() => {
    return [...results].sort((firstRow, secondRow) => {
      const firstValue = firstRow[sortColumn]
      const secondValue = secondRow[sortColumn]

      if (typeof firstValue === "number" && typeof secondValue === "number") {
        return sortDirection === "asc" ? firstValue - secondValue : secondValue - firstValue
      }

      const comparison = String(firstValue ?? "").localeCompare(String(secondValue ?? ""), undefined, {
        numeric: true,
        sensitivity: "base",
      })

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [results, sortColumn, sortDirection])
  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(sortedResults.length / pageSize))
    const safePage = Math.min(currentPage, totalPages)
    const startIndex = (safePage - 1) * pageSize

    return {
      totalPages,
      safePage,
      visibleStart: sortedResults.length === 0 ? 0 : startIndex + 1,
      visibleEnd: Math.min(startIndex + pageSize, sortedResults.length),
      paginatedResults: sortedResults.slice(startIndex, startIndex + pageSize),
    }
  }, [currentPage, pageSize, sortedResults])

  function toggleSort(column: string) {
    setCurrentPage(1)

    if (sortColumn === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))
      return
    }

    setSortColumn(column)
    setSortDirection("asc")
  }

  return (
    <section className="app-panel min-h-0 overflow-auto border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-100">Preview & Results</h2>
        <button
          onClick={runQuery}
          disabled={!validation.isValid || isRunning}
          className="app-animate-soft rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500"
        >
          {isRunning ? "Running..." : "Execute query"}
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[240px_1fr]">
        <div className="app-animate-panel app-sidebar-card rounded-lg border p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Summary</p>
          <dl className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Format</dt>
              <dd className="font-medium text-gray-300">MongoDB</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Root logic</dt>
              <dd className="font-medium text-gray-300">{tree.logic}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Top-level nodes</dt>
              <dd className="font-medium text-gray-300">{tree.conditions.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Results</dt>
              <dd className="font-medium text-gray-300">{hasExecuted ? results.length : "-"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-gray-500">Validation</dt>
              <dd className={validation.isValid ? "font-medium text-emerald-300" : "font-medium text-amber-300"}>
                {validation.isValid ? "Valid" : `${validation.issues.length} issue(s)`}
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid min-h-0 gap-3">
          {validation.issues.length > 0 && (
            <div className="app-animate-panel rounded border border-amber-900/70 bg-red-950/30 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-300">
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

          <pre className="app-animate-panel min-h-40 overflow-auto rounded-lg border border-gray-800 bg-[#1f1f1f] p-4 font-mono text-xs leading-5 text-emerald-300">
            <code>{formattedQuery}</code>
          </pre>

          <div className="app-animate-panel app-sidebar-card overflow-hidden rounded-lg border">
            <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Matching rows</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>
                  {hasExecuted && results.length > 0
                    ? `Showing ${pagination.visibleStart}-${pagination.visibleEnd} of ${results.length}`
                    : `${results.length} row(s)`}
                </span>
                {results.length > 0 && (
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value))
                      setCurrentPage(1)
                    }}
                    className="rounded border border-gray-800 bg-gray-900 px-2 py-1 text-xs text-gray-400"
                  >
                    {pageSizes.map((size) => (
                      <option key={size} value={size}>
                        {size}/page
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {isRunning ? (
              <div className="p-4 text-sm text-gray-500">Filtering mock dataset...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                {validation.isValid && hasExecuted
                  ? "No rows matched this query."
                  : validation.isValid
                    ? "Run the query to inspect matching rows."
                    : "Fix validation issues before running."}
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead className="bg-gray-950 text-gray-500">
                    <tr>
                      {resultColumns.map((column) => (
                        <th key={column} className="px-3 py-2 font-medium">
                          <button
                            onClick={() => toggleSort(column)}
                            className="app-animate-soft flex items-center gap-1 hover:text-gray-200"
                          >
                            {column}
                            {sortColumn === column && (
                              <span className="text-rose-300">{sortDirection === "asc" ? "up" : "down"}</span>
                            )}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {pagination.paginatedResults.map((row) => (
                      <tr key={row.id} className="app-animate-list text-gray-300">
                        {resultColumns.map((column) => (
                          <td key={column} className="px-3 py-2">
                            {row[column]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {results.length > pageSize && (
              <div className="flex items-center justify-between border-t border-gray-800 px-3 py-2 text-xs text-gray-500">
                <span>
                  Page {pagination.safePage} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={pagination.safePage === 1}
                    className="app-animate-soft rounded border border-gray-800 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((page) => Math.min(pagination.totalPages, page + 1))}
                    disabled={pagination.safePage === pagination.totalPages}
                    className="app-animate-soft rounded border border-gray-800 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
