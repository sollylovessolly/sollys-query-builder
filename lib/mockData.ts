import { Schema } from "../types"

//  defines what fields exist and what type they are
export const schema: Schema = {
  name: { type: "string", operators: ["equals", "not equals", "contains", "starts with", "regex", "is null", "is not null"] },
  age: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "in array", "is null", "is not null"] },
  country: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["Nigeria", "Ghana", "UK", "USA", "Brazil"] },
  status: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["active", "inactive"] },
  purchases: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "in array", "is null", "is not null"] },
  createdAt: { type: "date", operators: ["equals", "before", "after", "between", "is null", "is not null"] },
}


export const mockDataset = [
  { id: 1, name: "solly", age: 21, country: "Nigeria", status: "active", purchases: 15, createdAt: "2026-01-10" },
  { id: 2, name: "molly", age: 17, country: "Ghana", status: "active", purchases: 3, createdAt: "2026-02-14" },
  { id: 3, name: "babe", age: 30, country: "Nigeria", status: "inactive", purchases: 22, createdAt: "2025-11-28" },
  { id: 4, name: "jade", age: 22, country: "UK", status: "active", purchases: 8, createdAt: "2026-03-03" },
  { id: 5, name: "tomiwa", age: 19, country: "Nigeria", status: "active", purchases: 12, createdAt: "2026-04-19" },
  { id: 6, name: "funmi", age: 28, country: "Nigeria", status: "active", purchases: 30, createdAt: "2025-12-05" },
  { id: 7, name: "stargirl", age: 15, country: "Brazil", status: "inactive", purchases: 1, createdAt: "2026-05-22" },
  { id: 8, name: "Sarah", age: 35, country: "UK", status: "active", purchases: 5, createdAt: "2026-01-27" },
]
