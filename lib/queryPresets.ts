import { Group } from "../types"

export interface QueryPreset {
  id: string
  name: string
  description: string
  tree: Group
}

export const queryPresets: QueryPreset[] = [
  {
    id: "active-nigerian-buyers",
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
]
