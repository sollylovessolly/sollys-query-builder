import { describe, expect, it } from "vitest"
import { queryPresets } from "./queryPresets"
import { validateQuery } from "./queryValidator"
import { Group } from "../types"

describe("validateQuery", () => {
  it("accepts a valid preset query", () => {
    expect(validateQuery(queryPresets[0].tree).isValid).toBe(true)
  })

  it("rejects empty groups and empty rule values", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [
        { id: "empty-rule", field: "age", operator: "equals", value: "" },
        { id: "empty-group", logic: "OR", conditions: [] },
      ],
    }

    const result = validateQuery(tree)

    expect(result.isValid).toBe(false)
    expect(result.issues.map((issue) => issue.message)).toContain('"age" needs a value.')
    expect(result.issues.map((issue) => issue.message)).toContain(
      "Group must contain at least one rule or nested group.",
    )
  })

  it("rejects incompatible operators", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [{ id: "bad-op", field: "age", operator: "contains", value: "2" }],
    }

    expect(validateQuery(tree).isValid).toBe(false)
  })

  it("validates advanced operators", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [
        { id: "age-range", field: "age", operator: "between", value: "18..30" },
        { id: "countries", field: "country", operator: "in array", value: "Nigeria, Ghana" },
        { id: "created", field: "createdAt", operator: "before", value: "2026-06-01" },
        { id: "null-check", field: "name", operator: "is not null", value: "" },
      ],
    }

    expect(validateQuery(tree).isValid).toBe(true)
  })

  it("rejects invalid advanced operator values", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [
        { id: "bad-range", field: "age", operator: "between", value: "18.." },
        { id: "bad-date", field: "createdAt", operator: "after", value: "not-a-date" },
        { id: "bad-regex", field: "name", operator: "regex", value: "[" },
      ],
    }

    expect(validateQuery(tree).isValid).toBe(false)
  })
})
