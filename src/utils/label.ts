// The label is determined based on the value of stability
export function getStablityLabel(stablility: number) {
  if (stablility < 0.2) {
    return 'Stable';
  } else if (stablility < 0.6) {
    return 'Normal';
  } else if (stablility < 0.8) {
    return 'Flexible';
  } else {
    return 'Instable';
  }
}
