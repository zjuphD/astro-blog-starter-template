// Horizon shader and glyph-wave renderer shared with the BioSeeki desktop home screen.
function createHomeHorizon(canvas, invalidate) {
  const gl = canvas.getContext("webgl2", {
    alpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power"
  });
  // CSS supplies the resting horizon while the GPU is unavailable.
  if (!gl) return null;
  const vertex = `#version 300 es
    out vec2 uv;
    void main() {
      vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
      uv = corner;
      gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
    }`;
  const fragment = `#version 300 es
    precision highp float;
    in vec2 uv;
    out vec4 color;
    uniform vec3 sky, blue, pearl;
    uniform vec2 page;
    uniform float phase, dark;
    void main() {
      float depth = uv.y;
      float x = uv.x;
      float ridge = sin(x * 9.8 + phase * .73) * .009 + sin(x * 17. + phase * .41) * .005;
      float spread = .267 + ridge + .009 * sin(x * 5.7 - phase);
      float fog = exp(-pow(depth / spread, 2.62));
      if (fog < .0012) { color = vec4(0.); return; }
      float edge = smoothstep(0., .32, min(x, 1. - x));
      float center = .50 + .18 * sin(phase * 1.13);
      float distanceX = (x - center) / .32;
      float ray = exp(-distanceX * distanceX);
      float breath = .97 + .035 * sin(phase * 1.3 + .7);
      float opacity = fog * mix(.41, 1., edge) * (.71 + .20 * ray - .08 * dark) * breath;
      float band = x + .23 * sin(phase * .87 - 1.7) + .30 * (depth - .14) + ridge * 1.2;
      band = mix(band, 1. - band, dark);
      vec3 ink = mix(sky, blue, smoothstep(.22, .54, band));
      ink = mix(ink, pearl, smoothstep(.6, .93, band));
      float gray = dot(ink, vec3(.21, .72, .07));
      ink = mix(ink, vec3(gray), (1. - edge) * .54);
      // The moving dots follow the crest and have their own opacity on pale paper.
      float patchX = .45 + .17 * sin(phase * .97 - .5);
      vec2 offset = vec2((x - patchX) / .21, (depth - .18 - ridge * 1.8) / .085);
      float density = exp(-dot(offset, offset));
      vec2 grid = uv * page / vec2(5.4, 5.0);
      grid.y += sin(x * 12. - phase * .71) * 1.6 + .32 * sin(x * 27. + phase * .4);
      grid.x += .5 * mod(floor(grid.y), 2.);
      float radius = .11 + density * .19;
      float dotEdge = length(fract(grid) - .5);
      float pixel = clamp(fwidth(dotEdge) * .60, .045, .13);
      float dots = (1. - smoothstep(radius - pixel, radius + pixel, dotEdge)) * density * .62;
      vec3 dotInk = mix(blue * .63, mix(pearl, vec3(1.), .44), dark);
      color = vec4(ink * opacity * (1. - dots) + dotInk * dots, opacity + dots * (1. - opacity));
    }`;
  let program = null, uniforms;
  function build() {
    const compiled = [];
    try {
      program = gl.createProgram();
      for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
        const shader = gl.createShader(type);
        if (!shader) throw Error("Home horizon shader unavailable");
        compiled.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error("Home horizon shader did not compile");
        gl.attachShader(program, shader);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Home horizon could not link");
      uniforms = Object.fromEntries(["sky", "blue", "pearl", "page", "phase", "dark"].map(name => [name, gl.getUniformLocation(program, name)]));
      canvas.dataset.horizon = "webgl2";
    } catch {
      if (program) gl.deleteProgram(program);
      program = null;
      delete canvas.dataset.horizon;
    } finally {
      for (const shader of compiled) gl.deleteShader(shader);
    }
  }
  const lost = event => {
    event.preventDefault();
    program = null;
    delete canvas.dataset.horizon;
  };
  const restored = () => { build(); invalidate(); };
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  build();
  return {
    resize(width, height) {
      // The color field has low spatial frequency. Text uses the separate high-resolution canvas.
      const ratio = Math.min(.86, Math.sqrt(600000 / (width * height)));
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
    },
    draw(width, height, seconds, colors) {
      if (!program) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform2f(uniforms.page, width, height);
      gl.uniform1f(uniforms.phase, seconds);
      gl.uniform1f(uniforms.dark, colors.dark ? 1 : 0);
      for (const [name, rgb] of [["sky", colors.sky], ["blue", colors.blue], ["pearl", colors.pearl]]) {
        gl.uniform3fv(uniforms[name], rgb);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      if (program) gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  };
}

function createHomeAuroraRenderer(context, horizonCanvas) {
  const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const characters = "0123456789" + letters;
  const cellWidth = 7, cellHeight = 15;
  const atlas = document.createElement("canvas"), atlasContext = atlas.getContext("2d");
  const rest = document.createElement("canvas"), resting = rest.getContext("2d");
  let width = 0, height = 0, columns = 0, rows = 0, atlasScale = 1, colors;
  let ids, mask, restingMask, level, velocity, afterglow;
  let seconds = 0, glyphTick = -1, previous = null, waveUntil = 0;
  const horizon = createHomeHorizon(horizonCanvas, () => {
    if (colors && width && height) horizon?.draw(width, height, seconds, colors);
  });
  function hash(column, row, generation = 0) {
    let n = Math.imul(column + generation * 17, 0x1b873593) ^ Math.imul(row + 391, 0x85ebca6b);
    n = Math.imul(n ^ n >>> 16, 0x27d4eb2d);
    return ((n ^ n >>> 15) >>> 0) / 4294967296;
  }
  const ease = n => { n = Math.max(0, Math.min(n, 1)); return n * n * (3 - 2 * n); };
  function cloud(x, y) {
    const left = Math.floor(x), top = Math.floor(y), u = ease(x - left), v = ease(y - top);
    const a = hash(left, top), b = hash(left, top + 1);
    return (a + u * (hash(left + 1, top) - a)) * (1 - v) + (b + u * (hash(left + 1, top + 1) - b)) * v;
  }
  function stamp(target, id, tone, x, y) {
    const sw = cellWidth * atlasScale, sh = cellHeight * atlasScale;
    target.drawImage(atlas, id * sw, tone * sh, sw, sh, x, y, cellWidth, cellHeight);
  }
  function updateRest() {
    glyphTick = Math.floor(seconds * 2);
    resting.clearRect(0, 0, width, height);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const i = row * columns + col;
        const r = hash(col, row, glyphTick);
        const id = r < .30 ? Math.floor(r / .30 * 10) : 10 + Math.floor((r - .30) / .70 * letters.length);
        ids[i] = id;
        const x = col * cellWidth, y = row * cellHeight;
        const drift = x + seconds * 7;
        const cover = cloud(drift / 106, y / 97) * .73 + cloud(drift / 49 + 4.8, y / 62) * .27;
        const opacity = (.012 + .14 * ease((cover - .43) / .30)) * restingMask[i];
        if (opacity < .012) continue;
        resting.globalAlpha = opacity;
        stamp(resting, id, 0, x, y);
      }
    }
  }
  function prepare(w, h, palette, copy) {
    width = w; height = h;
    const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    colors = { ...palette, sky: rgb(palette.neonStart), blue: rgb(palette.neonMiddle), pearl: rgb(palette.neonEnd) };
    columns = Math.ceil(w / cellWidth); rows = Math.ceil(h / cellHeight);
    ids = new Uint8Array(columns * rows);
    mask = new Float32Array(ids.length); restingMask = new Float32Array(ids.length);
    level = new Float32Array(ids.length);
    velocity = new Float32Array(ids.length); afterglow = new Float32Array(ids.length);
    waveUntil = 0; previous = null;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const x = (col + .5) * cellWidth, y = (row + .5) * cellHeight;
        const edge = ease(Math.min(col / 5, (columns - 1 - col) / 5, row / 3, (rows - 1 - row) / 3));
        // Reserve reading space around the actual headline, description and actions.
        const dx = Math.max(0, copy.left - x, x - copy.right);
        const dy = Math.max(0, copy.top - y, y - copy.bottom);
        const clearance = ease(Math.hypot(dx / 122, dy / 86));
        mask[row * columns + col] = edge * (.55 + .45 * clearance);
        restingMask[row * columns + col] = edge * (.14 + .86 * clearance);
      }
    }
    const spectral = palette.warm
      ? ["#ac613c", "#e18a54", "#e8ac68", "#bc6e56"]
      : palette.dark ? ["#82acff", "#aa8ee5", "#ff745f", "#ffbe44"] : ["#2b56cc", "#8047cc", "#dc4938", "#bd791e"];
    const waveInk = palette.dark ? "#c9dded" : "#496799";
    const inks = [palette.dark ? "#999faa" : "#536785"];
    for (let hue = 0; hue < 12; hue++) {
      const stop = Math.floor(hue / 3);
      const blend = `color-mix(in srgb,${spectral[stop]},${spectral[(stop + 1) % 4]} ${hue % 3 * 100 / 3}%)`;
      for (const strength of [22, 58, 96]) inks.push(`color-mix(in srgb,${waveInk},${blend} ${strength}%)`);
    }
    atlasScale = Math.max(1, Math.round(context.canvas.width / w));
    atlas.width = cellWidth * atlasScale * characters.length; atlas.height = cellHeight * atlasScale * inks.length;
    atlasContext.font = (10 * atlasScale) + "px ui-monospace, Menlo, monospace";
    atlasContext.textAlign = "center"; atlasContext.textBaseline = "middle";
    for (let tone = 0; tone < inks.length; tone++) {
      atlasContext.fillStyle = inks[tone];
      for (let id = 0; id < characters.length; id++) {
        atlasContext.fillText(characters[id], (id + .5) * cellWidth * atlasScale, (tone + .5) * cellHeight * atlasScale);
      }
    }
    rest.width = context.canvas.width; rest.height = context.canvas.height;
    resting.setTransform(rest.width / w, 0, 0, rest.height / h, 0, 0);
    horizon?.resize(w, h);
    updateRest();
  }
  function disturb(x, y, strength, radius, now) {
    if (!width) return;
    const cx = x / cellWidth - .5, cy = y / cellHeight - .5;
    const rx = radius / cellWidth, ry = radius / cellHeight;
    for (let row = Math.max(1, Math.floor(cy - 2.5 * ry)); row <= Math.min(rows - 2, Math.ceil(cy + 2.5 * ry)); row++) {
      for (let col = Math.max(1, Math.floor(cx - 2.5 * rx)); col <= Math.min(columns - 2, Math.ceil(cx + 2.5 * rx)); col++) {
        const distance = ((col - cx) / rx) ** 2 + ((row - cy) / ry) ** 2;
        const impulse = strength * Math.exp(-distance) * (1 - .55 * distance);
        const i = row * columns + col;
        level[i] = Math.max(-2, Math.min(2, level[i] + impulse));
        velocity[i] = Math.max(-60, Math.min(60, velocity[i] + impulse * 19));
      }
    }
    waveUntil = now + 1900;
  }
  function advance(dt) {
    // Fixed maximum time step keeps the wave stable at different frame rates.
    const steps = Math.max(1, Math.ceil(dt / .007));
    const step = dt / steps, damping = Math.exp(-4.8 * step);
    const horizontal = (560 / cellWidth) ** 2, vertical = (560 / cellHeight) ** 2;
    for (let n = 0; n < steps; n++) {
      for (let row = 1; row + 1 < rows; row++) {
        const end = (row + 1) * columns - 1;
        for (let i = row * columns + 1; i < end; i++) {
          const center = level[i] * 2;
          const force = horizontal * (level[i - 1] + level[i + 1] - center) + vertical * (level[i - columns] + level[i + columns] - center);
          velocity[i] = (velocity[i] + force * step) * damping;
        }
      }
      for (let i = columns; i < level.length - columns; i++) level[i] += velocity[i] * step;
    }
  }
  function paint(spot, now) {
    if (!colors) return;
    const dt = previous === null ? 0 : Math.max(0, Math.min(.055, (now - previous) / 1000));
    previous = now; seconds += dt;
    if (glyphTick !== Math.floor(seconds * 2)) updateRest();
    horizon?.draw(width, height, seconds, colors);
    context.clearRect(0, 0, width, height);
    context.drawImage(rest, 0, 0, width, height);
    const hasWave = now < waveUntil;
    if (!spot && !hasWave) return;
    if (hasWave && dt > 0) advance(dt);
    const decay = Math.exp(-dt * 3.6);
    for (let row = 1; row + 1 < rows; row++) {
      for (let col = 1; col + 1 < columns; col++) {
        const i = row * columns + col, x = (col + .5) * cellWidth, y = (row + .5) * cellHeight;
        const dx = spot ? x - spot.x : 0, dy = spot ? y - spot.y : 0;
        const hover = spot ? ease(1 - Math.sqrt(dx * dx + dy * dy) / 228) * spot.strength : 0;
        const amplitude = hasWave ? Math.min(1, Math.abs(level[i]) * 5.8) : 0;
        const memory = hasWave ? Math.max(amplitude, afterglow[i] * decay) : 0;
        afterglow[i] = memory;
        const opacity = Math.min(.96, (hover * .27 + amplitude * .50 + memory * .51) * (1 + .32 * hover)) * mask[i];
        if (opacity < .025) continue;
        let angle = Math.atan2(dy, dx);
        if (amplitude > .06) angle = Math.atan2(level[i + columns] - level[i - columns], level[i + 1] - level[i - 1]);
        const hue = angle / (2 * Math.PI) + seconds * .15 + .22 * Math.sin(col * .073 + row * .10);
        const tint = amplitude * .74 + hover * .53;
        const tone = 1 + Math.floor((hue - Math.floor(hue)) * 12) * 3 + (tint > .80 ? 2 : tint > .39 ? 1 : 0);
        context.globalAlpha = opacity;
        stamp(context, ids[i], tone, col * cellWidth, row * cellHeight);
      }
    }
    context.globalAlpha = 1;
  }
  function settle() {
    previous = null;
    if (!waveUntil) return;
    waveUntil = 0;
    level.fill(0); velocity.fill(0); afterglow.fill(0);
  }
  return { prepare, paint, disturb, settle, busy: now => now < waveUntil, dispose: () => horizon?.dispose() };
}

// The website owns the lifetime of the effect. The hero can be replaced during navigation.
function animateField(field) {
  const surface = field.parentElement;
  const copyElement = surface.querySelector(".hero-grid") || surface.querySelector("h1")?.parentElement;
  const horizon = document.createElement("canvas");
  const glyphs = document.createElement("canvas");
  const context = glyphs.getContext("2d");
  if (!context) return () => {};
  field.append(horizon, glyphs);
  const aurora = createHomeAuroraRenderer(context, horizon);
  const events = new AbortController();
  const options = { passive: true, signal: events.signal };
  const scheme = matchMedia("(prefers-color-scheme: dark)");
  let width = 0, height = 0, scale = 0, palette, copyBounds;
  let visible = false, frame = 0, lastDraw = -Infinity;
  let spot = null, press = null, awakeUntil = 0;

  function rest() {
    cancelAnimationFrame(frame);
    frame = 0;
    spot = null;
    awakeUntil = 0;
    lastDraw = -Infinity;
    aurora.settle();
    if (visible && !document.hidden && palette) aurora.paint(null, performance.now());
  }

  function draw(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    if (spot && now - spot.time >= 1200) spot = null;
    if (!spot && !aurora.busy(now) && now >= awakeUntil) {
      rest();
      return;
    }
    if (now - lastDraw >= 31) {
      const light = spot && { x: spot.x, y: spot.y, strength: Math.min(1, (1200 - now + spot.time) / 440) };
      aurora.paint(light, now);
      lastDraw = now;
    }
    frame = requestAnimationFrame(draw);
  }

  function wake() {
    if (visible && !document.hidden && !frame && palette) frame = requestAnimationFrame(draw);
  }

  function layout() {
    if (!visible || document.hidden) return;
    const rect = field.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const box = copyElement?.getBoundingClientRect();
    const copy = box
      ? { left: box.left - rect.left, top: box.top - rect.top, right: box.right - rect.left, bottom: box.bottom - rect.top }
      : { left: rect.width / 2, right: rect.width / 2, top: rect.height / 2, bottom: rect.height / 2 };
    const style = getComputedStyle(field);
    const read = name => style.getPropertyValue(name).trim();
    const next = { neonStart: read("--home-neon-start"), neonMiddle: read("--home-neon-middle"),
      neonEnd: read("--home-neon-end"), dark: read("--home-dark") === "1", warm: false };
    const limit = Math.sqrt(2400000 / (rect.width * rect.height));
    const dpr = window.devicePixelRatio || 1;
    const ratio = limit >= 1 ? Math.min(2, Math.max(1, Math.floor(Math.min(dpr, limit)))) : limit;
    if (width === rect.width && height === rect.height && scale === ratio && palette &&
        Object.keys(next).every(key => next[key] === palette[key]) &&
        Object.keys(copy).every(key => Math.abs(copy[key] - copyBounds[key]) < 1)) return;
    width = rect.width;
    height = rect.height;
    scale = ratio;
    palette = next;
    copyBounds = copy;
    glyphs.width = Math.max(1, Math.floor(width * scale));
    glyphs.height = Math.max(1, Math.floor(height * scale));
    context.setTransform(glyphs.width / width, 0, 0, glyphs.height / height, 0, 0);
    aurora.prepare(width, height, palette, copy);
    aurora.paint(null, performance.now());
  }

  const position = event => {
    const rect = field.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top, time: performance.now() };
  };
  const interactive = target => target.closest?.("a, button, input, textarea, select, summary, [role=button], [contenteditable=true]");
  surface.addEventListener("pointermove", event => {
    if (!visible || !event.isPrimary || event.pointerType !== "mouse" || event.buttons || interactive(event.target)) return;
    spot = position(event);
    wake();
  }, options);
  surface.addEventListener("pointerleave", () => { spot = press = null; }, options);
  surface.addEventListener("pointerdown", event => {
    if (visible && event.isPrimary && event.button === 0 && !interactive(event.target)) {
      press = { id: event.pointerId, ...position(event) };
    }
  }, options);
  surface.addEventListener("pointerup", event => {
    const start = press;
    press = null;
    if (!visible || !start || start.id !== event.pointerId || interactive(event.target)) return;
    const end = position(event);
    if (Math.hypot(end.x - start.x, end.y - start.y) > 10 || end.time - start.time > 600 || !getSelection()?.isCollapsed) return;
    aurora.disturb(end.x, end.y, 1.22, 36, end.time);
    wake();
  }, options);
  surface.addEventListener("pointercancel", () => { press = null; }, options);

  const size = new ResizeObserver(layout);
  size.observe(field);
  if (copyElement) size.observe(copyElement);
  const theme = new MutationObserver(layout);
  theme.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  scheme.addEventListener("change", layout, options);
  const visibility = new IntersectionObserver(entries => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) {
      layout();
      awakeUntil = performance.now() + 1000;
      wake();
    } else rest();
  });
  visibility.observe(field);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) rest();
    else { layout(); rest(); }
  }, options);
  window.addEventListener("blur", rest, options);
  window.addEventListener("resize", layout, options);
  return () => {
    visible = false;
    rest();
    events.abort();
    theme.disconnect();
    size.disconnect();
    visibility.disconnect();
    aurora.dispose();
    horizon.remove();
    glyphs.remove();
  };
}

class BioHomeField extends HTMLElement {
  connectedCallback() {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const network = navigator.connection;
    let release;
    const sync = () => {
      if (motion.matches || network?.saveData) {
        release?.();
        release = undefined;
      } else if (!release) release = animateField(this);
    };
    motion.addEventListener("change", sync);
    network?.addEventListener("change", sync);
    this.dispose = () => {
      release?.();
      motion.removeEventListener("change", sync);
      network?.removeEventListener("change", sync);
    };
    sync();
  }

  disconnectedCallback() { this.dispose?.(); }
}

customElements.define("bio-home-field", BioHomeField);
