// Inspired from https://github.com/steveukx/git-js/blob/HEAD/src/responses/DiffSummary.js

import path from 'path';

export default function parseDiffSummary(diffSum: string, projectDir: string) {
  const lines = diffSum.trim().split('\n');
  const changeObjs = lines.map(
    line => textFileChange(line) || binaryFileChange(line),
  );
  const withAbsolutePaths = changeObjs
    .map(obj => {
      if (obj) {
        return {
          ...obj,
          file: path.join(projectDir, obj.file),
        };
      }
      return false;
    })
    .filter(Boolean);
  return withAbsolutePaths;
}

function textFileChange(lineIn: string) {
  let line = lineIn.trim().match(/^(.+)\s+\|\s+(\d+)(\s+[+\-]+)?$/);

  if (line) {
    var alterations = (line[3] || '').trim();

    return {
      file: line[1].trim(),
      changes: parseInt(line[2], 10),
      insertions: alterations.replace(/-/g, '').length,
      deletions: alterations.replace(/\+/g, '').length,
      binary: false,
    };
  }
  return undefined;
}

function binaryFileChange(lineIn: string) {
  let line = lineIn.match(/^(.+) \|\s+Bin ([0-9.]+) -> ([0-9.]+) ([a-z]+)$/);
  if (line) {
    return {
      file: line[1].trim(),
      before: +line[2],
      after: +line[3],
      binary: true,
    };
  }
  return undefined;
}
