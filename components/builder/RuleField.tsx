"use client"

import { schema } from "@/lib/mockData"
import { Rule } from "@/types"

interface Props {
  value: string
  onChange: (changes: Pick<Rule, "field" | "operator" | "value">) => void
}

export function RuleField({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(event) => {
        const nextField = event.target.value
        const nextFieldSchema = schema[nextField]

        onChange({
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
  )
}
