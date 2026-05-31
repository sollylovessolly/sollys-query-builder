import { create } from "zustand"
import { Group, Rule } from "@/types"
import { nanoid } from "nanoid"

interface QueryStore {
  tree: Group
  history: Group[]
  addRule: (groupId: string) => void
  addGroup: (groupId: string) => void
  updateRule: (ruleId: string, changes: Partial<Rule>) => void
  removeNode: (nodeId: string) => void
  toggleLogic: (groupId: string) => void
  runQuery: () => void
}