"use client"

import { useQueryStore } from "@/store/queryStore"
import { Group, isGroup } from "@/types"
import { QueryRule } from "./QueryRule"

interface Props {
  group: Group
  isRoot?: boolean
}

export function QueryGroup({ group, isRoot = false }: Props) {
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const updateRule = useQueryStore((state) => state.updateRule)
  const removeNode = useQueryStore((state) => state.removeNode)
  const toggleLogic = useQueryStore((state) => state.toggleLogic)

  return (
    <div
      className={`rounded-lg border p-3 ${
        isRoot ? "border-zinc-700" : "ml-4 border-zinc-800 border-l-2 border-l-purple-600"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-zinc-500">Match</span>
        <button
          onClick={() => group.logic === "OR" && toggleLogic(group.id)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            group.logic === "AND" ? "bg-blue-900 text-blue-300" : "bg-zinc-800 text-zinc-500"
          }`}
        >
          AND
        </button>
        <button
          onClick={() => group.logic === "AND" && toggleLogic(group.id)}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            group.logic === "OR" ? "bg-purple-900 text-purple-300" : "bg-zinc-800 text-zinc-500"
          }`}
        >
          OR
        </button>

        {!isRoot && (
          <button
            onClick={() => removeNode(group.id)}
            className="ml-auto text-xs text-zinc-600 hover:text-red-400"
          >
            Delete group
          </button>
        )}
      </div>

      <div className="space-y-2">
        {group.conditions.map((condition) => {
          if (isGroup(condition)) {
            return <QueryGroup key={condition.id} group={condition} />
          }

          return (
            <QueryRule
              key={condition.id}
              rule={condition}
              onUpdate={(changes) => updateRule(condition.id, changes)}
              onDelete={() => removeNode(condition.id)}
            />
          )
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => addRule(group.id)}
          className="rounded border border-dashed border-zinc-700 px-2 py-1 text-xs text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
        >
          + Add rule
        </button>
        <button
          onClick={() => addGroup(group.id)}
          className="rounded border border-dashed border-zinc-700 px-2 py-1 text-xs text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
        >
          + Add group
        </button>
      </div>
    </div>
  )
}
