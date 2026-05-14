import './demos/demo.css'
import './demos/preview.css'
import '../core/style/vdr.css'
import { demos } from './demos/registry'
import DemoPreview from './demos/DemoPreview'

export default function App() {
  return (
    <div className="page">
      <header className="topbar">
        <h1>react-drag-resize-rotate · playground</h1>
        <p>核心交互场景与 docs 共享同一套 demo 源</p>
      </header>

      <main className="grid">
        {demos.map((demo) => (
          <DemoPreview
            key={demo.key}
            title={demo.title}
            description={demo.description}
            component={demo.component}
            source={demo.source}
          />
        ))}
      </main>
    </div>
  )
}
