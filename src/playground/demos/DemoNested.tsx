import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'
import { useDemoLocale } from './i18n'

export default function DemoNested() {
  const locale = useDemoLocale()
  const labels =
    locale === 'en'
      ? { root: 'Parent container', childA: 'Child A', childB: 'Child B' }
      : { root: '父级容器', childA: '子元素 A', childB: '子元素 B' }

  const nestedRoot = {
    ...centerRect(320, 220),
    uuid: 'root',
    childWrapAttr: { className: 'vdr-demo-fill vdr-demo-fill--root', 'data-label': labels.root },
    childrens: [
      {
        w: 140,
        h: 100,
        x: 40,
        y: 40,
        r: 15,
        uuid: 'child-1',
        overflow: 'hidden',
        childWrapAttr: { className: 'vdr-demo-fill vdr-demo-fill--child-a', 'data-label': labels.childA },
      },
      {
        w: 90,
        h: 90,
        x: 190,
        y: 100,
        r: -10,
        lock: true,
        uuid: 'child-2',
        overflow: 'hidden',
        childWrapAttr: { className: 'vdr-demo-fill vdr-demo-fill--child-b', 'data-label': labels.childB },
      },
    ],
  }

  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate {...nestedRoot} />
    </div>
  )
}
