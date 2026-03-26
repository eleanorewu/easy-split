# Variables & Token API Patterns

## Contents
- Creating Collections and Modes
- Creating Variables (COLOR, FLOAT, STRING, BOOLEAN)
- Variable Scopes (Hidden vs Visible)
- Variable Aliasing (Tokens)
- Binding Variables to Paints (NEW paint required)
- Binding Variables to Effects (NEW effect required)
- Binding Variables to Layout Grids (NEW grid required)
- Binding Variables to Node Properties (FLOAT/STRING/BOOLEAN)
- Explicit Variable Modes (CRITICAL for variants)

## Creating Collections and Modes
A `VariableCollection` holds modes (e.g., Light/Dark) and variables.

```javascript
const collection = figma.variables.createVariableCollection("Theme/Core");
// Rename default mode
collection.renameMode(collection.modes[0].modeId, "Light");
const darkId = collection.addMode("Dark");
const lightId = collection.modes[0].modeId;
```

## Creating Variables
Variables must have a name, collection, and type (`COLOR`, `FLOAT`, `STRING`, `BOOLEAN`).

```javascript
const primaryVar = figma.variables.createVariable("primary", collection, "COLOR");
primaryVar.setValueForMode(lightId, { r: 0, g: 0.4, b: 1, a: 1 });
primaryVar.setValueForMode(darkId, { r: 0.2, g: 0.6, b: 1, a: 1 });

const radiusVar = figma.variables.createVariable("radius/md", collection, "FLOAT");
radiusVar.setValueForMode(lightId, 8);
radiusVar.setValueForMode(darkId, 8);
```

**Recommendation:** Use `/` in names to create folders in the Figma UI (e.g., `surface/bg-primary`).

## Variable Scopes (Hidden vs Visible)
Scopes control which property pickers a variable appears in. An empty array `[]` hides the variable from all pickers (useful for raw numeric "primitives").

```javascript
// Hide from pickers (primitive variable)
radiusVar.scopes = [];

// Show only in corner radius pickers
radiusVar.scopes = ["CORNER_RADIUS"];

// Show only in fill pickers
primaryVar.scopes = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL"];
```

## Variable Aliasing (Tokens)
Aliasing links one variable to another (e.g., semantic token → primitive value).

```javascript
const semanticVar = figma.variables.createVariable("action/bg", collection, "COLOR");
semanticVar.setValueForMode(lightId, figma.variables.createVariableAlias(primaryVar));
```

## Binding Variables to Paints (COLOR variables)
`setBoundVariableForPaint` creates a **copy** of a paint object with the variable bound to its color. You **must** capture the returned object and assign it back to the node's `fills` or `strokes` array.

```javascript
const rect = figma.createRectangle();
const basePaint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };

// Returns a NEW paint — MUST capture return value!
const boundPaint = figma.variables.setBoundVariableForPaint(basePaint, "color", primaryVar);

rect.fills = [boundPaint];
```

## Binding Variables to Effects (COLOR/FLOAT variables)
`setBoundVariableForEffect` creates a **copy** of an effect object with the variable bound to a specific field. You **must** capture the returned object and assign it back to the node's `effects` array.

```javascript
const frame = figma.createFrame();
const shadow = { type: 'DROP_SHADOW', color: {r:0,g:0,b:0,a:0.1}, offset:{x:0,y:4}, radius:4, visible:true };

// field for shadows: "color" (COLOR), "radius" | "spread" | "offsetX" | "offsetY" (FLOAT)
// field for blurs: "radius" (FLOAT)
const boundShadow = figma.variables.setBoundVariableForEffect(shadow, "radius", radiusVar);

frame.effects = [boundShadow];
```

## Binding Variables to Layout Grids (FLOAT variables)
`setBoundVariableForLayoutGrid` creates a **copy** of a grid object with a variable bound to a field.

```javascript
const grid = { type: 'GRID', sectionSize: 10, visible: true, color: {r:1,g:0,b:0,a:0.1} };

// field: "sectionSize" | "offset" | "count" | "gutterSize"
const boundGrid = figma.variables.setBoundVariableForLayoutGrid(grid, "sectionSize", spacingVar);

frame.layoutGrids = [boundGrid];
```

## Binding Variables to Node Properties (FLOAT/STRING/BOOLEAN)
Use `setBoundVariable(property, variable)` for core layout and sizing properties.

```javascript
// Layout & sizing (FLOAT):
node.setBoundVariable("width", widthVar);
node.setBoundVariable("minWidth", minWidthVar);
node.setBoundVariable("itemSpacing", gapVar);
node.setBoundVariable("paddingLeft", padVar);

// Corner radii (FLOAT) — use individual corners, NOT 'cornerRadius':
node.setBoundVariable("topLeftRadius", radiusVar);
node.setBoundVariable("topRightRadius", radiusVar);

// Visibility (BOOLEAN):
node.setBoundVariable("visible", showVar);

// Text characters (STRING):
textNode.setBoundVariable("characters", contentVar);
```

**Note:** `fontSize`, `fontWeight`, and `lineHeight` are **not** bindable via `setBoundVariable`. Set these directly as values.

## Explicit Variable Modes (CRITICAL for variants)
By default, nodes inherit the current mode of the page. To ensure a component variant or a specific frame always uses a specific mode (e.g., a "Dark Surface" component), you **must** set an explicit mode.

```javascript
// Collection object is REQUIRED (passing ID string is deprecated)
node.setExplicitVariableModeForCollection(collection, darkId);
```

This is essential when building "Style" variants in a component set where each variant is just the same component with a different mode applied.
