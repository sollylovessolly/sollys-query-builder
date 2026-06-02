import { schema as defaultSchema } from "./mockData"
import { Group, Rule, Schema, isGroup } from "../types"

type MongoCondition = Record<string, unknown>

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function coerceValue(rule: Rule, schema: Schema) {
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

function generateRuleCondition(rule: Rule, schema: Schema): MongoCondition {
  const value = coerceValue(rule, schema)

  switch (rule.operator) {
    case "equals":
      return { [rule.field]: value }
    case "not equals":
      return { [rule.field]: { $ne: value } }
    case "greater than":
      return { [rule.field]: { $gt: value } }
    case "less than":
      return { [rule.field]: { $lt: value } }
    case "before":
      return { [rule.field]: { $lt: value } }
    case "after":
      return { [rule.field]: { $gt: value } }
    case "between": {
      const { start, end } = parseBetweenValue(rule, schema)
      return { [rule.field]: { $gte: start, $lte: end } }
    }
    case "in array":
      return { [rule.field]: { $in: parseListValue(rule, schema) } }
    case "contains":
      return { [rule.field]: { $regex: escapeRegex(String(value)), $options: "i" } }
    case "starts with":
      return { [rule.field]: { $regex: `^${escapeRegex(String(value))}`, $options: "i" } }
    case "regex":
      return { [rule.field]: { $regex: String(value), $options: "i" } }
    case "is null":
      return { [rule.field]: null }
    case "is not null":
      return { [rule.field]: { $ne: null } }
    default:
      return { [rule.field]: { $unsupportedOperator: rule.operator, value } }
  }
}

export function generateMongoDB(group: Group, schema: Schema = defaultSchema): object {
  const logic = group.logic === "AND" ? "$and" : "$or"

  const conditions = group.conditions.map((condition) => {
    if (isGroup(condition)) {
      return generateMongoDB(condition, schema)
    }

    return generateRuleCondition(condition, schema)
  })

  return { [logic]: conditions }
}
