"use client"

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { ReactNode } from "react"
import { useQueryStore } from "@/store/queryStore"
import { Group, Rule, isGroup } from "@/types"
import { QueryRule } from "./QueryRule"

interface Props {
  group: Group
  isRoot?: boolean
}

interface SortableNodeProps {
  condition: Group | Rule
  children: ReactNode
}

function SortableNode({ condition, children }: SortableNodeProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: condition.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 180ms ease",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`app-animate-list ${isDragging ? "relative z-10 opacity-70" : ""}`}
    >
      <div className="flex items-stretch gap-2">
        <button
          className="app-animate-soft grid w-7 shrink-0 cursor-grab place-items-center rounded-lg border border-gray-800 bg-gray-900/70 text-xs text-gray-600 active:cursor-grabbing"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          ::
        </button>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}

export function QueryGroup({ group, isRoot = false }: Props) {
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const updateRule = useQueryStore((state) => state.updateRule)
  const removeNode = useQueryStore((state) => state.removeNode)
  const moveNode = useQueryStore((state) => state.moveNode)
  const toggleLogic = useQueryStore((state) => state.toggleLogic)
  const toggleGroupCollapsed = useQueryStore((state) => state.toggleGroupCollapsed)
  const isCollapsed = useQueryStore((state) => state.collapsedGroupIds.includes(group.id))
  const isEmpty = group.conditions.length === 0
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const childIds = group.conditions.map((condition) => condition.id)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    moveNode(group.id, String(active.id), String(over.id))
  }

  return (
    <div
      className={`app-animate-panel app-group-surface rounded-lg border p-3 ${
        isRoot ? "border-gray-700" : "ml-4 border-gray-800 border-l-2 border-l-rose-800"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={() => toggleGroupCollapsed(group.id)}
          className="app-animate-soft rounded border border-gray-800 px-2 py-1 text-xs text-gray-500 hover:border-gray-600 hover:text-gray-300"
          aria-label={isCollapsed ? "Expand group" : "Collapse group"}
        >
          {isCollapsed ? "+" : "-"}
        </button>
        <span className="text-xs text-gray-500">Match</span>
        <button
          onClick={() => group.logic === "OR" && toggleLogic(group.id)}
          className={`app-animate-soft rounded-full px-3 py-1 text-xs font-semibold ${
            group.logic === "AND" ? "bg-rose-950/70 text-rose-200" : "bg-gray-800 text-gray-500"
          }`}
        >
          AND
        </button>
        <button
          onClick={() => group.logic === "AND" && toggleLogic(group.id)}
          className={`app-animate-soft rounded-full px-3 py-1 text-xs font-semibold ${
            group.logic === "OR" ? "bg-rose-950/70 text-rose-200" : "bg-gray-800 text-gray-500"
          }`}
        >
          OR
        </button>

        <span className="text-xs text-gray-600">
          {group.conditions.length} node{group.conditions.length === 1 ? "" : "s"}
        </span>

        {!isRoot && (
          <button
            onClick={() => removeNode(group.id)}
            className="ml-auto text-xs text-gray-600 hover:text-red-400"
          >
            Delete group
          </button>
        )}
      </div>

      {isCollapsed ? (
        <div className="app-animate-panel rounded-lg border border-dashed border-gray-800 bg-gray-950/60 px-3 py-2 text-xs text-gray-500">
          Group collapsed. {group.conditions.length} nested node
          {group.conditions.length === 1 ? "" : "s"} hidden.
        </div>
      ) : isEmpty ? (
        <div className="app-animate-panel rounded-lg border border-dashed border-amber-900/70 bg-amber-950/20 p-4">
          <p className="text-sm font-medium text-amber-200">
            {isRoot ? "Your root query is empty." : "This nested group is empty."}
          </p>
          <p className="mt-1 text-xs text-amber-100/60">
            Add a rule or nested group to make this branch executable again.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => addRule(group.id)}
              className="app-animate-soft rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-gray-950 hover:bg-amber-400"
            >
              Add rule
            </button>
            <button
              onClick={() => addGroup(group.id)}
              className="app-animate-soft rounded border border-amber-700 px-2 py-1 text-xs font-semibold text-amber-200 hover:border-amber-500"
            >
              Add group
            </button>
          </div>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {group.conditions.map((condition) => {
                if (isGroup(condition)) {
                  return (
                    <SortableNode key={condition.id} condition={condition}>
                      <QueryGroup group={condition} />
                    </SortableNode>
                  )
                }

                return (
                  <SortableNode key={condition.id} condition={condition}>
                    <QueryRule
                      rule={condition}
                      onUpdate={(changes) => updateRule(condition.id, changes)}
                      onDelete={() => removeNode(condition.id)}
                    />
                  </SortableNode>
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {!isCollapsed && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => addRule(group.id)}
            className="app-animate-soft rounded border border-dashed border-gray-700 px-2 py-1 text-xs text-gray-500 hover:border-gray-500 hover:text-gray-300"
          >
            + Add rule
          </button>
          <button
            onClick={() => addGroup(group.id)}
            className="app-animate-soft rounded border border-dashed border-gray-700 px-2 py-1 text-xs text-gray-500 hover:border-gray-500 hover:text-gray-300"
          >
            + Add group
          </button>
        </div>
      )}
    </div>
  )
}
