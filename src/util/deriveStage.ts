export default function deriveStageNameFromCmd(cmdName: string) {
  if (cmdName === 'build') {
    return 'production';
  }

  if (cmdName === 'test') {
    return 'test';
  }

  return 'development';
}
