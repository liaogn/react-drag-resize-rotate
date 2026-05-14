import { createContext, useContext } from 'react'

export type DemoLocale = 'zh' | 'en'

export const DemoLocaleContext = createContext<DemoLocale>('zh')

export function useDemoLocale() {
  return useContext(DemoLocaleContext)
}
