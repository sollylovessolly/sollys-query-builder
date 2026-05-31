"use client"

import { useEffect } from "react"
import { useQueryStore } from "@/store/queryStore"

function isEditingElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return tagName === "input" || tagName === "select" || tagName === "textarea" || target.isContentEditable
}

export function KeyboardShortcuts() {
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const runQuery = useQueryStore((state) => state.runQuery)
  const toggleGroupCollapsed = useQueryStore((state) => state.toggleGroupCollapsed)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const modifierPressed = event.metaKey || event.ctrlKey

      if (!modifierPressed || isEditingElement(event.target)) {
        return
      }

      const key = event.key.toLowerCase()

      if (key === "enter") {
        event.preventDefault()
        runQuery()
      }

      if (key === "b") {
        event.preventDefault()
        addRule("root")
      }

      if (key === "g") {
        event.preventDefault()
        addGroup("root")
      }

      if (key === "k") {
        event.preventDefault()
        toggleGroupCollapsed("root")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [addGroup, addRule, runQuery, toggleGroupCollapsed])

  return null
}
