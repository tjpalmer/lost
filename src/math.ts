type NumberArray = Array<number> | Float32Array;

export function dot4<Tensor extends NumberArray>(a: Tensor, b: Tensor) {
  let result = a.slice() as Tensor;
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      let r = 0;
      for (let ji = 0; ji < 4; ++ji) {
        r += a[4 * ji + i] * b[4 * j + ji];
      }
      result[4 * j + i] = r;
    }
  }
  return result;
}

export function makeIdentity<Tensor extends NumberArray>(): NumberArray {
  let result = new Float32Array(16);
  result[0] = result[5] = result[10] = result[15] = 1;
  return result;
}

export function translate<Tensor extends NumberArray>(a: Tensor, v: Tensor) {
  a[12] += v[0];
  a[13] += v[1];
  a[14] += v[2];
}
