"use client"

import { schema } from "@/lib/mockData"
import { Rule } from "@/types"

interface Props {
  rule: Rule
  onUpdate: (changes: Partial<Rule>) => void
  onDelete: () => void
}

export function QueryRule({ rule, onUpdate, onDelete }: Props) {
  const fieldSchema = schema[rule.field]

  return (
    <div className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 p-2">
      <span className="cursor-grab text-zinc-600" aria-hidden="true">
        ::
      </span>

      <select
        value={rule.field}
        onChange={(event) => {
          const nextField = event.target.value
          const nextFieldSchema = schema[nextField]

          onUpdate({
            field: nextField,
            operator: nextFieldSchema.operators[0],
            value: "",
          })
        }}
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-blue-400"
      >
        {Object.keys(schema).map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>

      <select
        value={rule.operator}
        onChange={(event) => onUpdate({ operator: event.target.value })}
        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-purple-400"
      >
        {fieldSchema.operators.map((operator) => (
          <option key={operator} value={operator}>
            {operator}
          </option>
        ))}
      </select>

      {fieldSchema.type === "enum" ? (
        <select
          value={rule.value}
          onChange={(event) => onUpdate({ value: event.target.value })}
          className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-green-400"
        >
          <option value="">Select value</option>
          {fieldSchema.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={fieldSchema.type === "number" ? "number" : "text"}
          value={rule.value}
          onChange={(event) => onUpdate({ value: event.target.value })}
          className="w-24 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-green-400"
          placeholder="value"
        />
      )}

      <button onClick={onDelete} className="ml-auto text-sm text-zinc-600 hover:text-red-400">
        x
      </button>
    </div>
  )
}
