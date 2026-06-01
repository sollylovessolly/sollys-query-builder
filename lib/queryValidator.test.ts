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
})
