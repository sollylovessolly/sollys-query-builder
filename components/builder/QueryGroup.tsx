// components/builder/QueryGroup.tsx
import { Group, Rule, isGroup } from "@/types"
import { QueryRule } from "./QueryRule"

interface Props {
  group: Group
  isRoot?: boolean
}

export function QueryGroup({ group, isRoot = false }: Props) {
  return (
    <div className={`border rounded-lg p-3 ${isRoot ? "border-zinc-700" : "border-l-2 border-l-purple-600 border-zinc-800 ml-4"}`}>

      {/* AND / OR toggle */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-zinc-500">Match</span>
        <button className={`px-3 py-1 rounded-full text-xs font-semibold ${group.logic === "AND" ? "bg-blue-900 text-blue-300" : "bg-zinc-800 text-zinc-500"}`}>
          AND
        </button>
        <button className={`px-3 py-1 rounded-full text-xs font-semibold ${group.logic === "OR" ? "bg-purple-900 text-purple-300" : "bg-zinc-800 text-zinc-500"}`}>
          OR
        </button>
      </div>

      {/* render each condition */}
      {group.conditions.map(condition => {
        if (isGroup(condition)) {
          // THIS IS THE RECURSION — QueryGroup renders QueryGroup
          return <QueryGroup key={condition.id} group={condition} />
        }
        return (
          <QueryRule
            key={condition.id}
            rule={condition}
            onUpdate={(changes) => {/* call store */}}
            onDelete={() => {/* call store */}}
          />
        )
      })}

      {/* add buttons */}
      <div className="flex gap-2 mt-2">
        <button className="text-xs text-zinc-500 border border-dashed border-zinc-700 px-2 py-1 rounded hover:border-zinc-500">
          + Add rule
        </button>
        <button className="text-xs text-zinc-500 border border-dashed border-zinc-700 px-2 py-1 rounded hover:border-zinc-500">
          + Add group
        </button>
      </div>
    </div>
  )
}