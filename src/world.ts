import {
  NumberArray, angle2, dot, dot4, makeArc, makeIdentity, normalize, rotationZ,
  scale, scale1, sub, translate,
} from './all';
const {abs, min, random, sign} = Math;

export class World {

  constructor() {
    let {bugs} = this;
    let range = 40;
    for (let i = 0; i < 100; ++i) {
      let bug = new Bug();
      translate(
        bug.local, [2 * range * (random() - 0.5), range * (random() - 0.5)],
      );
      // We need the idea of a kid transform separate from world transform.
      // scale1(bug.local, 1.1);
      // console.log(bug.local);
      bugs.push(bug);
    }
  }

  bugs = new Array<Bug>();

  cursor = new Float32Array(3);

  makeTransforms(): [Float32Array, number] {
    this.update();
    let {bugs} = this;
    // TODO Less memory allocation!
    let count = 0;
    for (let bug of bugs) {
      count += bug.kids.length;
    }
    let size = count * 16;
    if (transforms.length < size) {
      transforms = new Float32Array(size * 1.25);
    }
    count = 0;
    for (let bug of bugs) {
      for (let kid of bug.kids) {
        dot4(bug.local, kid.local, kid.global);
        transforms.set(kid.global, count++ * 16);
      }
    }
    return [transforms, count];
  }

  shellPositions = makeArc(20, -1, 1, 0.2, 0.5);

  update() {
    let {bugs, cursor} = this;
    let forward = vec4a;
    let diff = vec3a;
    diff.set(cursor);
    for (let bug of bugs) {
      let {local} = bug;
      let pos = local.subarray(12);
      diff.set(cursor);
      sub(diff, pos);
      forward.set(forwardLocal);
      dot4(bug.local, forwardLocal, forward);
      sub(forward, pos);
      let angle = -angle2(forward, diff);
      angle = sign(angle) * min(0.1 * abs(angle), abs(angle));
      // angle += random() * 0.01;
      dot4(bug.local, rotationZ(angle, work1), work2);
      bug.local.set(work2);
      // Need some collision detection to avoid this too much.
      // scale1(forward, 0.1);
      // translate(bug.local, forward);
    }
  }

}

export class Part {

  constructor(init?: (local: NumberArray) => void) {
    if (init) {
      init(this.local);
    }
  }

  global = makeIdentity();

  // TODO kid transform

  kids = [] as Array<Part>;

  local = makeIdentity();

}

export class Bug extends Part {

  body = new Part(local => scale(local, [1, 0.8, 1]));

  head = new Part(local => translate(scale(local, [0.4, 0.6, 1]), [0.7, 0, 0]));

  kids = [this.body, this.head];

}

let work1 = makeIdentity();
let work2 = makeIdentity();

let forwardLocal = new Float32Array([1, 0, 0, 1]);

let vec3a = new Float32Array(3);
let vec3b = new Float32Array(3);
let vec4a = new Float32Array(4);

let transforms = new Float32Array(0);
