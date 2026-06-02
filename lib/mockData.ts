import { DataSource, Schema } from "../types"

const userSchema: Schema = {
  name: { type: "string", operators: ["equals", "not equals", "contains", "starts with", "regex", "is null", "is not null"] },
  age: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "is null", "is not null"] },
  country: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["Nigeria", "Ghana", "UK", "USA", "Brazil"] },
  status: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["active", "inactive"] },
  purchases: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "is null", "is not null"] },
  createdAt: { type: "date", operators: ["equals", "before", "after", "between", "is null", "is not null"] },
}

const orderSchema: Schema = {
  orderId: { type: "string", operators: ["equals", "not equals", "contains", "starts with", "regex", "is null", "is not null"] },
  total: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "is null", "is not null"] },
  paymentStatus: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["paid", "pending", "failed", "refunded"] },
  region: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["Africa", "Europe", "North America", "South America"] },
  createdAt: { type: "date", operators: ["equals", "before", "after", "between", "is null", "is not null"] },
}

const productSchema: Schema = {
  title: { type: "string", operators: ["equals", "not equals", "contains", "starts with", "regex", "is null", "is not null"] },
  category: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["software", "course", "template", "ebook"] },
  price: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "is null", "is not null"] },
  stock: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "is null", "is not null"] },
  rating: { type: "number", operators: ["equals", "not equals", "greater than", "less than", "between", "is null", "is not null"] },
  status: { type: "enum", operators: ["equals", "not equals", "in array", "is null", "is not null"], options: ["published", "draft", "archived"] },
}

export const dataSources: DataSource[] = [
  {
    id: "users",
    name: "Users",
    description: "Mock customer dataset",
    schema: userSchema,
    rows: [
      { id: 1, name: "solly", age: 21, country: "Nigeria", status: "active", purchases: 15, createdAt: "2026-01-10" },
      { id: 2, name: "molly", age: 17, country: "Ghana", status: "active", purchases: 3, createdAt: "2026-02-14" },
      { id: 3, name: "babe", age: 30, country: "Nigeria", status: "inactive", purchases: 22, createdAt: "2025-11-28" },
      { id: 4, name: "jade", age: 22, country: "UK", status: "active", purchases: 8, createdAt: "2026-03-03" },
      { id: 5, name: "tomiwa", age: 19, country: "Nigeria", status: "active", purchases: 12, createdAt: "2026-04-19" },
      { id: 6, name: "funmi", age: 28, country: "Nigeria", status: "active", purchases: 30, createdAt: "2025-12-05" },
      { id: 7, name: "stargirl", age: 15, country: "Brazil", status: "inactive", purchases: 1, createdAt: "2026-05-22" },
      { id: 8, name: "Sarah", age: 35, country: "UK", status: "active", purchases: 5, createdAt: "2026-01-27" },
    ],
  },
  {
    id: "orders",
    name: "Orders",
    description: "Mock ecommerce orders",
    schema: orderSchema,
    rows: [
      { id: 1, orderId: "ORD-1001", total: 240, paymentStatus: "paid", region: "Africa", createdAt: "2026-01-08" },
      { id: 2, orderId: "ORD-1002", total: 79, paymentStatus: "pending", region: "Europe", createdAt: "2026-02-17" },
      { id: 3, orderId: "ORD-1003", total: 560, paymentStatus: "paid", region: "North America", createdAt: "2026-03-21" },
      { id: 4, orderId: "ORD-1004", total: 35, paymentStatus: "failed", region: "Africa", createdAt: "2026-04-11" },
      { id: 5, orderId: "ORD-1005", total: 145, paymentStatus: "refunded", region: "South America", createdAt: "2026-05-01" },
      { id: 6, orderId: "ORD-1006", total: 310, paymentStatus: "paid", region: "Europe", createdAt: "2026-05-20" },
    ],
  },
  {
    id: "products",
    name: "Products",
    description: "Mock product catalog",
    schema: productSchema,
    rows: [
      { id: 1, title: "Query Builder Kit", category: "template", price: 49, stock: 18, rating: 4.8, status: "published" },
      { id: 2, title: "API Testing Course", category: "course", price: 129, stock: 7, rating: 4.6, status: "published" },
      { id: 3, title: "Admin Dashboard UI", category: "template", price: 79, stock: 0, rating: 4.4, status: "draft" },
      { id: 4, title: "Mongo Filters Ebook", category: "ebook", price: 19, stock: 43, rating: 4.1, status: "published" },
      { id: 5, title: "Schema Studio", category: "software", price: 199, stock: 3, rating: 4.9, status: "archived" },
    ],
  },
]

export const defaultDataSourceId = dataSources[0].id
export const schema = dataSources[0].schema
export const mockDataset = dataSources[0].rows

export function getDataSource(sourceId: string) {
  return dataSources.find((source) => source.id === sourceId) ?? dataSources[0]
}
