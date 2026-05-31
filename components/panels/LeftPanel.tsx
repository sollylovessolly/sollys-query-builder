import { mockDataset, schema } from "@/lib/mockData"

const fieldEntries = Object.entries(schema)

export function LeftPanel() {
  return (
    <aside className="min-h-0 overflow-auto border-r border-zinc-800 bg-zinc-950 p-4">
      <section>
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

      <section className="mt-5">
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
    </aside>
  )
}
