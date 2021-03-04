import c from 'ansi-colors';
import prettyMs from 'pretty-ms';

interface LogBuildTimeParams {
  toolName: string;
  stepName: string;
}

export function logBuildTime({ toolName, stepName }: LogBuildTimeParams) {
  const startTime = Date.now();
  console.log(`${c.cyan(`[${toolName}]`)} ${c.gray(`${stepName}...`)}`);

  return () => {
    const elapsed = Date.now() - startTime;
    const elapsedTimePretty = prettyMs(elapsed);
    console.log(
      `${c.cyan(`[${toolName}]`)} ${c.magenta(
        `${stepName} took`,
      )} ${c.cyanBright(elapsedTimePretty)}`,
    );
  };
}
