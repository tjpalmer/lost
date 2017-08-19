import {makeArc} from './all';

export class World {

  constructor() {
    this.shellPositions = makeArc(-1, 1, 20, 0.3, 0.4, 1);
  }

  shellPositions: Float32Array;

}
