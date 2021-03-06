import {World, makeIdentity} from './all';

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
    for (let i = 0; i < 4; ++i) {
      let transformAttrib = this.transformAttribs[i] =
        gl.getAttribLocation(program, `transform${i}`);
      gl.enableVertexAttribArray(transformAttrib);
    }
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
    this.transformBuffer = gl.createBuffer()!;
    // Resize after drawing things are in place.
    addEventListener('resize', this.resize);
    this.resize();
    // Mouse, also after drawing is ready.
    let cursor = document.getElementsByTagName('svg')[0];
    let {height: cursorHeight, width: cursorWidth} =
      cursor.getBoundingClientRect();
    addEventListener('mousemove', event => {
      let {style} = cursor;
      let {clientX: x, clientY: y} = event;
      let {view, world} = this;
      let {cursor: cursorPosition} = world;
      // style.left = `${x - cursorWidth / 2}px`;
      // style.top = `${y - cursorHeight / 2}px`;
      let [height, width] = [innerHeight, innerWidth];
      x = (2 * (x / width) - 1) / view[0];
      y = (-2 * (y / height) + 1) / view[5];
      cursorPosition.set([x, y, 1.3]);
    });
    this.step();
  }

  canvas: HTMLCanvasElement;

  cursorUniform: WebGLUniformLocation;

  draw() {
    let {
      canvas, cursorUniform, gl, positionAttrib, positionBuffer,
      transformAttribs, transformBuffer, view, viewUniform, world,
    } = this;
    let {cursor: cursorPosition} = world;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Transforms.
    gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
    let [transforms, count] = this.world.makeTransforms();
    gl.bufferData(gl.ARRAY_BUFFER, transforms, gl.DYNAMIC_DRAW);
    for (let i = 0; i < 4; ++i) {
      gl.vertexAttribPointer(
        transformAttribs[i], 4, gl.FLOAT, false, 64, 16 * i
      );
      (gl as any).vertexAttribDivisor(transformAttribs[i], 1);
    }
    // Positions.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.uniform3fv(cursorUniform, cursorPosition);
    gl.uniformMatrix4fv(viewUniform, false, view);
    (gl as any).drawArraysInstanced(
      gl.TRIANGLES, 0, this.world.shellPositions.length / 3, count,
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

  step = () => {
    window.requestAnimationFrame(this.step);
    this.draw();
  }

  resize = () => {
    let {canvas, scale, view} = this;
    let [height, width] = [innerHeight, innerWidth];
    canvas.height = height;
    canvas.width = width;
    view[0] = scale * height / width;
    view[5] = scale;
    view[10] = -scale;
  }

  scale = 0.05;

  transformAttribs = [] as Array<number>;

  transformBuffer: WebGLBuffer;

  view = makeIdentity();

  viewUniform: WebGLUniformLocation;

  world = new World();

}

let fragmentSource = `
  precision mediump float;
  varying vec3 vCursorDiff;
  varying vec3 vNormal;
  void main(void) {
    vec3 rgb = vec3(0.1, 0.6, 0.4);
    vec3 light = normalize(vec3(-1, 1, 0.7));
    float scale = 0.5 * (dot(vNormal, light) + 1.0);
    scale = 0.8 * scale + 0.2;
    rgb = rgb * scale;
    scale = 0.4 * (dot(vNormal, normalize(vCursorDiff)) + 1.0);
    scale = scale / pow(length(vCursorDiff), 0.1);
    rgb.x = rgb.x + scale;
    gl_FragColor = vec4(rgb, 1.0);
    // gl_FragColor.xyz = vCursorDiff;
  }
`;

let vertexSource = `
  uniform vec3 cursor;
  uniform mat4 view;
  attribute vec3 position;
  attribute vec4 transform0, transform1, transform2, transform3;
  // attribute mat4 transform;
  varying vec3 vCursorDiff;
  varying vec3 vNormal;
  void main(void) {
    vec4 pos = vec4(position, 1.0);
    mat4 transform = mat4(transform0, transform1, transform2, transform3);
    pos = transform * pos;
    vCursorDiff = cursor - pos.xyz;
    gl_Position = view * pos;
    // gl_Position = gl_Position * vec4(0.8, 1.0, 1.0, 1.0);
    // Shape and rotate normals, but don't translate them.
    vNormal = normalize(pos.xyz - transform3.xyz);
    // vNormal = normalize(position);
  }
`;
