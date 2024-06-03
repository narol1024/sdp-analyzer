// The label is determined based on the value of instability
export function getStablityLabel(instability: number) {
  if (instability < 0.2) {
    return 'Stable';
  } else if (instability < 0.6) {
    return 'Normal';
  } else if (instability < 0.8) {
    return 'Flexible';
  } else {
    return 'Instable';
  }
}
