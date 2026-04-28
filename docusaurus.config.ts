import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'FFM Help Center',
  tagline: 'Flash Fulfillment 帮助中心',
  favicon: 'img/favicon.ico',
  future: {
    v4: true,
  },
  url: 'https://ffm-docs.vercel.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en', 'th'],
    localeConfigs: {
      zh: { label: '中文', direction: 'ltr' },
      en: { label: 'English', direction: 'ltr' },
      th: { label: 'ภาษาไทย', direction: 'ltr' },
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
        },
        blog: false,
        theme: { customCss: './src/css/custom.css' },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'FFM Help Center',
      items: [
        { type: 'docSidebar', sidebarId: 'mainSidebar', position: 'left', label: '文档' },
        { type: 'localeDropdown', position: 'right' },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Flash Fulfillment`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
