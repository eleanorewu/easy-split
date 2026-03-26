# Text Style API Patterns

## Local Text Styles
```js
const styles = figma.getLocalTextStyles()
const bodyStyle = styles.find(s => s.name === "Body/Regular")
node.textStyleId = bodyStyle.id
```

## Creating a Style
```js
const style = figma.createTextStyle()
style.name = "Headline 1"
await figma.loadFontAsync({ family: "Inter", style: "Bold" })
style.fontName = { family: "Inter", style: "Bold" }
style.fontSize = 32
```
