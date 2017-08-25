import {
  NumberArray, dot4, makeArc, makeIdentity, scale, scale1, translate,
} from './all';

export class World {

  constructor() {
    let {bugs} = this;
    let bug = new Bug();
    scale1(translate(bug.local, [-7, 3]), 1.1);
    bugs.push(bug);
    bugs.push(new Bug());
  }

  bugs = new Array<Bug>();

  makeTransforms(): [Float32Array, number] {
    let {bugs} = this;
    // TODO Less memory allocation!
    let count = 0;
    for (let bug of bugs) {
      count += bug.kids.length;
    }
    let transforms = new Float32Array(count * 16);
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

}

export class Part {

  constructor(init?: (local: NumberArray) => void) {
    if (init) {
      init(this.local);
    }
  }

  global = makeIdentity();

  kids = [] as Array<Part>;

  local = makeIdentity();

}

export class Bug extends Part {

  body = new Part(local => scale(local, [0.8, 1, 1]));

  head = new Part(local => translate(scale(local, [0.6, 0.4, 1]), [0, 0.7, 0]));

  kids = [this.body, this.head];

}
