"use client"

import { schema } from "@/lib/mockData"

interface Props {
  field: string
  value: string
  onChange: (value: string) => void
}

export function RuleValue({ field, value, onChange }: Props) {
  const fieldSchema = schema[field]

  if (fieldSchema.type === "enum") {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-emerald-300"
      >
        <option value="">Select value</option>
        {fieldSchema.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      type={fieldSchema.type === "number" ? "number" : "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-24 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-emerald-300"
      placeholder="value"
    />
  )
}
