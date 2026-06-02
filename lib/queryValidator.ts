import { schema as defaultSchema } from "./mockData"
import { Group, Rule, Schema, isGroup } from "../types"

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

function isValidDate(value: string) {
  return value.trim() !== "" && Number.isFinite(Date.parse(value))
}

function validateRule(rule: Rule, path: string, schema: Schema): ValidationIssue[] {
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

  const requiresValue = rule.operator !== "is null" && rule.operator !== "is not null"

  if (requiresValue && rule.value.trim() === "") {
    issues.push(createIssue(rule.id, path, "error", `"${rule.field}" needs a value.`))
  }

  if (
    fieldSchema.type === "number" &&
    rule.value.trim() !== "" &&
    rule.operator !== "between" &&
    rule.operator !== "in array" &&
    !Number.isFinite(Number(rule.value))
  ) {
    issues.push(createIssue(rule.id, path, "error", `"${rule.field}" must be a valid number.`))
  }

  if (fieldSchema.type === "enum" && rule.value !== "" && !fieldSchema.options?.includes(rule.value)) {
    if (rule.operator !== "in array") {
      issues.push(createIssue(rule.id, path, "error", `"${rule.value}" is not an allowed ${rule.field} option.`))
    }
  }

  if (rule.operator === "in array") {
    const values = rule.value.split(",").map((value) => value.trim()).filter(Boolean)

    if (values.length === 0) {
      issues.push(createIssue(rule.id, path, "error", `"${rule.field}" needs at least one array value.`))
    }

    if (fieldSchema.type === "number" && values.some((value) => !Number.isFinite(Number(value)))) {
      issues.push(createIssue(rule.id, path, "error", `"${rule.field}" array values must be valid numbers.`))
    }

    if (fieldSchema.type === "enum" && values.some((value) => !fieldSchema.options?.includes(value))) {
      issues.push(createIssue(rule.id, path, "error", `"${rule.field}" array includes an invalid option.`))
    }
  }

  if (rule.operator === "between") {
    const [start = "", end = ""] = rule.value.split("..")

    if (!start || !end) {
      issues.push(createIssue(rule.id, path, "error", `"${rule.field}" needs both range values.`))
    }

    if (fieldSchema.type === "number" && (!Number.isFinite(Number(start)) || !Number.isFinite(Number(end)))) {
      issues.push(createIssue(rule.id, path, "error", `"${rule.field}" range values must be valid numbers.`))
    }

    if (fieldSchema.type === "date" && (!isValidDate(start) || !isValidDate(end))) {
      issues.push(createIssue(rule.id, path, "error", `"${rule.field}" range values must be valid dates.`))
    }
  }

  if (fieldSchema.type === "date" && requiresValue && rule.operator !== "between" && !isValidDate(rule.value)) {
    issues.push(createIssue(rule.id, path, "error", `"${rule.field}" must be a valid date.`))
  }

  if (rule.operator === "regex") {
    try {
      new RegExp(rule.value)
    } catch {
      issues.push(createIssue(rule.id, path, "error", `"${rule.value}" is not a valid regex pattern.`))
    }
  }

  return issues
}

function validateGroup(group: Group, path: string, schema: Schema): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (group.conditions.length === 0) {
    issues.push(createIssue(group.id, path, "error", "Group must contain at least one rule or nested group."))
  }

  group.conditions.forEach((condition, index) => {
    const childPath = `${path}.${index + 1}`

    if (isGroup(condition)) {
      issues.push(...validateGroup(condition, childPath, schema))
      return
    }

    issues.push(...validateRule(condition, childPath, schema))
  })

  return issues
}

export function validateQuery(group: Group, schema: Schema = defaultSchema): ValidationResult {
  const issues = validateGroup(group, "root", schema)

  return {
    isValid: issues.every((issue) => issue.severity !== "error"),
    issues,
  }
}
