import { Group, Rule, isGroup } from "@/types"

export function generateMongoDB(group: Group): object {
  const logic = group.logic === "AND" ? "$and" : "$or"

  const conditions = group.conditions.map(condition => {
    if (isGroup(condition)) {
      // thia is recursion.... if it's a group, call this function again on it
      return generateMongoDB(condition)
    }

    // it's a rule, convert to MongoDB syntax
    const operatorMap: Record<string, string> = {
      "equals":       "",       // { field: value }
      "greater than": "$gt",
      "less than":    "$lt",
      "not equals":   "$ne",
      "contains":     "$regex",
    }

    const op = operatorMap[condition.operator]
    const val = isNaN(Number(condition.value)) ? condition.value : Number(condition.value)

    if (!op) return { [condition.field]: val }
    return { [condition.field]: { [op]: val } }
  })

  return { [logic]: conditions }
}