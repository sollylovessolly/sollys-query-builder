"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { CloudDownload, CloudUpload, Lightbulb, LightbulbOff, Star } from "lucide-react"
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
    <header className="app-topbar flex items-center justify-between px-5 py-9">
      <div className="flex items-center gap-3">
        <div className="app-topbar-surface grid size-8 place-items-center rounded-lg border text-yellow-700">
          <Star size={16} fill="yellow" />
        </div>
        <h1 className="text-[15px] font-semibold tracking-tight text-[var(--topbar-text)]">
          Sollys Query Builder
        </h1>
      </div>

      <div className="app-topbar-surface hidden rounded-lg border px-3 py-2 text-gray-400 xl:inline">
        Ctrl Enter (run) - Ctrl B (new rule) - Ctrl G (new group)
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        {message && <span className="hidden text-gray-400 md:inline">{message}</span>}

        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={importQuery}
          className="hidden"
        />

        <button
          onClick={() => inputRef.current?.click()}
          title="Import JSON"
          aria-label="Import JSON"
          className="app-animate-soft app-topbar-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-green-400 hover:border-green-600 hover:text-[var(--topbar-text)]"
        >
          <CloudUpload size={14} />
        </button>

        <button
          onClick={exportQuery}
          title="Export JSON"
          aria-label="Export JSON"
          className="app-animate-soft app-topbar-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-blue-400 hover:border-blue-600 hover:text-[var(--topbar-text)]"
        >
          <CloudDownload size={14} />
        </button>

        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          className="app-animate-soft app-topbar-surface grid size-10 place-items-center rounded-lg border text-gray-400 hover:border-rose-800 hover:text-[var(--topbar-text)]"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Lightbulb size={16} /> : <LightbulbOff size={16} />}
        </button>

        <span className="rounded-lg border border-rose-950/70 bg-rose-950/20 px-3 py-2 text-rose-300">
          Draft
        </span>
      </div>
    </header>
  )
}
