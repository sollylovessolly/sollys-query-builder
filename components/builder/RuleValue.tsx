"use client"

import { memo } from "react"
import { getDataSource } from "@/lib/mockData"
import { useQueryStore } from "@/store/queryStore"

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

function RuleValueComponent({ field, operator, value, onChange }: Props) {
  const dataSourceId = useQueryStore((state) => state.dataSourceId)
  const schema = getDataSource(dataSourceId).schema
  const fieldSchema = schema[field]
  if (!fieldSchema) {
    return (
      <span className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-zinc-500">
        invalid field
      </span>
    )
  }

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
    if (fieldSchema.type === "enum") {
      const selectedValues = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)

      function toggleOption(option: string) {
        const nextValues = selectedValues.includes(option)
          ? selectedValues.filter((item) => item !== option)
          : [...selectedValues, option]

        onChange(nextValues.join(", "))
      }

      return (
        <div className="flex flex-wrap gap-1.5">
          {fieldSchema.options?.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={`app-animate-soft rounded-md border px-2 py-1 text-xs ${
                selectedValues.includes(option)
                  ? "border-rose-800 bg-rose-950/60 text-rose-100"
                  : "border-zinc-700 bg-zinc-900 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )
    }

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

export const RuleValue = memo(RuleValueComponent)
