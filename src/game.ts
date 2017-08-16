export class Game {
  
  constructor() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    window.addEventListener('resize', this.resize);
    this.resize();
    let gl = this.gl = this.canvas.getContext('webgl')!;
    let program = gl.createProgram()!;
    gl.attachShader(program, this.loadShader(vertex, gl.VERTEX_SHADER));
  }

  canvas: HTMLCanvasElement;

  gl: WebGLRenderingContext;

  loadShader(source: string, type: number) {
    let {gl} = this;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader!;
  }

  resize = () => {
    let {canvas} = this;
    canvas.height = innerHeight;
    canvas.width = innerWidth;
  }

}

let vertex = `
  attribute vec3 position;
  void main(void) {
    gl_Position = vec4(position, 1.0);
  }
`;
