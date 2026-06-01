"use client"

import { schema } from "@/lib/mockData"

interface Props {
  field: string
  operator: string
  value: string
  onChange: (value: string) => void
}

function splitBetween(value: string) {
  const [start = "", end = ""] = value.split("..")
  return { start, end }
}

export function RuleValue({ field, operator, value, onChange }: Props) {
  const fieldSchema = schema[field]
  const isDate = fieldSchema.type === "date"

  if (operator === "is null" || operator === "is not null") {
    return (
      <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-500">
        no value
      </span>
    )
  }

  if (operator === "between") {
    const { start, end } = splitBetween(value)

    return (
      <div className="flex items-center gap-1">
        <input
          type={isDate ? "date" : "number"}
          value={start}
          onChange={(event) => onChange(`${event.target.value}..${end}`)}
          className="w-32 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-emerald-300"
          placeholder="from"
        />
        <span className="text-xs text-zinc-600">to</span>
        <input
          type={isDate ? "date" : "number"}
          value={end}
          onChange={(event) => onChange(`${start}..${event.target.value}`)}
          className="w-32 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-emerald-300"
          placeholder="to"
        />
      </div>
    )
  }

  if (operator === "in array") {
    return (
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-48 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-emerald-300"
        placeholder="Nigeria, Ghana"
      />
    )
  }

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
      type={fieldSchema.type === "number" ? "number" : isDate ? "date" : "text"}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-24 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-emerald-300"
      placeholder="value"
    />
  )
}
