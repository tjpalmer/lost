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
    // Position.
    let positionBuffer = this.positionBuffer = gl.createBuffer()!; 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.world.shellPositions, gl.STATIC_DRAW);
    // let positions = [
    //   -0.5, -0.5, 0,
    //   -0.5, 0, 0,
    //   0, -0.5, 0,
    //   0, 0, 0,
    //   0, 0.5, 0,
    //   0.5, -0.5, 0,
    // ];
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // Index.
    // let indexBuffer = this.indexBuffer = gl.createBuffer()!;
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // let indices = [
    //   0, 1, 2, 0xFFFF, 3, 4, 5,
    // ];
    // gl.bufferData(
    //   gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW
    // );
    // Resize after drawing things are in place.
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  canvas: HTMLCanvasElement;

  draw() {
    let {canvas, gl, /*indexBuffer,*/ positionAttrib, positionBuffer} = this;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.world.shellPositions.length / 6);
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // gl.drawElements(gl.TRIANGLE_STRIP, 7, gl.UNSIGNED_SHORT, 0);
  }

  gl: WebGLRenderingContext;

  // indexBuffer: WebGLBuffer;

  loadShader(source: string, type: number) {
    let {gl} = this;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    console.log(source);
    console.log(gl.getShaderInfoLog(shader));
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

  world = new World();

}

let fragmentSource = `
  precision mediump float;
  varying vec3 vNormal;
  void main(void) {
    gl_FragColor = vec4(0.9, 0.6, 0.3, 1.0);
    vec3 light = normalize(vec3(1.0, 0.0, 0.0));
    gl_FragColor.xyz = gl_FragColor.xyz * dot(vNormal, light);
    // gl_FragColor.xyz = vNormal;
    // gl_FragColor.xyz = vec3(dot(vNormal, light));
  }
`;

let vertexSource = `
  attribute vec3 position;
  varying vec3 vNormal;
  void main(void) {
    gl_Position = vec4(position, 1.0);
    vNormal = normalize(position);
  }
`;
