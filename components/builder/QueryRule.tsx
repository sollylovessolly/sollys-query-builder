
import { Rule } from "@/types"
import { schema } from "@/lib/mockData"

interface Props {
  rule: Rule
  onUpdate: (changes: Partial<Rule>) => void
  onDelete: () => void
}

export function QueryRule({ rule, onUpdate, onDelete }: Props) {
  const fieldSchema = schema[rule.field]

  return (
    <div className="flex items-center gap-2 p-2 rounded-md bg-zinc-800 border border-zinc-700">
      {/* drag handle */}
      <span className="text-zinc-600 cursor-grab">⠿</span>

      {/* field selector */}
      <select
        value={rule.field}
        onChange={e => onUpdate({ field: e.target.value, operator: schema[e.target.value].operators[0], value: "" })}
        className="bg-zinc-900 text-blue-400 text-sm rounded px-2 py-1 border border-zinc-700"
      >
        {Object.keys(schema).map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>

      {/* operator selector */}
      <select
        value={rule.operator}
        onChange={e => onUpdate({ operator: e.target.value })}
        className="bg-zinc-900 text-purple-400 text-sm rounded px-2 py-1 border border-zinc-700"
      >
        {fieldSchema.operators.map(op => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>

      {/* value input — changes based on field type */}
      {fieldSchema.type === "enum" ? (
        <select
          value={rule.value}
          onChange={e => onUpdate({ value: e.target.value })}
          className="bg-zinc-900 text-green-400 text-sm rounded px-2 py-1 border border-zinc-700"
        >
          {fieldSchema.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={fieldSchema.type === "number" ? "number" : "text"}
          value={rule.value}
          onChange={e => onUpdate({ value: e.target.value })}
          className="bg-zinc-900 text-green-400 text-sm rounded px-2 py-1 border border-zinc-700 w-24"
          placeholder="value"
        />
      )}

      {/* delete */}
      <button onClick={onDelete} className="text-zinc-600 hover:text-red-400 ml-auto text-sm">✕</button>
    </div>
  )
}