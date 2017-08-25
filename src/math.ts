export type NumberArray = Array<number> | Float32Array;

export function dot<Tensor extends NumberArray>(
  nrows: number, a: Tensor, b: NumberArray, result?: Tensor
) {
  let nmiddle = a.length / nrows;
  let ncols = b.length / nmiddle;
  if (!result) {
    result = new (a.constructor as new(n: number) => Tensor)(nrows * ncols);
  }
  for (let i = 0; i < nrows; ++i) {
    for (let j = 0; j < ncols; ++j) {
      let r = 0;
      for (let ji = 0; ji < nmiddle; ++ji) {
        r += a[nrows * ji + i] * b[nmiddle * j + ji];
      }
      result[nrows * j + i] = r;
    }
  }
  return result;
}

export function dot4<Tensor extends NumberArray>(
  a: Tensor, b: NumberArray, result?: Tensor
) {
  return dot(4, a, b, result);
}

export function makeIdentity(): Float32Array {
  let result = new Float32Array(16);
  result[0] = result[5] = result[10] = result[15] = 1;
  return result;
}

export function norm<Tensor extends NumberArray>(a: Tensor) {
  let result = 0;
  for (let x of a) {
    result += x * x;
  }
  return Math.sqrt(result);
}

export function normalize<Tensor extends NumberArray>(a: Tensor) {
  let n = norm(a);
  return scale1(a, 1 / n);
}

export function scale<Tensor extends NumberArray>(a: Tensor, v: NumberArray) {
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

export function sub<Tensor extends NumberArray>(a: Tensor, b: NumberArray) {
  for (let i = 0; i < a.length; ++i) {
    a[i] -= b[i] || 0;
  }
  return a;
}

export function translate<Tensor extends NumberArray>(
  a: Tensor, v: NumberArray
) {
  a[12] += v[0];
  a[13] += v[1];
  a[14] += v[2] || 0;
  return a;
}
