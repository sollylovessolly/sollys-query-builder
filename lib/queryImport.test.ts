import { describe, expect, it } from "vitest"
import { queryPresets } from "./queryPresets"
import { parseImportedQuery } from "./queryImport"

describe("parseImportedQuery", () => {
  it("accepts valid exported query JSON", () => {
    const result = parseImportedQuery(JSON.stringify(queryPresets[0].tree))

    expect(result.ok).toBe(true)
    expect(result.tree?.id).toBe(queryPresets[0].tree.id)
  })

  it("rejects malformed JSON", () => {
    expect(parseImportedQuery("{nope").ok).toBe(false)
  })

  it("rejects unknown fields", () => {
    const result = parseImportedQuery(
      JSON.stringify({
        id: "root",
        logic: "AND",
        conditions: [{ id: "bad", field: "password", operator: "equals", value: "secret" }],
      }),
    )

    expect(result.ok).toBe(false)
  })
})
