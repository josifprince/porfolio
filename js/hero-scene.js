(() => {
  const canvas = document.querySelector('#product-scene');
  const scene = canvas?.closest('.hero-art');
  if (!canvas || !scene) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) {
    scene.classList.add('scene-fallback');
    return;
  }

  const vertexSource = `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 projection;
    uniform mat4 model;
    varying vec3 surfaceNormal;
    varying vec3 viewPosition;
    void main() {
      vec4 world = model * vec4(position, 1.0);
      viewPosition = world.xyz;
      surfaceNormal = normalize(mat3(model) * normal);
      gl_Position = projection * world;
    }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec3 color;
    varying vec3 surfaceNormal;
    varying vec3 viewPosition;
    void main() {
      vec3 n = normalize(surfaceNormal);
      vec3 light = normalize(vec3(-0.45, 0.8, 1.0));
      float diffuse = max(dot(n, light), 0.0);
      float rim = pow(1.0 - max(dot(n, normalize(-viewPosition)), 0.0), 2.0);
      vec3 lit = color * (0.48 + diffuse * 0.7) + vec3(0.14, 0.36, 0.34) * rim * 0.42;
      gl_FragColor = vec4(lit, 1.0);
    }
  `;
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  };
  const program = gl.createProgram();
  try {
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  } catch {
    scene.classList.add('scene-fallback');
    return;
  }
  gl.useProgram(program);

  const cubePositions = [];
  const cubeNormals = [];
  const faces = [
    [[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,0,1]],
    [[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[0,0,-1]],
    [[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1],[0,1,0]],
    [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,-1,0]],
    [[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1],[1,0,0]],
    [[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,0,0]]
  ];
  faces.forEach(([a,b,c,d,n]) => {
    [a,b,c,a,c,d].forEach(point => { cubePositions.push(...point); cubeNormals.push(...n); });
  });
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubePositions), gl.STATIC_DRAW);
  const positionLocation = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeNormals), gl.STATIC_DRAW);
  const normalLocation = gl.getAttribLocation(program, 'normal');
  gl.enableVertexAttribArray(normalLocation);
  gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);

  const projectionLocation = gl.getUniformLocation(program, 'projection');
  const modelLocation = gl.getUniformLocation(program, 'model');
  const colorLocation = gl.getUniformLocation(program, 'color');
  const multiply = (a, b) => {
    const out = new Float32Array(16);
    for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++) {
      out[col * 4 + row] = a[row] * b[col * 4] + a[4 + row] * b[col * 4 + 1] + a[8 + row] * b[col * 4 + 2] + a[12 + row] * b[col * 4 + 3];
    }
    return out;
  };
  const translation = (x, y, z) => new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]);
  const scaling = (x, y, z) => new Float32Array([x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]);
  const rotateX = angle => { const c = Math.cos(angle), s = Math.sin(angle); return new Float32Array([1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]); };
  const rotateY = angle => { const c = Math.cos(angle), s = Math.sin(angle); return new Float32Array([c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]); };
  const perspective = (fov, aspect, near, far) => {
    const f = 1 / Math.tan(fov / 2), nf = 1 / (near - far);
    return new Float32Array([f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]);
  };

  const shapes = [
    { at: [-1.22, 0.06, 0], size: [0.86, 0.62, 0.28], color: [0.20, 0.72, 0.62], phase: 0.2 },
    { at: [-1.05, -0.58, 0.12], size: [0.9, 0.12, 0.34], color: [0.11, 0.34, 0.39], phase: 0.2 },
    { at: [0, -0.32, 0.12], size: [0.63, 0.78, 0.48], color: [0.78, 0.81, 0.54], phase: 2.0 },
    { at: [0, -0.32, 0.63], size: [0.47, 0.56, 0.08], color: [0.20, 0.39, 0.43], phase: 2.0 },
    { at: [1.18, 0.12, 0.1], size: [0.63, 0.65, 0.48], color: [0.90, 0.61, 0.38], phase: 4.0 },
    { at: [1.18, 0.12, 0.62], size: [0.47, 0.49, 0.08], color: [0.16, 0.33, 0.39], phase: 4.0 },
    { at: [-0.02, -1.05, -0.12], size: [2.45, 0.1, 0.72], color: [0.22, 0.43, 0.46], phase: 0 }
  ];

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let pointerX = 0;
  let pointerY = 0;
  let frame = 0;
  let visible = true;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const render = time => {
    frame = 0;
    if (!visible) return;
    const elapsed = reducedMotion.matches ? 0 : time * 0.00028;
    const rect = canvas.getBoundingClientRect();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(projectionLocation, false, perspective(Math.PI / 4.2, Math.max(0.2, rect.width / rect.height), 0.1, 40));
    const sceneRotation = multiply(rotateY(pointerX * 0.13 + Math.sin(elapsed) * 0.055), rotateX(pointerY * -0.1 + Math.cos(elapsed * 0.8) * 0.025));
    const responsiveScale = Math.min(1, Math.max(0.7, (rect.width / rect.height) / 1.2));
    const responsiveFrame = multiply(sceneRotation, scaling(responsiveScale, responsiveScale, responsiveScale));
    const camera = translation(0, 0, -7.4);
    shapes.forEach(shape => {
      const floatY = reducedMotion.matches ? 0 : Math.sin(elapsed * 2 + shape.phase) * 0.055;
      const local = multiply(translation(shape.at[0], shape.at[1] + floatY, shape.at[2]), scaling(...shape.size));
      const model = multiply(camera, multiply(responsiveFrame, local));
      gl.uniformMatrix4fv(modelLocation, false, model);
      gl.uniform3fv(colorLocation, shape.color);
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    });
    if (!reducedMotion.matches) frame = requestAnimationFrame(render);
  };
  const start = () => { if (visible && !frame) frame = requestAnimationFrame(render); };
  new ResizeObserver(() => { resize(); start(); }).observe(scene);
  scene.addEventListener('pointermove', event => {
    const rect = scene.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    if (reducedMotion.matches) start();
  }, { passive: true });
  scene.addEventListener('pointerleave', () => { pointerX = 0; pointerY = 0; if (reducedMotion.matches) start(); });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }).observe(scene);
  reducedMotion.addEventListener('change', start);
  resize();
  scene.classList.add('webgl-ready');
  start();
})();
