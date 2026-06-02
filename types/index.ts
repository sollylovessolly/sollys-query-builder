export interface Rule {
  id: string
  field: string
  operator: string
  value: string
}

export interface Group {
  id: string
  logic: "AND" | "OR"
  conditions: (Rule | Group)[]
}


export function isGroup(condition: Rule | Group): condition is Group {
  return "conditions" in condition
}

export interface FieldSchema {
  type: "string" | "number" | "enum" | "date"
  operators: string[]
  options?: string[]   //for enum feilds
}

export interface Schema {
  [fieldName: string]: FieldSchema
}

export interface DataSource {
  id: string
  name: string
  description: string
  schema: Schema
  rows: Record<string, string | number | null>[]
}
