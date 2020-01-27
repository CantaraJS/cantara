export default function deriveStageNameFromCmd(cmdName: string) {
  if (cmdName === 'build' || cmdName === 'deploy') {
    return 'production';
  }

  if (cmdName === 'test') {
    return 'test';
  }

  return 'development';
}
