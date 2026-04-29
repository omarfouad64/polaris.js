# Skill: Context Design

## Purpose
This skill provides a structured procedure for designing a new React Context from scratch — covering the state shape, action types, updater functions, provider component, and custom hook. It produces a TypeScript interface and an implementation skeleton that other agents can fill in. Invoke this skill whenever a feature requires new global or subtree state that must be shared across more than one component without prop drilling.

## Trigger
Invoke this skill when:
- PLAN.md (Section 5 — State Changes) identifies new state that must live in a React Context.
- A feature involves global session data (e.g., authenticated user, notification count) or shared subtree state (e.g., active project context across project sub-pages).
- The review agent flags prop drilling that should be replaced with Context.

## Inputs
- **Feature description** — what the context needs to track (from PLAN.md).
- **State keys** — list of data fields the context must hold (from PLAN.md, Section 5).
- **Actions** — list of update operations consumers need (e.g., "set active project", "add notification").
- [`globalContext.tsx`](../../src/globalContext.tsx) — the existing global context (read this to avoid duplicating existing state and to match the established pattern).

## Steps

1. **Decide context scope:**
   - **Global (`GlobalContext`)**: Session-level data used across the entire app (authenticated user, auth status, notification count). Merge into the existing `globalContext.tsx`.
   - **Subtree**: Feature-specific state shared within a page or flow (e.g., `ProjectContext` shared across project sub-pages). Create a new file.

2. **Design the state interface:**

```tsx
// [FeatureName]State
interface [FeatureName]State {
  // One property per state key from PLAN.md.
  // Use precise types — no `any`, no `object`.
  exampleKey: ExampleType
  isLoading: boolean
  error: string | null
}
```

3. **Design the action interface:**

```tsx
type [FeatureName]Action =
  | { type: 'SET_EXAMPLE'; payload: ExampleType }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' }
```

4. **Write the reducer (if actions are complex) or simple updater functions (if actions are simple):**

```tsx
function [featureName]Reducer(
  state: [FeatureName]State,
  action: [FeatureName]Action
): [FeatureName]State {
  switch (action.type) {
    case 'SET_EXAMPLE':
      return { ...state, exampleKey: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
```

5. **Write the context and provider:**

```tsx
import { createContext, useContext, useReducer, ReactNode } from 'react'

interface [FeatureName]ContextType {
  state: [FeatureName]State
  dispatch: React.Dispatch<[FeatureName]Action>
}

const [FeatureName]Context = createContext<[FeatureName]ContextType | null>(null)

const initialState: [FeatureName]State = {
  exampleKey: defaultValue,
  isLoading: false,
  error: null,
}

interface [FeatureName]ProviderProps {
  children: ReactNode
}

export default function [FeatureName]Provider({ children }: [FeatureName]ProviderProps) {
  const [state, dispatch] = useReducer([featureName]Reducer, initialState)
  return (
    <[FeatureName]Context.Provider value={{ state, dispatch }}>
      {children}
    </[FeatureName]Context.Provider>
  )
}
```

6. **Write the custom hook:**

```tsx
export function use[FeatureName](): [FeatureName]ContextType {
  const context = useContext([FeatureName]Context)
  if (!context) {
    throw new Error('use[FeatureName] must be used within [FeatureName]Provider')
  }
  return context
}
```

7. **Register the provider** in the correct location:
   - Global contexts: wrap in `src/main.tsx` around `<RouterProvider>`.
   - Subtree contexts: wrap the layout component that is the common ancestor of all consumers.

8. **Document the context** in `project_data/decisions.md` with the reason for introducing it.

## Output Artefact

A new file (or an addition to `globalContext.tsx`) containing:
- `[FeatureName]State` interface
- `[FeatureName]Action` union type
- `[featureName]Reducer` function
- `[FeatureName]Provider` component (default export)
- `use[FeatureName]` custom hook (named export)

## Quality Gate
The context design is complete when:
- [ ] All state keys from PLAN.md Section 5 are represented in the interface.
- [ ] All required actions are represented in the action union type.
- [ ] The reducer handles every action type (no unhandled cases).
- [ ] The custom hook throws a descriptive error if used outside the provider.
- [ ] `tsc --noEmit` passes with zero errors on the new file.
- [ ] The provider is registered in the correct location.
