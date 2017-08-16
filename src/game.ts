export class Game {
  
  constructor() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    window.addEventListener('resize', this.resize);
    this.resize();
    let gl = this.gl = this.canvas.getContext('webgl')!;
    // Program.
    let program = gl.createProgram()!;
    gl.attachShader(program, this.loadShader(vertexSource, gl.VERTEX_SHADER));
    gl.attachShader(
      program, this.loadShader(fragmentSource, gl.FRAGMENT_SHADER)
    );
    gl.linkProgram(program);
    gl.useProgram(program);
    // Buffers.
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

let fragmentSource = `
  void main(void) {
    gl_FragColor = vec4(0.9, 0.6, 0.3, 1.0);
  }
`;

let vertexSource = `
  attribute vec3 position;
  void main(void) {
    gl_Position = vec4(position, 1.0);
  }
`;
