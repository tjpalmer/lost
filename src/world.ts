import {makeArc} from './all';

export class World {

  constructor() {
    this.shellPositions = makeArc(-1, 1, 20, -1, 1, 20);
  }

  shellPositions: Float32Array;

}
