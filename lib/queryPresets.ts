import { Group } from "../types"

export interface QueryPreset {
  id: string
  dataSourceId: string
  name: string
  description: string
  tree: Group
}

export const queryPresets: QueryPreset[] = [
  {
    id: "active-nigerian-buyers",
    dataSourceId: "users",
    name: "Active Nigerian buyers",
    description: "Users in Nigeria with active status and more than 10 purchases.",
    tree: {
      id: "preset-active-nigerian-buyers",
      logic: "AND",
      conditions: [
        {
          id: "preset-country-nigeria",
          field: "country",
          operator: "equals",
          value: "Nigeria",
        },
        {
          id: "preset-status-active",
          field: "status",
          operator: "equals",
          value: "active",
        },
        {
          id: "preset-purchases-high",
          field: "purchases",
          operator: "greater than",
          value: "10",
        },
      ],
    },
  },
  {
    id: "adult-or-loyal",
    dataSourceId: "users",
    name: "Adults or loyal shoppers",
    description: "People older than 18 or users with more than 20 purchases.",
    tree: {
      id: "preset-adult-or-loyal",
      logic: "OR",
      conditions: [
        {
          id: "preset-age-adult",
          field: "age",
          operator: "greater than",
          value: "18",
        },
        {
          id: "preset-purchases-loyal",
          field: "purchases",
          operator: "greater than",
          value: "20",
        },
      ],
    },
  },
  {
    id: "segmented-active-users",
    dataSourceId: "users",
    name: "Segmented active users",
    description: "Active users who are either Nigerian adults or high purchase customers.",
    tree: {
      id: "preset-segmented-active-users",
      logic: "AND",
      conditions: [
        {
          id: "preset-segment-status-active",
          field: "status",
          operator: "equals",
          value: "active",
        },
        {
          id: "preset-segment-nested-or",
          logic: "OR",
          conditions: [
            {
              id: "preset-segment-country-nigeria",
              field: "country",
              operator: "equals",
              value: "Nigeria",
            },
            {
              id: "preset-segment-purchases",
              field: "purchases",
              operator: "greater than",
              value: "10",
            },
          ],
        },
      ],
    },
  },
  {
    id: "paid-large-orders",
    dataSourceId: "orders",
    name: "Paid large orders",
    description: "Paid orders with totals above 200 across Africa or Europe.",
    tree: {
      id: "preset-paid-large-orders",
      logic: "AND",
      conditions: [
        {
          id: "preset-order-payment-paid",
          field: "paymentStatus",
          operator: "equals",
          value: "paid",
        },
        {
          id: "preset-order-total-high",
          field: "total",
          operator: "greater than",
          value: "200",
        },
        {
          id: "preset-order-region-list",
          field: "region",
          operator: "in array",
          value: "Africa, Europe",
        },
      ],
    },
  },
  {
    id: "recent-problem-orders",
    dataSourceId: "orders",
    name: "Recent problem orders",
    description: "Pending or failed orders created after March 1, 2026.",
    tree: {
      id: "preset-recent-problem-orders",
      logic: "AND",
      conditions: [
        {
          id: "preset-order-status-problem",
          field: "paymentStatus",
          operator: "in array",
          value: "pending, failed",
        },
        {
          id: "preset-order-created-recent",
          field: "createdAt",
          operator: "after",
          value: "2026-03-01",
        },
      ],
    },
  },
  {
    id: "published-digital-products",
    dataSourceId: "products",
    name: "Published digital products",
    description: "Published templates or courses with strong ratings.",
    tree: {
      id: "preset-published-digital-products",
      logic: "AND",
      conditions: [
        {
          id: "preset-product-status-published",
          field: "status",
          operator: "equals",
          value: "published",
        },
        {
          id: "preset-product-category-list",
          field: "category",
          operator: "in array",
          value: "template, course",
        },
        {
          id: "preset-product-rating-high",
          field: "rating",
          operator: "greater than",
          value: "4.5",
        },
      ],
    },
  },
  {
    id: "low-stock-products",
    dataSourceId: "products",
    name: "Low stock products",
    description: "Products with stock below 10 that are not archived.",
    tree: {
      id: "preset-low-stock-products",
      logic: "AND",
      conditions: [
        {
          id: "preset-product-stock-low",
          field: "stock",
          operator: "less than",
          value: "10",
        },
        {
          id: "preset-product-status-not-archived",
          field: "status",
          operator: "not equals",
          value: "archived",
        },
      ],
    },
  },
]
