import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero from './components/Hero';

import './global.css';
import Features from './components/Features';

function Home() {
  const context = useDocusaurusContext();
  return (
    <Layout
      title={`CANTARA`}
      description="A CLI tool to create Fullstack React apps in minutes"
    >
      <Hero />
      <Features />
    </Layout>
  );
}

export default Home;
