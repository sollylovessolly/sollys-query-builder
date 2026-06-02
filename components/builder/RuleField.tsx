"use client"

import { memo } from "react"
import { getDataSource } from "@/lib/mockData"
import { useQueryStore } from "@/store/queryStore"
import { Rule } from "@/types"

interface Props {
  value: string
  onChange: (changes: Pick<Rule, "field" | "operator" | "value">) => void
}

function RuleFieldComponent({ value, onChange }: Props) {
  const dataSourceId = useQueryStore((state) => state.dataSourceId)
  const schema = getDataSource(dataSourceId).schema

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
      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-sky-400"
    >
      {Object.keys(schema).map((field) => (
        <option key={field} value={field}>
          {field}
        </option>
      ))}
    </select>
  )
}

export const RuleField = memo(RuleFieldComponent)
