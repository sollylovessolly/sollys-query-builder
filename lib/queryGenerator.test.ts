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
})
