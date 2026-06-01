import { describe, expect, it } from "vitest"
import { generateMongoDB } from "./queryGenerator"
import { Group } from "../types"

describe("generateMongoDB", () => {
  it("generates nested mongo logic", () => {
    const tree: Group = {
      id: "root",
      logic: "OR",
      conditions: [
        {
          id: "adult-nigeria",
          logic: "AND",
          conditions: [
            { id: "age", field: "age", operator: "greater than", value: "18" },
            { id: "country", field: "country", operator: "equals", value: "Nigeria" },
          ],
        },
        { id: "status", field: "status", operator: "equals", value: "active" },
      ],
    }

    expect(generateMongoDB(tree)).toEqual({
      $or: [
        {
          $and: [
            { age: { $gt: 18 } },
            { country: "Nigeria" },
          ],
        },
        { status: "active" },
      ],
    })
  })

  it("escapes starts-with regex values", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [{ id: "name", field: "name", operator: "starts with", value: "sol.ly" }],
    }

    expect(generateMongoDB(tree)).toEqual({
      $and: [{ name: { $regex: "^sol\\.ly", $options: "i" } }],
    })
  })

  it("generates array, range, date, regex, and null operators", () => {
    const tree: Group = {
      id: "root",
      logic: "AND",
      conditions: [
        { id: "countries", field: "country", operator: "in array", value: "Nigeria, Ghana" },
        { id: "age-range", field: "age", operator: "between", value: "18..30" },
        { id: "created", field: "createdAt", operator: "after", value: "2026-01-01" },
        { id: "name-regex", field: "name", operator: "regex", value: "^s" },
        { id: "name-null", field: "name", operator: "is not null", value: "" },
      ],
    }

    expect(generateMongoDB(tree)).toEqual({
      $and: [
        { country: { $in: ["Nigeria", "Ghana"] } },
        { age: { $gte: 18, $lte: 30 } },
        { createdAt: { $gt: "2026-01-01" } },
        { name: { $regex: "^s", $options: "i" } },
        { name: { $ne: null } },
      ],
    })
  })
})
