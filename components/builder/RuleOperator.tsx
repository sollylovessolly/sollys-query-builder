"use client"

import { schema } from "@/lib/mockData"

interface Props {
  field: string
  value: string
  onChange: (operator: string) => void
}

export function RuleOperator({ field, value, onChange }: Props) {
  const fieldSchema = schema[field]

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-rose-300"
    >
      {fieldSchema.operators.map((operator) => (
        <option key={operator} value={operator}>
          {operator}
        </option>
      ))}
    </select>
  )
}
