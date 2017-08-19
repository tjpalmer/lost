import {World} from './all';

export class Game {
  
  constructor() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    let gl = this.gl = this.canvas.getContext('webgl')!;
    // Program.
    let program = gl.createProgram()!;
    gl.attachShader(program, this.loadShader(vertexSource, gl.VERTEX_SHADER));
    gl.attachShader(
      program, this.loadShader(fragmentSource, gl.FRAGMENT_SHADER)
    );
    gl.linkProgram(program);
    gl.useProgram(program);
    this.positionAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(this.positionAttrib);
    // Settings.
    gl.clearColor(0, 0, 0, 1);
    // Buffers.
    new World();
    let buffer = this.buffer = gl.createBuffer()!; 
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let vertices = [
      -0.5, -0.5, 0,
      0, 0.5, 0,
      0.5, -0.5, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Resize after drawing things are in place.
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  buffer: WebGLBuffer;

  canvas: HTMLCanvasElement;

  draw() {
    let {canvas, buffer, gl, positionAttrib} = this;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  gl: WebGLRenderingContext;

  loadShader(source: string, type: number) {
    let {gl} = this;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader!;
  }

  positionAttrib: number;

  resize = () => {
    let {canvas} = this;
    canvas.height = innerHeight;
    canvas.width = innerWidth;
    this.draw();
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
