"use client"

import { memo } from "react"
import { getDataSource } from "@/lib/mockData"
import { useQueryStore } from "@/store/queryStore"

interface Props {
  field: string
  value: string
  onChange: (operator: string) => void
}

function RuleOperatorComponent({ field, value, onChange }: Props) {
  const dataSourceId = useQueryStore((state) => state.dataSourceId)
  const schema = getDataSource(dataSourceId).schema
  const fieldSchema = schema[field]

  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm text-rose-300"
    >
      {fieldSchema?.operators.map((operator) => (
        <option key={operator} value={operator}>
          {operator}
        </option>
      ))}
    </select>
  )
}

export const RuleOperator = memo(RuleOperatorComponent)
