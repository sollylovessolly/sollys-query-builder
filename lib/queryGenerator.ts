import { schema } from "@/lib/mockData"
import { Group, Rule, isGroup } from "@/types"

type MongoCondition = Record<string, unknown>

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function coerceValue(rule: Rule) {
  const fieldSchema = schema[rule.field]

  if (fieldSchema?.type === "number") {
    const parsed = Number(rule.value)
    return Number.isFinite(parsed) ? parsed : rule.value
  }

  return rule.value
}

function generateRuleCondition(rule: Rule): MongoCondition {
  const value = coerceValue(rule)

  switch (rule.operator) {
    case "equals":
      return { [rule.field]: value }
    case "not equals":
      return { [rule.field]: { $ne: value } }
    case "greater than":
      return { [rule.field]: { $gt: value } }
    case "less than":
      return { [rule.field]: { $lt: value } }
    case "contains":
      return { [rule.field]: { $regex: escapeRegex(String(value)), $options: "i" } }
    case "starts with":
      return { [rule.field]: { $regex: `^${escapeRegex(String(value))}`, $options: "i" } }
    default:
      return { [rule.field]: { $unsupportedOperator: rule.operator, value } }
  }
}

export function generateMongoDB(group: Group): object {
  const logic = group.logic === "AND" ? "$and" : "$or"

  const conditions = group.conditions.map((condition) => {
    if (isGroup(condition)) {
      return generateMongoDB(condition)
    }

    return generateRuleCondition(condition)
  })

  return { [logic]: conditions }
}
