import { describe, expect, it } from "vitest"
import { executeQuery, QueryRow } from "./queryExecutor"
import { Group } from "../types"

const rows: QueryRow[] = [
  { id: 1, name: "solly", age: 21, country: "Nigeria", status: "active", purchases: 15 },
  { id: 2, name: "molly", age: 17, country: "Ghana", status: "active", purchases: 3 },
  { id: 3, name: "jade", age: 30, country: "UK", status: "inactive", purchases: 22 },
]

describe("executeQuery", () => {
  it("filters rows with AND conditions", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [
        { id: "age", field: "age", operator: "greater than", value: "18" },
        { id: "status", field: "status", operator: "equals", value: "active" },
      ],
    }

    expect(executeQuery(tree, rows).map((row) => row.id)).toEqual([1])
  })

  it("filters rows with nested OR conditions", () => {
    const tree: Group = {
      id: "root",
      logic: "OR",
      conditions: [
        { id: "country", field: "country", operator: "equals", value: "Nigeria" },
        { id: "name", field: "name", operator: "starts with", value: "ja" },
      ],
    }

    expect(executeQuery(tree, rows).map((row) => row.id)).toEqual([1, 3])
  })
})
