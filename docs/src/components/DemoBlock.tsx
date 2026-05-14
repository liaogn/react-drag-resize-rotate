import DemoPreview from '../../../src/playground/demos/DemoPreview'
import { getDemo } from '../../../src/playground/demos/registry'
import type { DemoLocale } from '../../../src/playground/demos/i18n'

export default function DemoBlock({ demoKey, locale = 'zh' }: { demoKey: string; locale?: DemoLocale }) {
  const demo = getDemo(demoKey, locale)

  if (!demo) {
    return <p>Demo not found: {demoKey}</p>
  }

  return (
    <DemoPreview
      title={demo.title}
      description={demo.description}
      component={demo.component}
      source={demo.source}
      locale={locale}
    />
  )
}
