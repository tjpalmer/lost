import {makeArc} from './all';

export class World {

  constructor() {
    this.shellPositions = makeArc(20, 0, 1, 0.3, 0.4);
  }

  shellPositions: Float32Array;

}
