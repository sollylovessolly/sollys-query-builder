import { create } from "zustand"
import { executeQuery, QueryRow } from "@/lib/queryExecutor"
import { mockDataset, schema } from "@/lib/mockData"
import { validateQuery } from "@/lib/queryValidator"
import { Group, Rule, isGroup } from "@/types"
import { nanoid } from "nanoid"

interface QueryStore {
  tree: Group
  history: Group[]
  collapsedGroupIds: string[]
  isRunning: boolean
  results: QueryRow[]
  lastRunAt: number | null
  addRule: (groupId: string) => void
  addGroup: (groupId: string) => void
  updateRule: (ruleId: string, changes: Partial<Rule>) => void
  removeNode: (nodeId: string) => void
  toggleGroupCollapsed: (groupId: string) => void
  toggleLogic: (groupId: string) => void
  runQuery: () => void
}

const firstField = Object.keys(schema)[0]

function createRule(): Rule {
  const fieldSchema = schema[firstField]

  return {
    id: nanoid(),
    field: firstField,
    operator: fieldSchema.operators[0],
    value: "",
  }
}

function createGroup(): Group {
  return {
    id: nanoid(),
    logic: "AND",
    conditions: [createRule()],
  }
}

const initialTree: Group = {
  id: "root",
  logic: "AND",
  conditions: [createRule()],
}

function updateGroupById(
  group: Group,
  groupId: string,
  updater: (group: Group) => Group,
): Group {
  if (group.id === groupId) {
    return updater(group)
  }

  return {
    ...group,
    conditions: group.conditions.map((condition) => {
      if (!isGroup(condition)) {
        return condition
      }

      return updateGroupById(condition, groupId, updater)
    }),
  }
}

function updateRuleById(group: Group, ruleId: string, changes: Partial<Rule>): Group {
  return {
    ...group,
    conditions: group.conditions.map((condition) => {
      if (isGroup(condition)) {
        return updateRuleById(condition, ruleId, changes)
      }

      if (condition.id !== ruleId) {
        return condition
      }

      return {
        ...condition,
        ...changes,
      }
    }),
  }
}

function removeNodeById(group: Group, nodeId: string): Group {
  return {
    ...group,
    conditions: group.conditions
      .filter((condition) => condition.id !== nodeId)
      .map((condition) => {
        if (!isGroup(condition)) {
          return condition
        }

        return removeNodeById(condition, nodeId)
      }),
  }
}

export const useQueryStore = create<QueryStore>((set) => ({
  tree: initialTree,
  history: [],
  collapsedGroupIds: [],
  isRunning: false,
  results: [],
  lastRunAt: null,
  addRule: (groupId) =>
    set(({ tree, history }) => ({
      tree: updateGroupById(tree, groupId, (group) => ({
        ...group,
        conditions: [...group.conditions, createRule()],
      })),
      history: [tree, ...history],
      results: [],
      lastRunAt: null,
    })),
  addGroup: (groupId) =>
    set(({ tree, history }) => ({
      tree: updateGroupById(tree, groupId, (group) => ({
        ...group,
        conditions: [...group.conditions, createGroup()],
      })),
      history: [tree, ...history],
      results: [],
      lastRunAt: null,
    })),
  updateRule: (ruleId, changes) =>
    set(({ tree, history }) => ({
      tree: updateRuleById(tree, ruleId, changes),
      history: [tree, ...history],
      results: [],
      lastRunAt: null,
    })),
  removeNode: (nodeId) =>
    set(({ tree, history, collapsedGroupIds }) => ({
      tree: removeNodeById(tree, nodeId),
      history: [tree, ...history],
      collapsedGroupIds: collapsedGroupIds.filter((id) => id !== nodeId),
      results: [],
      lastRunAt: null,
    })),
  toggleGroupCollapsed: (groupId) =>
    set(({ collapsedGroupIds }) => ({
      collapsedGroupIds: collapsedGroupIds.includes(groupId)
        ? collapsedGroupIds.filter((id) => id !== groupId)
        : [...collapsedGroupIds, groupId],
    })),
  toggleLogic: (groupId) =>
    set(({ tree, history }) => ({
      tree: updateGroupById(tree, groupId, (group) => ({
        ...group,
        logic: group.logic === "AND" ? "OR" : "AND",
      })),
      history: [tree, ...history],
      results: [],
      lastRunAt: null,
    })),
  runQuery: () => {
    set({ isRunning: true })

    window.setTimeout(() => {
      set(({ tree }) => {
        const validation = validateQuery(tree)

        return {
          isRunning: false,
          results: validation.isValid ? executeQuery(tree, mockDataset) : [],
          lastRunAt: Date.now(),
        }
      })
    }, 350)
  },
}))
