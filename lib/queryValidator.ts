import { schema } from "@/lib/mockData"
import { Group, Rule, isGroup } from "@/types"

export type ValidationSeverity = "error" | "warning"

export interface ValidationIssue {
  id: string
  nodeId: string
  path: string
  severity: ValidationSeverity
  message: string
}

export interface ValidationResult {
  isValid: boolean
  issues: ValidationIssue[]
}

function createIssue(
  nodeId: string,
  path: string,
  severity: ValidationSeverity,
  message: string,
): ValidationIssue {
  return {
    id: `${nodeId}:${message}`,
    nodeId,
    path,
    severity,
    message,
  }
}

function validateRule(rule: Rule, path: string): ValidationIssue[] {
  const fieldSchema = schema[rule.field]

  if (!fieldSchema) {
    return [createIssue(rule.id, path, "error", `Unknown field "${rule.field}".`)]
  }

  const issues: ValidationIssue[] = []

  if (!fieldSchema.operators.includes(rule.operator)) {
    issues.push(
      createIssue(
        rule.id,
        path,
        "error",
        `"${rule.operator}" is not valid for ${fieldSchema.type} field "${rule.field}".`,
      ),
    )
  }

  if (rule.value.trim() === "") {
    issues.push(createIssue(rule.id, path, "error", `"${rule.field}" needs a value.`))
  }

  if (fieldSchema.type === "number" && rule.value.trim() !== "" && !Number.isFinite(Number(rule.value))) {
    issues.push(createIssue(rule.id, path, "error", `"${rule.field}" must be a valid number.`))
  }

  if (fieldSchema.type === "enum" && rule.value !== "" && !fieldSchema.options?.includes(rule.value)) {
    issues.push(createIssue(rule.id, path, "error", `"${rule.value}" is not an allowed ${rule.field} option.`))
  }

  return issues
}

function validateGroup(group: Group, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (group.conditions.length === 0) {
    issues.push(createIssue(group.id, path, "error", "Group must contain at least one rule or nested group."))
  }

  group.conditions.forEach((condition, index) => {
    const childPath = `${path}.${index + 1}`

    if (isGroup(condition)) {
      issues.push(...validateGroup(condition, childPath))
      return
    }

    issues.push(...validateRule(condition, childPath))
  })

  return issues
}

export function validateQuery(group: Group): ValidationResult {
  const issues = validateGroup(group, "root")

  return {
    isValid: issues.every((issue) => issue.severity !== "error"),
    issues,
  }
}
