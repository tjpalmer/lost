import {makeArc, makeIdentity, translate} from './all';

export class World {

  constructor() {
    let {bugs} = this;
    let bug = new Bug();
    console.log(bug.transform);
    translate(bug.transform, [-7, -3, 0]);
    console.log(bug.transform);
    bugs.push(bug);
    bugs.push(new Bug());
  }

  bugs = new Array<Bug>();

  makeTransforms() {
    let {bugs} = this;
    // TODO Less memory allocation!
    let transforms = new Float32Array(bugs.length * 16);
    bugs.forEach((bug, index) => {
      transforms.set(bug.transform, index * 16);
    });
    return transforms;
  }

  shellPositions = makeArc(20, -1, 1, 0.2, 0.5);

}

export class Bug {

  transform = makeIdentity();

}
