import { create } from "zustand"
import { executeQuery, QueryRow } from "@/lib/queryExecutor"
import { defaultDataSourceId, getDataSource } from "@/lib/mockData"
import { validateQuery } from "@/lib/queryValidator"
import { Group, Rule, Schema, isGroup } from "@/types"
import { nanoid } from "nanoid"

interface QueryStore {
  dataSourceId: string
  tree: Group
  history: Group[]
  collapsedGroupIds: string[]
  isRunning: boolean
  results: QueryRow[]
  lastRunAt: number | null
  setDataSource: (dataSourceId: string) => void
  addRule: (groupId: string) => void
  addGroup: (groupId: string) => void
  updateRule: (ruleId: string, changes: Partial<Rule>) => void
  removeNode: (nodeId: string) => void
  moveNode: (groupId: string, activeId: string, overId: string) => void
  loadQuery: (tree: Group, dataSourceId?: string) => void
  restoreHistory: (index: number) => void
  clearHistory: () => void
  toggleGroupCollapsed: (groupId: string) => void
  toggleLogic: (groupId: string) => void
  runQuery: () => void
}

function getFirstField(schema: Schema) {
  return Object.keys(schema)[0]
}

function createRule(schema: Schema): Rule {
  const firstField = getFirstField(schema)
  const fieldSchema = schema[firstField]

  return {
    id: nanoid(),
    field: firstField,
    operator: fieldSchema.operators[0],
    value: "",
  }
}

function createGroup(schema: Schema): Group {
  return {
    id: nanoid(),
    logic: "AND",
    conditions: [createRule(schema)],
  }
}

function createInitialTree(schema: Schema): Group {
  return {
    id: "root",
    logic: "AND",
    conditions: [createRule(schema)],
  }
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

function moveNodeWithinGroup(group: Group, activeId: string, overId: string): Group {
  const fromIndex = group.conditions.findIndex((condition) => condition.id === activeId)
  const toIndex = group.conditions.findIndex((condition) => condition.id === overId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
    return group
  }

  const nextConditions = [...group.conditions]
  const [movedNode] = nextConditions.splice(fromIndex, 1)
  nextConditions.splice(toIndex, 0, movedNode)

  return {
    ...group,
    conditions: nextConditions,
  }
}

export const useQueryStore = create<QueryStore>((set) => ({
  dataSourceId: defaultDataSourceId,
  tree: createInitialTree(getDataSource(defaultDataSourceId).schema),
  history: [],
  collapsedGroupIds: [],
  isRunning: false,
  results: [],
  lastRunAt: null,
  setDataSource: (dataSourceId) =>
    set(({ tree, dataSourceId: currentDataSourceId }) => {
      if (dataSourceId === currentDataSourceId) {
        return {}
      }

      const source = getDataSource(dataSourceId)

      return {
        dataSourceId: source.id,
        tree: createInitialTree(source.schema),
        history: [tree],
        collapsedGroupIds: [],
        results: [],
        lastRunAt: null,
      }
    }),
  addRule: (groupId) =>
    set(({ tree, history, dataSourceId }) => {
      const source = getDataSource(dataSourceId)

      return {
        tree: updateGroupById(tree, groupId, (group) => ({
          ...group,
          conditions: [...group.conditions, createRule(source.schema)],
        })),
        history: [tree, ...history],
        results: [],
        lastRunAt: null,
      }
    }),
  addGroup: (groupId) =>
    set(({ tree, history, dataSourceId }) => {
      const source = getDataSource(dataSourceId)

      return {
        tree: updateGroupById(tree, groupId, (group) => ({
          ...group,
          conditions: [...group.conditions, createGroup(source.schema)],
        })),
        history: [tree, ...history],
        results: [],
        lastRunAt: null,
      }
    }),
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
  moveNode: (groupId, activeId, overId) =>
    set(({ tree, history }) => ({
      tree: updateGroupById(tree, groupId, (group) => moveNodeWithinGroup(group, activeId, overId)),
      history: [tree, ...history],
      results: [],
      lastRunAt: null,
    })),
  loadQuery: (nextTree, nextDataSourceId) =>
    set(({ tree, history, dataSourceId }) => {
      const source = nextDataSourceId ? getDataSource(nextDataSourceId) : getDataSource(dataSourceId)

      return {
        dataSourceId: source.id,
        tree: structuredClone(nextTree),
        history: [tree, ...history],
        collapsedGroupIds: [],
        results: [],
        lastRunAt: null,
      }
    }),
  restoreHistory: (index) =>
    set(({ tree, history }) => {
      const restoredTree = history[index]

      if (!restoredTree) {
        return {}
      }

      return {
        tree: restoredTree,
        history: [tree, ...history.filter((_, historyIndex) => historyIndex !== index)],
        collapsedGroupIds: [],
        results: [],
        lastRunAt: null,
      }
    }),
  clearHistory: () => set({ history: [] }),
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
      set(({ tree, dataSourceId }) => {
        const source = getDataSource(dataSourceId)
        const validation = validateQuery(tree, source.schema)

        return {
          isRunning: false,
          results: validation.isValid ? executeQuery(tree, source.rows, source.schema) : [],
          lastRunAt: Date.now(),
        }
      })
    }, 350)
  },
}))
