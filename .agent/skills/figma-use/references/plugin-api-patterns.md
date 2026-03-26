# Plugin API Patterns

## Selection & Traversal
`figma.currentPage.selection` is always empty in `use_figma`. Use traversal:
```js
const node = figma.getNodeById('ID')
const allFrames = figma.currentPage.findAll(n => n.type === 'FRAME')
```

## Creating Nodes
Always set position or they all stack at (0,0):
```js
const f = figma.createFrame()
f.x = 100; f.y = 100
```

## Atomic Operations
`use_figma` is atomic. If your script throws, NO changes reach the user's file.

## Return Data
Use `return` to send info back to the AI assistant:
```js
return { nodeId: node.id }
```
