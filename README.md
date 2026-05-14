# react-drag-resize-rotate

React component for dragging, resizing, and rotating DOM elements. It mirrors the Vue 3 package API and reuses the same framework-independent core logic.

## Install

```bash
pnpm add @liaogn/react-drag-resize-rotate
# or
npm install @liaogn/react-drag-resize-rotate
```

## Usage

```tsx
import { useState } from 'react'
import ReactDragResizeRotate, { type PosData } from '@liaogn/react-drag-resize-rotate'
import '@liaogn/react-drag-resize-rotate/style.css'

export default function App() {
  const [rect, setRect] = useState({ w: 200, h: 150, x: 50, y: 50, r: 0 })
  const update = (pos: PosData) =>
    setRect((current) => ({ ...current, x: pos.x, y: pos.y, w: pos.w, h: pos.h, r: pos.r }))

  return (
    <ReactDragResizeRotate {...rect} onDragging={update} onResizing={update} onRotating={update}>
      <div>drag · resize · rotate</div>
    </ReactDragResizeRotate>
  )
}
```

## API Notes

The React package intentionally keeps the Vue package names for migration parity:

- Props include `childrens`, `resizeable`, `rotateable`, `limitX`, `limitY`, and `stickHoverRender`.
- Event callbacks include `onActivated`, `onDragging`, `onResizing`, `onRotating`, and `onFliped`.
- All callbacks receive `(pos: PosData, event: MouseEvent)`.

## Development

```bash
pnpm install
pnpm dev
pnpm docs:dev
pnpm lint
pnpm type-check
pnpm build
```

## License

MIT © liaogn
