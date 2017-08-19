import {makeArc} from './all';

export class World {

  constructor() {
    this.shellPositions = makeArc(20, -1, 1, 0.2, 0.5);
  }

  shellPositions: Float32Array;

}
