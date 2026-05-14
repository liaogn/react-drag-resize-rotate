import type { ComponentType } from 'react'
import DemoBasic from './DemoBasic'
import DemoBoundary from './DemoBoundary'
import DemoCustomCursor from './DemoCustomCursor'
import DemoFlags from './DemoFlags'
import DemoFlip from './DemoFlip'
import DemoLock from './DemoLock'
import DemoMinMax from './DemoMinMax'
import DemoNested from './DemoNested'
import DemoNestedBoundary from './DemoNestedBoundary'
import DemoNestedClip from './DemoNestedClip'
import DemoSticks from './DemoSticks'
import DemoTheming from './DemoTheming'
import { demoSources } from './sources'
import type { DemoLocale } from './i18n'

export interface DemoMeta {
  key: string
  title: string
  description: string
  component: ComponentType
  source: string
}

interface DemoDefinition extends Omit<DemoMeta, 'title' | 'description'> {
  title: Record<DemoLocale, string>
  description: Record<DemoLocale, string>
}

const demoDefinitions: DemoDefinition[] = [
  {
    key: 'basic',
    title: { zh: '1. 基础：拖 / 缩 / 转', en: '1. Basic: drag / resize / rotate' },
    description: {
      zh: 'x / y / w / h / r 会随拖拽、缩放、旋转实时更新。',
      en: 'x / y / w / h / r update live while dragging, resizing, and rotating.',
    },
    component: DemoBasic,
    source: demoSources.basic,
  },
  {
    key: 'lock',
    title: { zh: '2. 锁定比例 lock', en: '2. Lock ratio' },
    description: { zh: '中点和角点缩放时都强制保持宽高比。', en: 'Middle and corner handles both keep the aspect ratio.' },
    component: DemoLock,
    source: demoSources.lock,
  },
  {
    key: 'min-max',
    title: { zh: '3. min / max 尺寸限制', en: '3. Min / max size limits' },
    description: {
      zh: 'min: 80x80，max: 240x200。设置 min 后越过对边不会翻转。',
      en: 'min: 80x80, max: 240x200. Minimum limits prevent flipping across the opposite edge.',
    },
    component: DemoMinMax,
    source: demoSources['min-max'],
  },
  {
    key: 'flip',
    title: { zh: '4. 翻转 fliped', en: '4. Flip' },
    description: { zh: '未设 min，拖拽触点越过对边会触发翻转。', en: 'Without minimum limits, dragging a handle across the opposite edge triggers a flip.' },
    component: DemoFlip,
    source: demoSources.flip,
  },
  {
    key: 'nested',
    title: { zh: '5. 嵌套（childrens）', en: '5. Nesting (childrens)' },
    description: { zh: '父子级递归，子组件操作时坐标系跟随父级旋转。', en: "Recursive parent/child nodes; child coordinates follow the parent's rotation." },
    component: DemoNested,
    source: demoSources.nested,
  },
  {
    key: 'nested-clip',
    title: { zh: '6. 嵌套 + overflow:hidden', en: '6. Nesting + overflow:hidden' },
    description: { zh: '通过 overflow="hidden" 包一层 childWrap，子元素被父级裁剪。', en: 'Use overflow="hidden" to add a childWrap layer and clip children inside the parent.' },
    component: DemoNestedClip,
    source: demoSources['nested-clip'],
  },
  {
    key: 'sticks',
    title: { zh: '7. 控件子集 sticks', en: '7. Sticks subset' },
    description: { zh: '只显示四角 + 旋转，不显示中点。', en: 'Show only the four corners plus rotation, without middle handles.' },
    component: DemoSticks,
    source: demoSources.sticks,
  },
  {
    key: 'custom-cursor',
    title: { zh: '8. 自定义 cursor (stickHoverRender)', en: '8. Custom cursor (stickHoverRender)' },
    description: { zh: '把 hover 箭头换成红色双箭头。', en: 'Replace the hover cursor with a red double-arrow icon.' },
    component: DemoCustomCursor,
    source: demoSources['custom-cursor'],
  },
  {
    key: 'flags',
    title: { zh: '9. 状态开关', en: '9. State flags' },
    description: { zh: '勾选实时切换 active / draggable / resizeable / rotateable。', en: 'Toggle active / draggable / resizeable / rotateable in real time.' },
    component: DemoFlags,
    source: demoSources.flags,
  },
  {
    key: 'theming',
    title: { zh: '10. CSS 变量主题', en: '10. CSS variable themes' },
    description: { zh: '通过覆写 --vdr-* 变量实现主题切换。', en: 'Switch themes by overriding --vdr-* variables.' },
    component: DemoTheming,
    source: demoSources.theming,
  },
  {
    key: 'boundary',
    title: { zh: '11. 边界限制 / min-max', en: '11. Boundary limits / min-max' },
    description: { zh: 'limit-x / limit-y 可约束拖拽、缩放和旋转后的矩形范围。', en: 'limit-x / limit-y constrain the rectangle after drag, resize, and rotate.' },
    component: DemoBoundary,
    source: demoSources.boundary,
  },
  {
    key: 'nested-boundary',
    title: { zh: '12. 嵌套 + limit（父子各自的坐标系）', en: '12. Nesting + limit (separate coordinate systems)' },
    description: { zh: '外层 limit 使用操作区边界；子元素 limit 在父 vdr 内独立生效。', en: "The outer limit uses the stage boundary; child limits work inside the parent vdr." },
    component: DemoNestedBoundary,
    source: demoSources['nested-boundary'],
  },
]

function localizeDemo(demo: DemoDefinition, locale: DemoLocale): DemoMeta {
  return {
    ...demo,
    title: demo.title[locale],
    description: demo.description[locale],
  }
}

export const demos: DemoMeta[] = demoDefinitions.map((demo) => localizeDemo(demo, 'zh'))

export function getDemo(key: string, locale: DemoLocale = 'zh') {
  const demo = demoDefinitions.find((item) => item.key === key)
  return demo ? localizeDemo(demo, locale) : undefined
}
