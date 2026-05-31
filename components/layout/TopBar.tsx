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
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
      <div>
        <h1 className="text-sm font-semibold tracking-wide text-zinc-100">
          Solly Query Builder
        </h1>
        <p className="text-xs text-zinc-500">Visual filters, live syntax, simulated results</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500">
        {message && <span className="hidden text-zinc-500 md:inline">{message}</span>}
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={importQuery}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded border border-zinc-800 px-2 py-1 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
        >
          Import JSON
        </button>
        <button
          onClick={exportQuery}
          className="rounded border border-zinc-800 px-2 py-1 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
        >
          Export JSON
        </button>
        <button
          onClick={toggleTheme}
          className="rounded border border-zinc-800 px-2 py-1 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <span className="rounded border border-zinc-800 px-2 py-1 text-zinc-400">Draft</span>
        <span>HNG</span>
      </div>
    </header>
  )
}
