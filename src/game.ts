export class Game {
  
  constructor() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  canvas: HTMLCanvasElement;

  resize = () => {
    let {canvas} = this;
    canvas.height = innerHeight;
    canvas.width = innerWidth;
  }

}
