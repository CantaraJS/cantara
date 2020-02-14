import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

import './index.css';

export default function TechStack() {
  return (
    <div className="cantara__techstack">
      <img src={useBaseUrl('img/ts.svg')} />
      <img src={useBaseUrl('img/react.svg')} />
      <img src={useBaseUrl('img/sls.svg')} />
      <img src={useBaseUrl('img/nodejs.svg')} />
    </div>
  );
}
