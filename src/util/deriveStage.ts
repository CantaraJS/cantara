export default function deriveStageNameFromCmd(cmdName: string) {
  if (cmdName === 'build' || cmdName === 'deploy' || cmdName === 'ci') {
    return 'production';
  }

  if (cmdName === 'test' || cmdName === 'e2e') {
    return 'test';
  }

  return 'development';
}
