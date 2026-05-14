import ReactDragResizeRotate from '../../index'
import { centerRect } from './helpers'
import { useDemoLocale } from './i18n'

export default function DemoNestedClip() {
  const locale = useDemoLocale()
  const labels =
    locale === 'en'
      ? { root: 'Clipping parent', child: 'Clipped child' }
      : { root: '裁剪父级', child: '被裁剪的子元素' }
  const nestedClipped = {
    ...centerRect(320, 220),
    uuid: 'clip-root',
    childWrapAttr: {
      className: 'vdr-demo-fill vdr-demo-fill--clip-root',
      'data-label': labels.root,
    },
    overflow: 'hidden',
    childrens: [
      {
        w: 200,
        h: 160,
        x: 60,
        y: 30,
        r: 20,
        overflow: 'hidden',
        uuid: 'clip-child',
        childWrapAttr: {
          className: 'vdr-demo-fill vdr-demo-fill--clip-child',
          'data-label': labels.child,
        },
      },
    ],
  }

  return (
    <div className="vdr-demo-stage">
      <ReactDragResizeRotate {...nestedClipped} />
    </div>
  )
}
