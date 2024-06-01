let _timeId: NodeJS.Timeout;
export function timeout(time: number, timeId: NodeJS.Timeout = _timeId) {
  return new Promise((_, reject) => {
    clearTimeout(timeId);
    timeId = setTimeout(() => {
      reject(new Error('Operation timed out'));
      clearTimeout(timeId);
    }, time);
  });
}
