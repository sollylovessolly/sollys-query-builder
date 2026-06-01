"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { parseImportedQuery } from "@/lib/queryImport"
import { useQueryStore } from "@/store/queryStore"
import { useUiStore } from "@/store/uiStore"

export function TopBar() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState("")
  const tree = useQueryStore((state) => state.tree)
  const loadQuery = useQueryStore((state) => state.loadQuery)
  const theme = useUiStore((state) => state.theme)
  const setTheme = useUiStore((state) => state.setTheme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("solly-query-theme")

    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme)
    }
  }, [setTheme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem("solly-query-theme", theme)
  }, [theme])

  function exportQuery() {
    const blob = new Blob([JSON.stringify(tree, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "solly-query.json"
    link.click()
    URL.revokeObjectURL(url)
    setMessage("Exported query JSON")
  }

  function importQuery(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const result = parseImportedQuery(String(reader.result ?? ""))

      if (!result.ok || !result.tree) {
        setMessage(result.error ?? "Unable to import query")
        event.target.value = ""
        return
      }

      loadQuery(result.tree)
      setMessage("Imported query JSON")
      event.target.value = ""
    }

    reader.readAsText(file)
  }

  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-5">
      <div className="flex items-center gap-3">
        <div className="grid size-8 place-items-center rounded-lg border border-zinc-800 bg-zinc-900 text-sm font-black text-rose-500">
          SQ
        </div>
        <div>
          <h1 className="text-[15px] font-semibold tracking-tight text-zinc-100">
            Solly Query Builder
          </h1>
          <p className="text-xs text-zinc-500">Visual filters, live syntax, simulated results</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {message && <span className="hidden text-zinc-500 md:inline">{message}</span>}
        <span className="hidden rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-500 xl:inline">
          Ctrl Enter run · Ctrl B rule · Ctrl G group
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={importQuery}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="app-animate-soft rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
        >
          Import JSON
        </button>
        <button
          onClick={exportQuery}
          className="app-animate-soft rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
        >
          Export JSON
        </button>
        <button
          onClick={toggleTheme}
          className="app-animate-soft rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-400 hover:border-rose-800 hover:text-zinc-100"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <span className="rounded-lg border border-rose-950/70 bg-rose-950/20 px-3 py-2 text-rose-300">Draft</span>
        <span>HNG</span>
      </div>
    </header>
  )
}
