import { defaultDataSourceId, getDataSource } from "./mockData"
import { Group, Rule } from "../types"

interface ParseResult {
  ok: boolean
  tree?: Group
  dataSourceId?: string
  error?: string
}

const maxDepth = 20
const maxNodes = 250

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isRule(value: unknown, dataSourceId: string): value is Rule {
  if (!isRecord(value)) {
    return false
  }

  if (
    typeof value.id !== "string" ||
    typeof value.field !== "string" ||
    typeof value.operator !== "string" ||
    typeof value.value !== "string"
  ) {
    return false
  }

  const fieldSchema = getDataSource(dataSourceId).schema[value.field]
  return Boolean(fieldSchema && fieldSchema.operators.includes(value.operator))
}

function validateGroup(
  value: unknown,
  dataSourceId: string,
  depth = 0,
  nodeCount = { value: 0 },
): value is Group {
  if (!isRecord(value)) {
    return false
  }

  if (depth > maxDepth || nodeCount.value > maxNodes) {
    return false
  }

  if (typeof value.id !== "string" || (value.logic !== "AND" && value.logic !== "OR")) {
    return false
  }

  if (!Array.isArray(value.conditions)) {
    return false
  }

  nodeCount.value += 1

  return value.conditions.every((condition) => {
    if (!isRecord(condition)) {
      return false
    }

    nodeCount.value += 1

    if ("conditions" in condition) {
      return validateGroup(condition, dataSourceId, depth + 1, nodeCount)
    }

    return isRule(condition, dataSourceId)
  })
}

export function parseImportedQuery(json: string): ParseResult {
  try {
    const parsed: unknown = JSON.parse(json)
    const dataSourceId =
      isRecord(parsed) && typeof parsed.dataSourceId === "string"
        ? getDataSource(parsed.dataSourceId).id
        : defaultDataSourceId
    const tree = isRecord(parsed) && "tree" in parsed ? parsed.tree : parsed

    if (!validateGroup(tree, dataSourceId)) {
      return {
        ok: false,
        error: "Imported JSON must be a valid query group with known fields and operators.",
      }
    }

    return {
      ok: true,
      dataSourceId,
      tree,
    }
  } catch {
    return {
      ok: false,
      error: "Imported file is not valid JSON.",
    }
  }
}
