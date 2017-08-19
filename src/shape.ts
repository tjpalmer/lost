export function makeArc(
  steps: number, lon0: number, lon1: number, lat0: number, lat1: number,
) {
  let {PI, abs, ceil, cos, sin} = Math;
  steps = ceil(steps * abs(lon1 - lon0) / 2);
  let lonSteps = steps, latSteps = steps;
  let lons = linspace(lon0 * PI, lon1 * PI, lonSteps);
  let lats = linspace(lat0 * PI, lat1 * PI, latSteps);
  let positions = new Float32Array(3 * 3 * 2 * lonSteps * latSteps);
  let posOffset = 0;
  function addXyz(j: number, i: number) {
    let lon = lons[j];
    let lat = lats[i];
    let y = cos(lat);
    let z = sin(lat);
    let x = cos(lon) * y;
    y = sin(lon) * y;
    positions[posOffset++] = x;
    positions[posOffset++] = y;
    positions[posOffset++] = z;
  }
  for (let j = 0; j < lonSteps; ++j) {
    for (let i = 0; i < latSteps; ++i) {
      addXyz(j, i);
      addXyz(j + 1, i);
      addXyz(j + 1, i + 1);
      addXyz(j, i);
      addXyz(j + 1, i + 1);
      addXyz(j, i + 1);
    }
  }
  return positions;
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
