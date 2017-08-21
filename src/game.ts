import {World} from './all';

export class Game {

  constructor() {
    // Canvas.
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
    this.transformAttrib = gl.getAttribLocation(program, 'transform');
    gl.enableVertexAttribArray(this.transformAttrib);
    this.cursorUniform = gl.getUniformLocation(program, 'cursor')!;
    this.viewUniform = gl.getUniformLocation(program, 'view')!;
    // Settings.
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.DEPTH_TEST);
    // Buffers.
    // Position.
    let positionBuffer = this.positionBuffer = gl.createBuffer()!; 
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.world.shellPositions, gl.STATIC_DRAW);
    // Transform.
    let transformBuffer = this.transformBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER, new Float32Array([0, 0, 3, 3]), gl.STATIC_DRAW,
    );
    // Resize after drawing things are in place.
    addEventListener('resize', this.resize);
    this.resize();
    // Mouse, also after drawing is ready.
    let cursor = document.getElementsByTagName('svg')[0];
    addEventListener('mousemove', event => {
      let {style} = cursor;
      let {clientX: x, clientY: y} = event;
      let {cursorPosition, view} = this;
      style.left = `${x - cursor.clientWidth / 2}px`;
      style.top = `${y - cursor.clientHeight / 2}px`;
      let [height, width] = [innerHeight, innerWidth];
      x = (2 * (x / width) - 1) / view[0];
      let z = (-2 * (y / height) + 1) / view[10];
      cursorPosition.set([x, 1.0, z]);
      this.draw();
    });
  }

  canvas: HTMLCanvasElement;

  cursorPosition = new Float32Array(3);

  cursorUniform: WebGLUniformLocation;

  draw() {
    let {
      canvas, cursorPosition, cursorUniform, gl, positionAttrib, positionBuffer,
      transformAttrib, transformBuffer, view, viewUniform,
    } = this;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    gl.vertexAttribPointer(transformAttrib, 2, gl.FLOAT, false, 0, 0);
    (gl as any).vertexAttribDivisor(transformAttrib, 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(cursorUniform, cursorPosition);
    gl.uniformMatrix4fv(viewUniform, false, view);
    (gl as any).drawArraysInstanced(
      gl.TRIANGLES, 0, this.world.shellPositions.length / 3, 2,
    );
  }

  gl: WebGLRenderingContext;

  loadShader(source: string, type: number) {
    let {gl} = this;
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    // console.log(source);
    // console.log(gl.getShaderInfoLog(shader));
    return shader!;
  }

  positionAttrib: number;

  positionBuffer: WebGLBuffer;

  resize = () => {
    let {canvas, scale, view} = this;
    let [height, width] = [innerHeight, innerWidth];
    canvas.height = height;
    canvas.width = width;
    view[0] = scale * height / width;
    view[5] = view[10] = scale;
    this.draw();
  }

  scale = 0.05;

  transformAttrib: number;

  transformBuffer: WebGLBuffer;

  view = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);

  viewUniform: WebGLUniformLocation;

  world = new World();

}

let fragmentSource = `
  precision mediump float;
  varying vec3 vCursorDiff;
  varying vec3 vNormal;
  void main(void) {
    vec3 rgb = vec3(0.1, 0.6, 0.4);
    vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
    float scale = 0.5 * (dot(vNormal, light) + 1.0);
    scale = 0.8 * scale + 0.2;
    rgb = rgb * scale;
    scale = 0.1 * (dot(vNormal, vCursorDiff) + 1.0);
    rgb.x = rgb.x + scale;
    gl_FragColor = vec4(rgb, 1.0);
    // gl_FragColor.xyz = vCursorDiff;
  }
`;

let vertexSource = `
  uniform vec3 cursor;
  uniform mat4 view;
  attribute vec3 position;
  attribute vec2 transform;
  varying vec3 vCursorDiff;
  varying vec3 vNormal;
  void main(void) {
    vec3 pos = position;
    pos.xy = pos.xy + transform;
    vCursorDiff = cursor - pos;
    gl_Position = view * vec4(pos, 1.0);
    // gl_Position = gl_Position * vec4(0.8, 1.0, 1.0, 1.0);
    vNormal = normalize(position);
  }
`;
