import {makeArc, makeIdentity, scale, translate} from './all';

export class World {

  constructor() {
    let {bugs} = this;
    let bug = new Bug();
    // scale(bug.body, [1.2, 1.2, 1.2]);
    translate(bug.body, [-7, -3, 0]);
    translate(bug.head, [-7, -3, 0]);
    bugs.push(bug);
    bugs.push(new Bug());
  }

  bugs = new Array<Bug>();

  makeTransforms(): [Float32Array, number] {
    let {bugs} = this;
    // TODO Less memory allocation!
    let transforms = new Float32Array(2 * bugs.length * 16);
    bugs.forEach((bug, index) => {
      transforms.set(bug.body, 2 * index * 16);
      transforms.set(bug.head, (2 * index + 1) * 16);
    });
    return [transforms, 2 * bugs.length];
  }

  shellPositions = makeArc(20, -1, 1, 0.2, 0.5);

}

export class Bug {

  body = scale(makeIdentity(), [0.8, 1, 1]);

  head = translate(scale(makeIdentity(), [0.6, 0.4, 1]), [0, 0.7, 0]);

}
