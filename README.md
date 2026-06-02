# Solly Query Builder

A visual query builder built with Next.js App Router, TypeScript, Zustand, Tailwind CSS, and DnD Kit.

The app lets users build database/API-style filters without writing raw syntax. Users can compose rules, nest logical groups, preview generated Mongo-style query objects, simulate execution against a mock dataset, inspect matching rows, restore history, load presets, import/export JSON, use keyboard shortcuts, and reorder nodes with drag-and-drop.

## Live Demo

- Live URL: https://sollys-query-builder.vercel.app/
- Demo video: https://www.loom.com/share/cb05377bc1c8487bbddd8da923d3102d
- Repository: https://github.com/sollylovessolly/sollys-query-builder
## Features

- Visual rule builder with field, operator, and value controls
- Recursive nested condition groups using `AND` / `OR`
- Schema-driven operators and inputs
- Live MongoDB-style query preview
- Query validation with clear issue messages
- Mock execution engine and results table
- Query history restore panel
- Saved query presets
- JSON import/export with recursive structure validation
- Drag-and-drop sibling reordering
- Keyboard shortcuts
- Light/dark mode
- Animated interface transitions

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- DnD Kit
- Vitest

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Useful commands:

```bash
npm run lint
npm run build
npm run test
```

If using pnpm:

```bash
pnpm dev
pnpm lint
pnpm build
pnpm test
```

## Project Structure

```txt
app/
  page.tsx                  App shell
  globals.css               Theme tokens and animation utilities

components/
  builder/
    QueryGroup.tsx          Recursive group renderer and drag/drop context
    QueryRule.tsx           Rule row composition
    RuleField.tsx           Schema-driven field selector
    RuleOperator.tsx        Schema-driven operator selector
    RuleValue.tsx           Schema-driven value input
  layout/
    TopBar.tsx              Import/export, theme controls, app chrome
    KeyboardShortcuts.tsx   Global keyboard shortcuts
  panels/
    LeftPanel.tsx           Data source, schema, presets, history
    BuilderPanel.tsx        Query tree editor panel
    PreviewPanel.tsx        Query preview, validation, execution results

lib/
  mockData.ts               Schema and mock dataset
  queryGenerator.ts         Query tree to Mongo-style object
  queryValidator.ts         Recursive validation engine
  queryExecutor.ts          Mock query execution engine
  queryImport.ts            Safe JSON import parsing
  queryPresets.ts           Saved preset query trees

store/
  queryStore.ts             Query tree state and actions
  uiStore.ts                Theme state

types/
  index.ts                  Query, schema, and type guard definitions
```

## Architecture

The core state is a recursive query tree:

```ts
interface Rule {
  id: string
  field: string
  operator: string
  value: string
}

interface Group {
  id: string
  logic: "AND" | "OR"
  conditions: (Rule | Group)[]
}
```

Every condition is either a `Rule` or another `Group`. This allows unlimited nesting while keeping the model compact and serializable.

Zustand stores the active tree and exposes mutation actions such as:

- `addRule`
- `addGroup`
- `updateRule`
- `removeNode`
- `moveNode`
- `toggleLogic`
- `loadQuery`
- `restoreHistory`
- `runQuery`

Each action updates the tree immutably and clears stale execution results when the query changes.

## Recursive Rendering Strategy

`QueryGroup` renders one group and maps over its `conditions`.

If a child is a group, `QueryGroup` renders itself again:

```tsx
if (isGroup(condition)) {
  return <QueryGroup group={condition} />
}
```

If a child is a rule, it renders `QueryRule`.

This keeps nested UI behavior consistent at every depth. The same component handles root groups, nested groups, empty groups, collapsed groups, and sortable child nodes.

## Schema-Driven Controls

The query builder reads field metadata from `lib/mockData.ts`:

```ts
export const schema = {
  name: { type: "string", operators: ["equals", "contains", "starts with"] },
  age: { type: "number", operators: ["equals", "greater than", "less than"] },
  country: { type: "enum", operators: ["equals", "not equals"], options: [...] },
}
```

The UI uses this schema to:

- populate field selectors
- restrict operator options per field
- render enum dropdowns
- render numeric inputs for number fields
- validate field/operator/value compatibility

## Query Engine Design

The engine is split into focused pure modules:

- `queryGenerator.ts` converts the visual tree into a Mongo-style query object.
- `queryValidator.ts` recursively validates groups and rules.
- `queryExecutor.ts` evaluates the tree against the mock dataset.
- `queryImport.ts` validates imported JSON before loading it into state.

This separation keeps UI components simple and makes the engine easy to test.

Example generated query:

```json
{
  "$and": [
    { "country": "Nigeria" },
    { "status": "active" },
    { "purchases": { "$gt": 10 } }
  ]
}
```

## Validation

The validation engine catches:

- empty groups
- empty rule values
- unknown fields
- invalid operators for a selected field
- invalid numeric values
- enum values outside allowed options
- malformed imported recursive structures

Invalid queries disable execution and show issues in the preview panel.

## Performance Notes

- Query state is centralized in Zustand to avoid prop drilling through recursive components.
- Derived outputs are generated from the current tree rather than duplicated in state.
- Reordering is scoped to sibling nodes inside the same group for predictable updates.
- DnD uses stable node IDs.
- Query engine functions are pure and reusable.
- Execution state is cleared whenever the query changes to avoid stale result displays.
- Import validation limits recursive depth and node count to avoid malformed or expensive trees.

## Trade-Offs

- Drag-and-drop currently supports sibling reordering within the same group. Cross-group dragging would be a strong future enhancement, but sibling reordering keeps the interaction predictable and stable.
- The mock execution engine is intentionally local and deterministic. It simulates query behavior without network or backend dependencies.
- Mongo-style query output was chosen because it maps naturally to nested object structures and recursive groups.
- UI polish favors a compact coding-workspace style inspired by developer tools, with a subtle rose accent.

## Testing

Vitest covers the core query engine:

- query generation
- recursive validation
- mock execution
- JSON import safety

Run:

```bash
npm run test
```

Current suite:

```txt
4 test files
10 tests
```

## Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: execute query
- `Ctrl/Cmd + B`: add rule to root group
- `Ctrl/Cmd + G`: add group to root group
- `Ctrl/Cmd + K`: collapse or expand root group

Shortcuts are ignored while typing inside inputs, selects, textareas, or editable elements.

## Deployment

The app is ready to deploy on Vercel or Netlify.

Recommended Vercel flow:

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Use the default Next.js build settings.
4. Confirm production deployment.
5. Add the live URL to this README.

Build command:

```bash
npm run build
```

## Future Improvements

- Cross-group drag-and-drop
- Result pagination and sorting
- More schemas/data sources
- SQL and GraphQL output modes
- Better mobile layout
- More integration tests around UI interactions
