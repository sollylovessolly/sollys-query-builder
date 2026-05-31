"use client"

import { Rule } from "@/types"
import { RuleField } from "./RuleField"
import { RuleOperator } from "./RuleOperator"
import { RuleValue } from "./RuleValue"

interface Props {
  rule: Rule
  onUpdate: (changes: Partial<Rule>) => void
  onDelete: () => void
}

export function QueryRule({ rule, onUpdate, onDelete }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 p-2">
      <span className="cursor-grab text-zinc-600" aria-hidden="true">
        ::
      </span>

      <RuleField
        value={rule.field}
        onChange={(changes) => onUpdate(changes)}
      />
      <RuleOperator
        field={rule.field}
        value={rule.operator}
        onChange={(operator) => onUpdate({ operator })}
      />
      <RuleValue
        field={rule.field}
        value={rule.value}
        onChange={(value) => onUpdate({ value })}
      />

      <button onClick={onDelete} className="ml-auto text-sm text-zinc-600 hover:text-red-400">
        x
      </button>
    </div>
  )
}
