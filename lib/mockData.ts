import { Schema } from "../types"

//  defines what fields exist and what type they are
export const schema: Schema = {
  name:      { type: "string", operators: ["equals", "contains", "starts with"] },
  age:       { type: "number", operators: ["equals", "greater than", "less than"] },
  country:   { type: "enum",   operators: ["equals", "not equals"], options: ["Nigeria", "Ghana", "UK", "USA", "Brazil"] },
  status:    { type: "enum",   operators: ["equals", "not equals"], options: ["active", "inactive"] },
  purchases: { type: "number", operators: ["equals", "greater than", "less than"] },
}


export const mockDataset = [
  { id: 1, name: "solly",   age: 21, country: "Nigeria", status: "active",   purchases: 15 },
  { id: 2, name: "molly",  age: 17, country: "Ghana",   status: "active",   purchases: 3  },
  { id: 3, name: "babe",  age: 30, country: "Nigeria", status: "inactive", purchases: 22 },
  { id: 4, name: "jade", age: 22, country: "UK",      status: "active",   purchases: 8  },
  { id: 5, name: "tomiwa", age: 19, country: "Nigeria", status: "active",   purchases: 12 },
  { id: 6, name: "funmi",  age: 28, country: "Nigeria", status: "active",   purchases: 30 },
  { id: 7, name: "stargirl",   age: 15, country: "Brazil",  status: "inactive", purchases: 1  },
  { id: 8, name: "Sarah",  age: 35, country: "UK",      status: "active",   purchases: 5  },
]
