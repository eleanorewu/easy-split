# Gotchas & Common Mistakes

## Contents
- figma.notify() throws "not implemented"
- Mutating color.r/g/b directly has no effect
- resize(w, h) resets sizing modes to FIXED
- Node insertion doesn't auto-position
- Font loading is REQUIRED before any text change
- Mixed property values
- Selection is not accessible
- Plugin UI and external links are no-ops
- Persistent data across use_figma calls
- detachInstance() invalidates ancestor node IDs

## figma.notify() throws "not implemented"
This is the most common mistake. `figma.notify()` is a UI-only API and is **not implemented** in the headless environment.
- **Wrong:** `figma.notify("Success")`
- **Right:** `return "Success"` or `return { success: true }`

## Mutating color.r/g/b directly has no effect
Paint and color objects are immutable when assigned to nodes. You must clone the object, mutate the clone, and re-assign. Note: `assign` or `...` spreads are best for cloning.
- **Wrong:** `node.fills[0].color.r = 1`
- **Right:**
```js
const fills = JSON.parse(JSON.stringify(node.fills))
fills[0].color = { r: 1, g: 0, b: 0 }
node.fills = fills
```

## resize(w, h) resets sizing modes to FIXED
Calling `node.resize(w, h)` (or setting `.width`/`.height` directly) automatically resets `layoutSizingHorizontal` and `layoutSizingVertical` to `FIXED`. If you wanted the node to remain `FILL` or `HUG`, you must re-set those properties after the resize.
- **Tip:** For frames that should contain their children, always set `layoutMode` and then `layoutSizingHorizontal = 'HUG'` / `layoutSizingVertical = 'HUG'`.

## Node insertion doesn't auto-position
Newly created nodes (Rectangle, Frame, etc.) default to `(0, 0)`. If you are appending to the page, they will all overlap at the top-left unless you manually set `.x` and `.y`.
- **Right:** Discover existing bounds first, then position relatively.
```js
let maxX = 0
for (const child of figma.currentPage.children) {
  maxX = Math.max(maxX, child.x + child.width)
}
newNode.x = maxX + 100
```

## Font loading is REQUIRED before any text change
You cannot set `characters`, `fontSize`, or any text-related property without first loading the font family and style.
- **Wrong:** `textNode.characters = "Hello"`
- **Right:**
```js
await figma.loadFontAsync({ family: "Inter", style: "Regular" })
textNode.characters = "Hello"
```
- **Note:** For existing text nodes, use `await figma.loadFontAsync(textNode.fontName)` to load whatever font they are already using.

## Mixed property values
Properties like `fills`, `fontName`, and `fontSize` return `figma.mixed` if the selection contains nodes with different values. Always check for `figma.mixed` before assuming an array or number.

## Selection is not accessible
`figma.currentPage.selection` is always empty in `use_figma`. You cannot rely on "what the user selected". You must discover nodes via `figma.getNodeByIdAsync()`, `findOne()`, or `findAll()`.

## Plugin UI and external links are no-ops
Methods like `figma.showUI()` and `figma.openExternal()` do nothing and return immediately. The script runs entirely in the background.

## Persistent data across use_figma calls
Variables defined in your script are NOT persistent between separate `use_figma` tool calls. Each call is a clean slate. To pass data between steps, you must `return` it from the first call and receive it as context for the second call.

## detachInstance() invalidates ancestor node IDs
When `detachInstance()` is called on a nested instance inside a library component instance, the parent instance may also get implicitly detached (converted from INSTANCE to FRAME with a **new ID**). Subsequent `getNodeByIdAsync(oldParentId)` returns null.
- **Fix:** Keep a stable non-instance parent (like a frame YOU created) and re-discover nodes by traversal after detaching, rather than relying on cached IDs.
