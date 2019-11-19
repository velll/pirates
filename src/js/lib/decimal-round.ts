// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
function round(num: number, places: number): number {
  const factor = Math.pow(10, places);

  return Math.round(( num + Number.EPSILON ) * factor) / factor;
}

export { round };
