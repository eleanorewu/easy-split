# Validation Workflow & Error Recovery

## Phase 1: Pre-Execution Validation
Before calling `use_figma` to mutate the file, use `get_metadata` or `get_screenshot` to verify your assumptions about the current state.
- Does the target frame exist?
- Is there already a component with that name?
- Is there enough blank space to the right of existing content?

## Phase 2: Atomic Execution
`use_figma` is atomic. If any line in the script throws an error, the entire operation is rolled back and no nodes are ever created or modified. Use this to your advantage:
- Throw early if a prerequisite (like a specific component ID) is not found.
- Avoid multi-step scripts that might fail halfway and leave the file in a "half-done" state.

## Phase 3: Post-Execution Verification
After every `use_figma` call, use `get_screenshot` to verify the visual result.
- Are nodes overlapping?
- Is the text readable?
- Are variables bound correctly?

## Error Recovery Patterns

### Layout Drift
If a node was created but is overlapping existing content, find the current bounds and use `use_figma` to move it:
```js
const node = figma.getNodeById('...')
node.x += offset
```

### Missing Font
If a script fails with "Font not loaded", discover which font is missing and load it:
```js
await figma.loadFontAsync({ family: "Font Name", style: "Regular" })
```

### ID Invalidation
Remember: `detachInstance()` converts the node to a `FRAME` with a **NYW ID**. If you need to manipulate a detached node or its parents, re-traverse the tree to find their new IDs.
