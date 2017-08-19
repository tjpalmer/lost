import {World} from './all';

export class Game {
  
  constructor() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    let gl = this.gl =
      this.canvas.getContext('webgl2') as WebGLRenderingContext;
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
    // Position.
    let positionBuffer = this.positionBuffer = gl.createBuffer()!; 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let vertices = [
      -0.5, -0.5, 0,
      -0.5, 0, 0,
      0, -0.5, 0,
      0, 0, 0,
      0, 0.5, 0,
      0.5, -0.5, 0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    // Index.
    let indexBuffer = this.indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    let indices = [
      0, 1, 2, 0xFFFF, 3, 4, 5,
    ];
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW
    );
    // Resize after drawing things are in place.
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  canvas: HTMLCanvasElement;

  draw() {
    let {canvas, gl, indexBuffer, positionAttrib, positionBuffer} = this;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.drawElements(gl.TRIANGLE_STRIP, 7, gl.UNSIGNED_SHORT, 0);
  }

  gl: WebGLRenderingContext;

  indexBuffer: WebGLBuffer;

  loadShader(source: string, type: number) {
    let {gl} = this;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader!;
  }

  positionAttrib: number;

  positionBuffer: WebGLBuffer;

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
