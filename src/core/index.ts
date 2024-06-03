// SDP expressions:
// Instability = Fan-out / (Fan-in + Fan-out)
export function evaluate(fanOut: number, fanIn: number) {
  if (fanOut === 0 && fanIn === 0) {
    return 0;
  }
  return fanOut / (fanOut + fanIn);
}
