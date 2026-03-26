/**
 * Figma Plugin API Standalone Definitions (Partial)
 * This file contains a snapshot of core interfaces for use_figma scripting.
 */

interface Figma {
  readonly apiVersion: "1.0.0"
  readonly fileKey: string | undefined
  readonly root: DocumentNode
  readonly viewport: ViewportAPI
  currentPage: PageNode

  // Node creation
  createRectangle(): RectangleNode
  createLine(): LineNode
  createEllipse(): EllipseNode
  createPolygon(): PolygonNode
  createStar(): StarNode
  createVector(): VectorNode
  createText(): TextNode
  createFrame(): FrameNode
  createComponent(): ComponentNode
  createPage(): PageNode
  createSlice(): SliceNode
  createSticky(): StickyNode
  createConnector(): ConnectorNode
  createShapeWithText(): ShapeWithTextNode
  createTable(): TableNode
  createNodeFromSvg(svg: string): FrameNode

  // Grouping/Boolean
  combineAsVariants(nodes: ReadonlyArray<ComponentNode>, parent: BaseNode & ChildrenMixin, index?: number): ComponentSetNode
  group(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): GroupNode
  flatten(nodes: ReadonlyArray<BaseNode>, parent?: BaseNode & ChildrenMixin, index?: number): VectorNode
  union(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
  subtract(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
  intersect(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode
  exclude(nodes: ReadonlyArray<BaseNode>, parent: BaseNode & ChildrenMixin, index?: number): BooleanOperationNode

  // Querying
  getNodeById(id: string): BaseNode | null
  getNodeByIdAsync(id: string): Promise<BaseNode | null>
  getStyleById(id: string): BaseStyle | null
  getStyleByIdAsync(id: string): Promise<BaseStyle | null>

  // Styles
  createPaintStyle(): PaintStyle
  createTextStyle(): TextStyle
  createEffectStyle(): EffectStyle
  createGridStyle(): GridStyle
  getLocalPaintStyles(): PaintStyle[]
  getLocalTextStyles(): TextStyle[]
  getLocalEffectStyles(): EffectStyle[]
  getLocalGridStyles(): GridStyle[]

  // Library
  importComponentByKeyAsync(key: string): Promise<ComponentNode>
  importComponentSetByKeyAsync(key: string): Promise<ComponentSetNode>
  importStyleByKeyAsync(key: string): Promise<BaseStyle>

  // Variables
  readonly variables: VariablesAPI

  // Fonts
  loadFontAsync(fontName: FontName): Promise<void>
  listAvailableFontsAsync(): Promise<Font[]>

  // Utilities
  base64Encode(data: Uint8Array): string
  base64Decode(data: string): Uint8Array
  getFileThumbnailNodeAsync(): Promise<FrameNode | ComponentNode | ComponentSetNode | null>
}

interface BaseNodeMixin {
  readonly id: string
  readonly parent: (BaseNode & ChildrenMixin) | null
  name: string
  removed: boolean
  remove(): void
  setRelaunchData(data: { [key: string]: string }): void
  getRelaunchData(): { [key: string]: string }
  getPluginData(key: string): string
  setPluginData(key: string, value: string): void
  getSharedPluginData(namespace: string, key: string): string
  setSharedPluginData(namespace: string, key: string, value: string): void
}

interface LayoutMixin {
  readonly absoluteTransform: Transform
  relativeTransform: Transform
  x: number
  y: number
  rotation: number
  readonly width: number
  readonly height: number
  constrainProportions: boolean
  layoutAlign: "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT"
  layoutGrow: number
  resize(width: number, height: number): void
  resizeWithoutConstraints(width, height): void
}

// ... Additional core types truncated for brevity ...
// Refer to https://www.figma.com/plugin-docs/api/properties/ for full reference.
