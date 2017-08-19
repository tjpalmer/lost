import {makeArc} from './all';

export class World {

  constructor() {
    this.shellPositions = makeArc(-0.5, 0.5, 20, -0.5, 0.5, 20);
  }

  shellPositions: Float32Array;

}
