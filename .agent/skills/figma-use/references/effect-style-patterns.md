# Effect Style API Patterns

## Local Effect Styles
```js
const styles = figma.getLocalEffectStyles()
const shadowStyle = styles.find(s => s.name === "Soft Shadow")
node.effectStyleId = shadowStyle.id
```

## Creating a Style
```js
const style = figma.createEffectStyle()
style.name = "My Elevation"
style.effects = [{ type: 'DROP_SHADOW', color: {r:0,g:0,b:0,a:0.1}, offset:{x:0,y:4}, radius:8, visible:true }]
```
