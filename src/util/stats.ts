export function measureTime(label: string) {
  const NS_PER_SEC = 1e9;
  const startTime = process.hrtime();
  return function stop() {
    const diff = process.hrtime(startTime);
    const timeInSeconds = (diff[0] * NS_PER_SEC + diff[1]) / NS_PER_SEC;
    console.log(`${label}: ${timeInSeconds}s`);
  };
}

export function waitFor(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
