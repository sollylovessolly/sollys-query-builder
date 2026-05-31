import { Group, isGroup } from "@/types"

export function generateMongoDB(group: Group): object {
  const logic = group.logic === "AND" ? "$and" : "$or"

  const conditions = group.conditions.map((condition) => {
    if (isGroup(condition)) {
      return generateMongoDB(condition)
    }

    const operatorMap: Record<string, string> = {
      "equals": "",
      "greater than": "$gt",
      "less than": "$lt",
      "not equals": "$ne",
      "contains": "$regex",
    }

    const op = operatorMap[condition.operator]
    const val = isNaN(Number(condition.value)) ? condition.value : Number(condition.value)

    if (!op) return { [condition.field]: val }
    return { [condition.field]: { [op]: val } }
  })

  return { [logic]: conditions }
}
