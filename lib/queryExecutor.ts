import { schema } from "./mockData"
import { Group, Rule, isGroup } from "../types"

export type QueryRow = Record<string, string | number>

function coerceRuleValue(rule: Rule) {
  const fieldSchema = schema[rule.field]

  if (fieldSchema?.type === "number") {
    const parsed = Number(rule.value)
    return Number.isFinite(parsed) ? parsed : rule.value
  }

  return rule.value
}

function matchRule(row: QueryRow, rule: Rule) {
  const rowValue = row[rule.field]
  const ruleValue = coerceRuleValue(rule)

  switch (rule.operator) {
    case "equals":
      return rowValue === ruleValue
    case "not equals":
      return rowValue !== ruleValue
    case "greater than":
      return Number(rowValue) > Number(ruleValue)
    case "less than":
      return Number(rowValue) < Number(ruleValue)
    case "contains":
      return String(rowValue).toLowerCase().includes(String(ruleValue).toLowerCase())
    case "starts with":
      return String(rowValue).toLowerCase().startsWith(String(ruleValue).toLowerCase())
    default:
      return false
  }
}

function matchGroup(row: QueryRow, group: Group): boolean {
  if (group.conditions.length === 0) {
    return false
  }

  const checks = group.conditions.map((condition) => {
    if (isGroup(condition)) {
      return matchGroup(row, condition)
    }

    return matchRule(row, condition)
  })

  return group.logic === "AND" ? checks.every(Boolean) : checks.some(Boolean)
}

export function executeQuery(group: Group, rows: QueryRow[]) {
  return rows.filter((row) => matchGroup(row, group))
}
