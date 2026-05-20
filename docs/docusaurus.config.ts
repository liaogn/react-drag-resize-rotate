import type { Config } from '@docusaurus/types'
import { themes as prismThemes } from 'prism-react-renderer'

const GITHUB = 'https://github.com/liaogn/react-drag-resize-rotate'
const VUE_DOCS = 'https://liaogn.github.io/vue-drag-resize-rotate/'

const config: Config = {
  title: 'react-drag-resize-rotate',
  tagline: 'React component for dragging, resizing, and rotating DOM elements.',
  favicon: 'favicon.ico',
  url: 'https://liaogn.github.io',
  baseUrl: '/react-drag-resize-rotate/',
  organizationName: 'liaogn',
  projectName: 'react-drag-resize-rotate',
  trailingSlash: false,
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    localeConfigs: {
      zh: { label: '简体中文' },
      en: { label: 'English' },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${GITHUB}/edit/master/docs/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  themeConfig: {
    image: 'logo.png',
    navbar: {
      title: 'react-drag-resize-rotate',
      logo: {
        alt: 'react-drag-resize-rotate',
        src: 'logo.png',
      },
      items: [
        { type: 'docSidebar', sidebarId: 'guideSidebar', position: 'left', label: '指南' },
        { to: '/guide/props', label: 'API', position: 'left' },
        { to: '/examples/basic', label: '示例', position: 'left' },
        { href: VUE_DOCS, label: 'Vue 版', position: 'right' },
        { href: GITHUB, label: 'GitHub', position: 'right' },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/guide/getting-started' },
            { label: 'Examples', to: '/examples/basic' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: GITHUB },
            { label: 'Vue version', href: VUE_DOCS },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} liaogn. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
}

export default config
