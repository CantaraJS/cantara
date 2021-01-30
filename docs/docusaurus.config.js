module.exports = {
  title: 'Cantara',
  tagline:
    'Fullstack TypeScript React Apps in Minutes. Stop configuring, start coding.',
  url: 'https://cantara.js.org',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'cantarajs', // Usually your GitHub org/user name.
  projectName: 'cantara', // Usually your repo name.
  baseUrl: '/', // The name of your GitHub project.
  projectName: 'cantara', // The name of your GitHub project. Same as above.
  themeConfig: {
    algolia: {
      apiKey: 'af2f50bcdbfad04cca05fbec47c978df',
      indexName: 'cantara',
      algoliaOptions: {}, // Optional, if provided by Algolia
    },
    navbar: {
      title: '',
      logo: {
        alt: 'Cantara',
        src: 'img/cantara.svg',
      },
      items: [
        { to: 'docs/introduction', label: 'Getting started', position: 'left' },
        { to: 'docs/docs_intro', label: 'Guides', position: 'left' },
        // {
        //   to: 'https://spectrum.chat/cantara',
        //   label: 'Join the Community',
        //   position: 'left',
        // },
        {
          to: 'https://github.com/CantaraJS/cantara',
          label: 'Github',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Links',
          items: [
            {
              label: 'Getting started',
              to: 'docs/introduction',
            },
            {
              label: 'Guides',
              to: 'docs/docs_intro',
            },
            {
              label: 'Github',
              to: 'https://github.com/CantaraJS/cantara',
            },
          ],
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/CantaraJS/cantara/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
