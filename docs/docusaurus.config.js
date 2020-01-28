module.exports = {
  title: 'Cantara',
  tagline:
    'Fullstack TypeScript React Apps in Minutes. Stop configuring, start coding.',
  url: 'https://cantara.js.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'cantara', // Usually your GitHub org/user name.
  projectName: 'cantara', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Cantara',
      logo: {
        alt: 'Cantara',
        src: 'img/logo.svg',
      },
      links: [{ to: 'docs/getting_started', label: 'Docs', position: 'left' }],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Quick Start',
              to: 'docs/getting_started',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cantara. MIT.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
