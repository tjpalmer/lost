export type NumberArray = Array<number> | Float32Array;

export function dot4<Tensor extends NumberArray>(
  a: Tensor, b: Tensor, result?: Tensor
) {
  if (!result) {
    result = a.slice() as Tensor;
  }
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

export function scale<Tensor extends NumberArray>(a: Tensor, v: Tensor) {
  a[0] *= v[0];
  a[5] *= v[1];
  a[10] *= v[2];
  return a;
}

export function scale1<Tensor extends NumberArray>(a: Tensor, x: number) {
  a[0] *= x;
  a[5] *= x;
  a[10] *= x;
  return a;
}

export function translate<Tensor extends NumberArray>(a: Tensor, v: Tensor) {
  a[12] += v[0];
  a[13] += v[1];
  a[14] += v[2] || 0;
  return a;
}
