const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

// set size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

// shader helper
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

// mouse
let mouse = { x: 0, y: 0 };
let smoothMouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = canvas.height - e.clientY;
});

async function init() {
  const vertText = await fetch("shader.vert").then(r => r.text());
  const fragText = await fetch("shader.frag").then(r => r.text());

  const vertShader = createShader(gl, gl.VERTEX_SHADER, vertText);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragText);

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  gl.useProgram(program);

  // full screen quad
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
     1,  1
  ]), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // uniforms (GET ONCE)
  const resolutionLocation = gl.getUniformLocation(program, "iResolution");
  const timeLocation = gl.getUniformLocation(program, "iTime");
  const mouseLocation = gl.getUniformLocation(program, "iMouse");

  // set resolution once
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

function render(time) {
  gl.uniform1f(timeLocation, time * 0.001);

  smoothMouse.x += (mouse.x - smoothMouse.x) * 0.08;
  smoothMouse.y += (mouse.y - smoothMouse.y) * 0.08;

  gl.uniform2f(mouseLocation, smoothMouse.x, smoothMouse.y);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(render);
}

  render(0);
}

init();