import { schema as defaultSchema } from "./mockData"
import { Group, Rule, Schema, isGroup } from "../types"

export type QueryRow = Record<string, string | number | null>

function coerceRuleValue(rule: Rule, schema: Schema) {
  const fieldSchema = schema[rule.field]

  if (fieldSchema?.type === "number") {
    const parsed = Number(rule.value)
    return Number.isFinite(parsed) ? parsed : rule.value
  }

  return rule.value
}

function parseListValue(rule: Rule, schema: Schema) {
  return rule.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      if (schema[rule.field]?.type !== "number") {
        return value
      }

      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : value
    })
}

function parseBetweenValue(rule: Rule, schema: Schema) {
  const [start = "", end = ""] = rule.value.split("..")

  if (schema[rule.field]?.type === "number") {
    return {
      start: Number(start),
      end: Number(end),
    }
  }

  return { start, end }
}

function matchRule(row: QueryRow, rule: Rule, schema: Schema) {
  const rowValue = row[rule.field]
  const ruleValue = coerceRuleValue(rule, schema)

  switch (rule.operator) {
    case "equals":
      return rowValue === ruleValue
    case "not equals":
      return rowValue !== ruleValue
    case "greater than":
      return Number(rowValue) > Number(ruleValue)
    case "less than":
      return Number(rowValue) < Number(ruleValue)
    case "before":
      return String(rowValue) < String(ruleValue)
    case "after":
      return String(rowValue) > String(ruleValue)
    case "between": {
      const { start, end } = parseBetweenValue(rule, schema)

      if (schema[rule.field]?.type === "number") {
        return Number(rowValue) >= Number(start) && Number(rowValue) <= Number(end)
      }

      return String(rowValue) >= String(start) && String(rowValue) <= String(end)
    }
    case "in array":
      return rowValue === null || rowValue === undefined ? false : parseListValue(rule, schema).includes(rowValue)
    case "contains":
      return String(rowValue).toLowerCase().includes(String(ruleValue).toLowerCase())
    case "starts with":
      return String(rowValue).toLowerCase().startsWith(String(ruleValue).toLowerCase())
    case "regex":
      return new RegExp(String(ruleValue), "i").test(String(rowValue))
    case "is null":
      return rowValue === null || rowValue === undefined || rowValue === ""
    case "is not null":
      return rowValue !== null && rowValue !== undefined && rowValue !== ""
    default:
      return false
  }
}

function matchGroup(row: QueryRow, group: Group, schema: Schema): boolean {
  if (group.conditions.length === 0) {
    return false
  }

  const checks = group.conditions.map((condition) => {
    if (isGroup(condition)) {
      return matchGroup(row, condition, schema)
    }

    return matchRule(row, condition, schema)
  })

  return group.logic === "AND" ? checks.every(Boolean) : checks.some(Boolean)
}

export function executeQuery(group: Group, rows: QueryRow[], schema: Schema = defaultSchema) {
  return rows.filter((row) => matchGroup(row, group, schema))
}
