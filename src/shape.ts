export function makeArc(
  lon0: number, lon1: number, lonSteps: number,
  lat0: number, lat1: number, latSteps: number,
) {
  let lons = linspace(lon0, lon1, lonSteps);
  let lats = linspace(lat0, lat1, latSteps);
}

export function linspace(begin: number, end: number, steps: number) {
  let step = (end - begin) / steps;
  let array = new Float32Array(steps + 1);
  for (let i = 0; i < steps; ++i) {
    array[i] = i * step + begin;
  }
  array[steps] = end;
  return array;
}
