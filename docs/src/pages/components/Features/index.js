import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import './index.css';

const Feature = ({ title, description }) => (
  <div className="card cantara__card">
    <div className="card__header">
      <h3>{title}</h3>
    </div>
    <div className="card__body">{description}</div>
  </div>
);

export default function Features() {
  return (
    <div className="features__container">
      <div className="cantara__features">
        <h2 className="cantara__features__title" id="features">
          Features
        </h2>
        <div className="cantara__features__container">
          <Feature
            title="React webapps"
            description="You are just one CLI command away to get you up and running with a modern React + TypeScript webapp."
          />
          <Feature
            title="NodeJS APIs"
            description="Develop NodeJS APIs using TypeScript."
          />
          <Feature
            title="Serverless endpoints"
            description="Developing and deploying serverless endpoints using TypeScript is a breeze with Cantara."
          />
          <Feature
            title="Publish typesafe packages to NPM"
            description="If it is a React Component, a browser library or a NodeJS library, with Cantara you can publish it to NPM with just one command. Types included out of the box!"
          />
          <Feature
            title="Unit/Integration/E2E testing"
            description="Cantara comes build in with all testing utilities you need. Thanks to Jest and react-testing-library, testing is fun again! Cantara also offers special commands for browser testing."
          />
          <Feature
            title="Organized in a monorepository!"
            description="If done correctly, monorepositories can speed up development remarkably. Fullstack development never was that easy."
          />
          <Feature
            title="Zero config"
            description="Yep, that's right. No webpack config, no .tsconfig and no jest config to touch. It just works ™"
          />
        </div>
        <Link
          href={useBaseUrl('docs/introduction')}
          className="button button--secondary button--lg button--block"
        >
          Get started now
        </Link>
      </div>
    </div>
  );
}
