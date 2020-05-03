import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './index.css';
import TechStack from '../TechStack';
import WizardCli from '../WizardCli';

const Wave = () => (
  <div className="cantara__wave-container">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path
        fill="#fff"
        fillOpacity="1"
        d="M0,32L40,42.7C80,53,160,75,240,80C320,85,400,75,480,64C560,53,640,43,720,85.3C800,128,880,224,960,261.3C1040,299,1120,277,1200,229.3C1280,181,1360,107,1400,69.3L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
      ></path>
    </svg>
  </div>
);

export default function Hero() {
  return (
    <header className="cantara__hero">
      <div className="cantara__hero__inner">
        <div className="cantara__hero__container">
          <span className="badge badge--secondary">Alpha</span>

          <div className="cantara__hero__logo">
            <img src={useBaseUrl('img/cantara.svg')} alt="Cantara" />
          </div>

          <h1 className="cantara__slogan">
            A CLI tool to create Fullstack React apps in minutes
          </h1>
          {/* <h2 className="cantara__subtitle">zero config, zero problems</h2> */}
          <div className="cantara__hero__buttons">
            <Link
              href={useBaseUrl('docs/introduction')}
              className="button button--primary button--lg"
            >
              Get Started
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="#features"
            >
              Features
            </Link>
          </div>
        </div>
        <TechStack />
        <WizardCli />
      </div>
      <Wave />
    </header>
  );
}
