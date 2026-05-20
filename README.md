# react-drag-resize-rotate

面向 React 的拖拽 / 缩放 / 旋转组件，适合图片标注、海报编辑、低代码画布、可视化搭建器等需要矩形图层编辑能力的场景。

[React 文档](https://liaogn.github.io/react-drag-resize-rotate/) · [English](https://liaogn.github.io/react-drag-resize-rotate/en/) · [Vue 版](https://liaogn.github.io/vue-drag-resize-rotate/) · [Changelog](./CHANGELOG.md)

## 功能亮点

- 支持拖拽、缩放和旋转 DOM 内容，默认包含 8 个缩放触点和 1 个旋转触点。
- 支持 `limitX` / `limitY`，按旋转后的包围盒限制拖拽、缩放和旋转范围。
- 支持锁定宽高比、最小 / 最大尺寸限制，以及拖拽触点越过对边时的翻转。
- 支持通过 React `children` 承载任意内容，也支持通过 `childrens` 数据配置渲染嵌套节点。
- 支持 `draggable`、`resizeable`、`rotateable`、`active`、`activeable` 等编辑状态控制。
- 支持通过 CSS 变量和 `stickHoverRender` 自定义触点、轮廓、旋转线、尺寸、阴影和 hover 光标。

## 安装

```bash
pnpm add @liaogn/react-drag-resize-rotate
# 或
npm install @liaogn/react-drag-resize-rotate
```

## 快速使用

```tsx
import { useState } from 'react'
import ReactDragResizeRotate, { type PosData } from '@liaogn/react-drag-resize-rotate'
import '@liaogn/react-drag-resize-rotate/style.css'

export default function App() {
  const [rect, setRect] = useState({ w: 200, h: 150, x: 50, y: 50, r: 0 })
  const update = (pos: PosData) =>
    setRect((current) => ({ ...current, x: pos.x, y: pos.y, w: pos.w, h: pos.h, r: pos.r }))

  return (
    <ReactDragResizeRotate {...rect} overflow="hidden" onDragging={update} onResizing={update} onRotating={update}>
      <div>drag · resize · rotate</div>
    </ReactDragResizeRotate>
  )
}
```

组件只依赖 React，样式需要在应用中手动引入一次 `@liaogn/react-drag-resize-rotate/style.css`。

## 核心能力

### 受控位置与尺寸

`x`、`y`、`w`、`h`、`r`、`z` 都会响应外部 prop 更新，因此可以把组件作为受控画布节点使用：

```tsx
<ReactDragResizeRotate
  x={rect.x}
  y={rect.y}
  w={rect.w}
  h={rect.h}
  r={rect.r}
  onDragging={onUpdate}
  onResizing={onUpdate}
  onRotating={onUpdate}
/>
```

这让你可以把用户操作实时写回 React state、JSON 配置、编辑器历史栈或后端接口。

### 事件回调

交互回调会收到当前 `PosData` 和原生 `MouseEvent`：

```ts
interface PosData {
  uuid: string | number
  x: number
  y: number
  w: number
  h: number
  r: number
  z: number | string
  stick: '' | 'tl' | 'tm' | 'tr' | 'mr' | 'br' | 'bm' | 'bl' | 'ml' | 'angle'
  lock: boolean
  active: boolean
  flipSign: '' | '+' | '-'
}
```

常用事件：

| Callback | 触发时机 |
| --- | --- |
| `onActivated` | 节点激活 |
| `onDragStart` / `onDragging` / `onDragStop` | 拖拽开始 / 中 / 结束 |
| `onResizeStart` / `onResizing` / `onResizeStop` | 缩放开始 / 中 / 结束 |
| `onRotateStart` / `onRotating` / `onRotateStop` | 旋转开始 / 中 / 结束 |
| `onFliped` | 触点越过对边并触发翻转 |

### 交互开关与约束

```tsx
<ReactDragResizeRotate
  w={240}
  h={160}
  x={40}
  y={40}
  lock
  minWidth={80}
  minHeight={60}
  maxWidth={480}
  maxHeight={320}
  limitX={[0, 800]}
  limitY={[0, 480]}
  sticks={['tl', 'tr', 'br', 'bl', 'angle']}
/>
```

`limitX` / `limitY` 会限制旋转后的轴对齐包围盒范围，两个 prop 可以单独使用。

### 嵌套编辑

可以直接用 React children 组合嵌套节点：

```tsx
<ReactDragResizeRotate w={360} h={240} x={40} y={40} overflow="hidden">
  <ReactDragResizeRotate w={120} h={90} x={40} y={40} r={15}>
    <div>child</div>
  </ReactDragResizeRotate>
</ReactDragResizeRotate>
```

也可以通过 `childrens` 从数据配置渲染嵌套节点：

```tsx
<ReactDragResizeRotate
  w={400}
  h={300}
  x={40}
  y={40}
  childrens={[
    { uuid: 'child-1', w: 160, h: 100, x: 40, y: 40, r: 15 },
    { uuid: 'child-2', w: 100, h: 100, x: 240, y: 140, lock: true },
  ]}
/>
```

## API 说明

React 版保留了部分 Vue 版字段命名，方便两个版本之间保持一致：

| Prop | 说明 |
| --- | --- |
| `resizeable` / `rotateable` | 是否允许缩放 / 旋转 |
| `childrens` | 数据驱动的嵌套节点配置 |
| `stickHoverRender` | 自定义触点 hover 光标 |
| `limitX` / `limitY` | 父坐标系中的边界限制 |

完整 API 见 [Props](https://liaogn.github.io/react-drag-resize-rotate/guide/props) · [Events](https://liaogn.github.io/react-drag-resize-rotate/guide/events) · [Children](https://liaogn.github.io/react-drag-resize-rotate/guide/slots) · [边界限制](https://liaogn.github.io/react-drag-resize-rotate/guide/boundary)。

## Vue 版

如果你的项目使用 Vue 3，可以查看对应版本：

- 文档：https://liaogn.github.io/vue-drag-resize-rotate/
- 仓库：https://github.com/liaogn/vue-drag-resize-rotate
- npm：https://www.npmjs.com/package/@liaogn/vue-drag-resize-rotate

## 开发

```bash
pnpm install
pnpm dev
pnpm docs:dev      # 中文文档
pnpm docs:dev:en   # 英文文档
pnpm lint
pnpm type-check
pnpm build
```

## License

MIT © liaogn
