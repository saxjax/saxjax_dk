import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core'

@Component({
  selector: 'stage-background',
  templateUrl: './stage-background.component.html',
  styleUrl: './stage-background.component.scss',
})
export class StageBackgroundComponent {
  readonly fogCanvas = viewChild<ElementRef<HTMLCanvasElement>>('fogCanvas')
  readonly lightRigRef = viewChild<ElementRef<HTMLDivElement>>('lightRig')
  private readonly destroyRef = inject(DestroyRef)

  /** Per-beam state shared between light rig and fog systems.
   *  Each entry: { x: 0-1 normalized, angle: degrees, angularVel: deg/frame } */
  private beamStates: { x: number; angle: number; angularVel: number }[] = []

  constructor() {
    afterNextRender(() => {
      this.initFog()
      this.initLightRig()
    })
  }

  /**
   * 6-beam lighting rig arranged in a 3D half-circle arc.
   * Outer beams are closer to the viewer (higher translateZ → larger via perspective).
   * All beams sway gently at idle. On scroll they spread outward;
   * when scroll stops they slowly converge back onto the content.
   */
  private initLightRig(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rig = this.lightRigRef()?.nativeElement
    if (!rig) return
    const beams = Array.from(rig.querySelectorAll<HTMLSpanElement>('.stage-bg__rig-beam'))
    if (beams.length !== 6) return

    // Per-beam config: [zOffset, focusedAngle, spreadDelta, swayAmp, swaySpeed, swayPhase, baseOpacity]
    // Outer beams: more Z (closer), angled inward, spread away further, bigger sway
    const configs = [
      { z: 55, focus: 16, spread: -18, swayAmp: 2.8, swaySpd: 0.0007, phase: 0, op: 0.72 },
      { z: 22, focus: 9, spread: -10, swayAmp: 2.0, swaySpd: 0.0009, phase: 1.2, op: 0.6 },
      { z: 0, focus: 3, spread: -4, swayAmp: 1.4, swaySpd: 0.0011, phase: 2.5, op: 0.52 },
      { z: 0, focus: -3, spread: 4, swayAmp: 1.4, swaySpd: 0.001, phase: 3.8, op: 0.52 },
      { z: 22, focus: -9, spread: 10, swayAmp: 2.0, swaySpd: 0.0008, phase: 5.1, op: 0.6 },
      { z: 55, focus: -16, spread: 18, swayAmp: 2.8, swaySpd: 0.0006, phase: 0.7, op: 0.72 },
    ]

    // Beam center positions as fraction of viewport (left% + half 26vw width)
    const beamCentersVw = [-2 + 13, 14 + 13, 32 + 13, 52 + 13, 68 + 13, 84 + 13] // in vw
    const beamCentersNorm = beamCentersVw.map((vw) => vw / 100) // 0-1 normalized

    // Initialize shared beam states
    this.beamStates = configs.map((c, i) => ({
      x: beamCentersNorm[i],
      angle: c.focus,
      angularVel: 0,
    }))

    let targetSpread = 0
    let currentSpread = 0
    let scrollTimer = 0
    let rafId = 0
    const SPREAD_IN_SPEED = 0.03 // slow return to focused
    const SPREAD_OUT_SPEED = 0.08 // quick spread on scroll
    const SCROLL_SETTLE_MS = 800 // ms after last scroll to start returning

    const onScroll = () => {
      targetSpread = 1
      clearTimeout(scrollTimer)
      scrollTimer = window.setTimeout(() => {
        targetSpread = 0
      }, SCROLL_SETTLE_MS)
    }

    const animate = (time: number) => {
      // Lerp spread toward target (asymmetric speed)
      const speed = targetSpread > currentSpread ? SPREAD_OUT_SPEED : SPREAD_IN_SPEED
      const ds = targetSpread - currentSpread
      if (Math.abs(ds) > 0.001) {
        currentSpread += ds * speed
      }

      for (let i = 0; i < 6; i++) {
        const c = configs[i]
        const sway = Math.sin(time * c.swaySpd + c.phase) * c.swayAmp
        const angle = c.focus + currentSpread * c.spread + sway
        const opacity = c.op - currentSpread * 0.15 // dim slightly when spread
        beams[i].style.transform = `translateZ(${c.z}px) rotate(${angle.toFixed(2)}deg)`
        beams[i].style.opacity = Math.max(0.25, opacity).toFixed(3)

        // Share beam state with fog system
        const prevAngle = this.beamStates[i].angle
        this.beamStates[i].angle = angle
        this.beamStates[i].angularVel = angle - prevAngle
      }

      rafId = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    const tunerPage = document.querySelector('.tuner-page')
    tunerPage?.addEventListener('scroll', onScroll, { passive: true })

    rafId = requestAnimationFrame(animate)

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(rafId)
      clearTimeout(scrollTimer)
      window.removeEventListener('scroll', onScroll)
      tunerPage?.removeEventListener('scroll', onScroll)
    })
  }
  private initFog(): void {
    const el = this.fogCanvas()
    if (!el) return
    const cvs = el.nativeElement
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ── Original Navier-Stokes fluid simulation ─────────────────
    // Implements incompressible fluid dynamics from first principles:
    //   advection → vorticity confinement → pressure projection → display
    // Math is standard CFD (Stam 1999 stable-fluids approach).

    const SIM = {
      downsample: 1,
      densityFade: 0.985,
      velocityFade: 0.98,
      pressureFade: 0.8,
      jacobiSteps: 20,
      vorticityAmt: 30,
      splatSize: 0.007,
    }

    cvs.width = cvs.clientWidth
    cvs.height = cvs.clientHeight

    // ── WebGL context ─────────────────────────────────────────
    const ctxAttr: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
    }
    let g = cvs.getContext('webgl2', ctxAttr) as WebGL2RenderingContext | WebGLRenderingContext | null
    const v2 = !!g
    if (!g)
      g = (cvs.getContext('webgl', ctxAttr) ||
        cvs.getContext('experimental-webgl', ctxAttr)) as WebGLRenderingContext | null
    if (!g) return

    // Extensions for half-float render targets
    let linearFilter: unknown
    if (v2) {
      ;(g as WebGL2RenderingContext).getExtension('EXT_color_buffer_float')
      linearFilter = g.getExtension('OES_texture_float_linear')
    } else {
      g.getExtension('OES_texture_half_float')
      linearFilter = g.getExtension('OES_texture_half_float_linear')
    }
    g.clearColor(0, 0, 0, 0)

    const hfExt = g.getExtension('OES_texture_half_float')
    const g2 = g as WebGL2RenderingContext
    const RGBA_F = v2 ? g2.RGBA16F : g.RGBA
    const RG_F = v2 ? g2.RG16F : g.RGBA
    const RG_CH = v2 ? g2.RG : g.RGBA
    const HALF = v2 ? g2.HALF_FLOAT : hfExt ? hfExt.HALF_FLOAT_OES : g.UNSIGNED_BYTE
    const FILT = linearFilter ? g.LINEAR : g.NEAREST

    // ── Shader helpers ────────────────────────────────────────
    const mkShader = (kind: number, code: string) => {
      const sh = g!.createShader(kind)!
      g!.shaderSource(sh, code)
      g!.compileShader(sh)
      return sh
    }

    const mkProg = (vSh: WebGLShader, fSh: WebGLShader) => {
      const pg = g!.createProgram()!
      g!.attachShader(pg, vSh)
      g!.attachShader(pg, fSh)
      g!.linkProgram(pg)
      const u: Record<string, WebGLUniformLocation | null> = {}
      const n = g!.getProgramParameter(pg, g!.ACTIVE_UNIFORMS) as number
      for (let i = 0; i < n; i++) {
        const nm = g!.getActiveUniform(pg, i)!.name
        u[nm] = g!.getUniformLocation(pg, nm)
      }
      return {
        pg,
        u,
        use() {
          g!.useProgram(pg)
        },
      }
    }

    // ── Shaders (written from scratch) ────────────────────────
    // Shared vertex shader: full-screen quad with neighbor UVs for stencil ops
    const vtx = mkShader(
      g.VERTEX_SHADER,
      `
      precision highp float;
      attribute vec2 pos;
      uniform vec2 px;
      varying vec2 uv, uL, uR, uU, uD;
      void main() {
        uv = pos * 0.5 + 0.5;
        uL = uv - vec2(px.x, 0.0);
        uR = uv + vec2(px.x, 0.0);
        uU = uv + vec2(0.0, px.y);
        uD = uv - vec2(0.0, px.y);
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `
    )

    // Fade: multiply existing field by scalar (used for pressure decay)
    const fadeFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D field;
      uniform float scale;
      void main() { gl_FragColor = scale * texture2D(field, uv); }
    `
    )

    // Passthrough: render a texture directly to screen
    const showFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D field;
      void main() { gl_FragColor = texture2D(field, uv); }
    `
    )

    // Inject: add a Gaussian blob of color/velocity at a point
    const injectFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D target;
      uniform float aspect;
      uniform vec2 center;
      uniform vec3 amount;
      uniform float size;
      void main() {
        vec2 d = uv - center;
        d.x *= aspect;
        vec3 blob = exp(-dot(d, d) / size) * amount;
        gl_FragColor = vec4(texture2D(target, uv).rgb + blob, 1.0);
      }
    `
    )

    // Advection: semi-Lagrangian back-trace through velocity field
    const advFrag = mkShader(
      g.FRAGMENT_SHADER,
      linearFilter
        ? `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D vel;
      uniform sampler2D qty;
      uniform vec2 px;
      uniform float dt;
      uniform float fade;
      void main() {
        vec2 origin = uv - dt * texture2D(vel, uv).xy * px;
        gl_FragColor = fade * texture2D(qty, origin);
      }
    `
        : `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D vel;
      uniform sampler2D qty;
      uniform vec2 px;
      uniform float dt;
      uniform float fade;
      vec4 sample4(sampler2D s, vec2 p) {
        vec4 c;
        c.xy = floor(p - 0.5) + 0.5;
        c.zw = c.xy + 1.0;
        vec4 tc = c * px.xyxy;
        vec4 a = texture2D(s, tc.xy);
        vec4 b = texture2D(s, tc.zy);
        vec4 cc = texture2D(s, tc.xw);
        vec4 dd = texture2D(s, tc.zw);
        vec2 f = p - c.xy;
        return mix(mix(a, b, f.x), mix(cc, dd, f.x), f.y);
      }
      void main() {
        vec2 origin = gl_FragCoord.xy - dt * texture2D(vel, uv).xy;
        gl_FragColor = fade * sample4(qty, origin);
        gl_FragColor.a = 1.0;
      }
    `
    )

    // Curl magnitude: ∂vy/∂x - ∂vx/∂y (scalar vorticity in 2D)
    const curlFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv, uL, uR, uU, uD;
      uniform sampler2D vel;
      void main() {
        float vR = texture2D(vel, uR).y;
        float vL = texture2D(vel, uL).y;
        float vU = texture2D(vel, uU).x;
        float vD = texture2D(vel, uD).x;
        gl_FragColor = vec4(vR - vL - vU + vD, 0.0, 0.0, 1.0);
      }
    `
    )

    // Vorticity confinement: re-inject rotational energy lost to numerics
    const vortFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv, uL, uR, uU, uD;
      uniform sampler2D vel;
      uniform sampler2D omega;
      uniform float strength;
      uniform float dt;
      void main() {
        float cL = texture2D(omega, uL).x;
        float cR = texture2D(omega, uR).x;
        float cU = texture2D(omega, uU).x;
        float cD = texture2D(omega, uD).x;
        float cC = texture2D(omega, uv).x;
        vec2 eta = vec2(abs(cU) - abs(cD), abs(cR) - abs(cL));
        eta *= 1.0 / (length(eta) + 1e-5) * strength * cC;
        gl_FragColor = vec4(texture2D(vel, uv).xy + eta * dt, 0.0, 1.0);
      }
    `
    )

    // Divergence: ∇·v = ∂vx/∂x + ∂vy/∂y (with boundary reflection)
    const divFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv, uL, uR, uU, uD;
      uniform sampler2D vel;
      vec2 clampVel(vec2 coord) {
        vec2 m = vec2(1.0);
        if (coord.x < 0.0) { coord.x = 0.0; m.x = -1.0; }
        if (coord.x > 1.0) { coord.x = 1.0; m.x = -1.0; }
        if (coord.y < 0.0) { coord.y = 0.0; m.y = -1.0; }
        if (coord.y > 1.0) { coord.y = 1.0; m.y = -1.0; }
        return m * texture2D(vel, coord).xy;
      }
      void main() {
        float hL = clampVel(uL).x;
        float hR = clampVel(uR).x;
        float hU = clampVel(uU).y;
        float hD = clampVel(uD).y;
        gl_FragColor = vec4(0.5 * (hR - hL + hU - hD), 0.0, 0.0, 1.0);
      }
    `
    )

    // Jacobi iteration: solve Poisson equation  ∇²p = div(v)
    const jacobiFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv, uL, uR, uU, uD;
      uniform sampler2D pField;
      uniform sampler2D divField;
      vec2 clp(vec2 c) { return clamp(c, 0.0, 1.0); }
      void main() {
        float pL = texture2D(pField, clp(uL)).x;
        float pR = texture2D(pField, clp(uR)).x;
        float pU = texture2D(pField, clp(uU)).x;
        float pD = texture2D(pField, clp(uD)).x;
        float d  = texture2D(divField, uv).x;
        gl_FragColor = vec4((pL + pR + pU + pD - d) * 0.25, 0.0, 0.0, 1.0);
      }
    `
    )

    // Gradient subtract: make velocity divergence-free  v' = v - ∇p
    const gradSubFrag = mkShader(
      g.FRAGMENT_SHADER,
      `
      precision highp float;
      varying vec2 uv, uL, uR, uU, uD;
      uniform sampler2D pField;
      uniform sampler2D vel;
      vec2 clp(vec2 c) { return clamp(c, 0.0, 1.0); }
      void main() {
        float pL = texture2D(pField, clp(uL)).x;
        float pR = texture2D(pField, clp(uR)).x;
        float pU = texture2D(pField, clp(uU)).x;
        float pD = texture2D(pField, clp(uD)).x;
        vec2 v = texture2D(vel, uv).xy - vec2(pR - pL, pU - pD);
        gl_FragColor = vec4(v, 0.0, 1.0);
      }
    `
    )

    // Link shaders into programs
    const fadeP = mkProg(vtx, fadeFrag)
    const showP = mkProg(vtx, showFrag)
    const injectP = mkProg(vtx, injectFrag)
    const advP = mkProg(vtx, advFrag)
    const curlP = mkProg(vtx, curlFrag)
    const vortP = mkProg(vtx, vortFrag)
    const divP = mkProg(vtx, divFrag)
    const jacobiP = mkProg(vtx, jacobiFrag)
    const gradSubP = mkProg(vtx, gradSubFrag)

    // ── Framebuffer objects ───────────────────────────────────
    interface Buf {
      tex: WebGLTexture
      fbo: WebGLFramebuffer
      slot: number
    }
    interface PingPong {
      a: Buf
      b: Buf
      flip(): void
    }

    let simW = 0,
      simH = 0
    let densPP: PingPong, velPP: PingPong, pressPP: PingPong
    let divBuf: Buf, curlBuf: Buf

    const allocBuf = (slot: number, w: number, h: number, iFmt: number, fmt: number, tp: number, flt: number): Buf => {
      g!.activeTexture(g!.TEXTURE0 + slot)
      const tex = g!.createTexture()!
      g!.bindTexture(g!.TEXTURE_2D, tex)
      g!.texParameteri(g!.TEXTURE_2D, g!.TEXTURE_MIN_FILTER, flt)
      g!.texParameteri(g!.TEXTURE_2D, g!.TEXTURE_MAG_FILTER, flt)
      g!.texParameteri(g!.TEXTURE_2D, g!.TEXTURE_WRAP_S, g!.CLAMP_TO_EDGE)
      g!.texParameteri(g!.TEXTURE_2D, g!.TEXTURE_WRAP_T, g!.CLAMP_TO_EDGE)
      g!.texImage2D(g!.TEXTURE_2D, 0, iFmt, w, h, 0, fmt, tp, null)
      const fbo = g!.createFramebuffer()!
      g!.bindFramebuffer(g!.FRAMEBUFFER, fbo)
      g!.framebufferTexture2D(g!.FRAMEBUFFER, g!.COLOR_ATTACHMENT0, g!.TEXTURE_2D, tex, 0)
      g!.viewport(0, 0, w, h)
      g!.clear(g!.COLOR_BUFFER_BIT)
      return { tex, fbo, slot }
    }

    const allocPP = (s: number, w: number, h: number, iFmt: number, fmt: number, tp: number, flt: number): PingPong => {
      let a = allocBuf(s, w, h, iFmt, fmt, tp, flt)
      let b = allocBuf(s + 1, w, h, iFmt, fmt, tp, flt)
      return {
        get a() {
          return a
        },
        get b() {
          return b
        },
        flip() {
          const t = a
          a = b
          b = t
        },
      }
    }

    const buildBuffers = () => {
      simW = g!.drawingBufferWidth >> SIM.downsample
      simH = g!.drawingBufferHeight >> SIM.downsample
      densPP = allocPP(0, simW, simH, RGBA_F, g!.RGBA, HALF, FILT)
      velPP = allocPP(2, simW, simH, RG_F, RG_CH, HALF, FILT)
      divBuf = allocBuf(4, simW, simH, RG_F, RG_CH, HALF, g!.NEAREST)
      curlBuf = allocBuf(5, simW, simH, RG_F, RG_CH, HALF, g!.NEAREST)
      pressPP = allocPP(6, simW, simH, RG_F, RG_CH, HALF, g!.NEAREST)
    }
    buildBuffers()

    // ── Full-screen quad geometry ─────────────────────────────
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer())
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW)
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer())
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW)
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0)
    g.enableVertexAttribArray(0)

    const draw = (dest: WebGLFramebuffer | null) => {
      g!.bindFramebuffer(g!.FRAMEBUFFER, dest)
      g!.drawElements(g!.TRIANGLES, 6, g!.UNSIGNED_SHORT, 0)
    }

    // ── Inject a splat of color + velocity into the sim ───────
    const inject = (x: number, y: number, vx: number, vy: number, rgb: number[]) => {
      injectP.use()
      g!.uniform1i(injectP.u['target'], velPP.a.slot)
      g!.uniform1f(injectP.u['aspect'], cvs.width / cvs.height)
      g!.uniform2f(injectP.u['center'], x / cvs.width, 1 - y / cvs.height)
      g!.uniform3f(injectP.u['amount'], vx, -vy, 1)
      g!.uniform1f(injectP.u['size'], SIM.splatSize)
      draw(velPP.b.fbo)
      velPP.flip()

      g!.uniform1i(injectP.u['target'], densPP.a.slot)
      g!.uniform3f(injectP.u['amount'], rgb[0] * 0.3, rgb[1] * 0.3, rgb[2] * 0.3)
      draw(densPP.b.fbo)
      densPP.flip()
    }

    // ── Pointer interaction ───────────────────────────────────
    let ptrX = 0,
      ptrY = 0,
      ptrVx = 0,
      ptrVy = 0,
      ptrActive = false
    let ptrMoves = 0
    let ptrRgb = [0.1, 0.9, 0.6]

    const onMouse = (e: MouseEvent) => {
      ptrMoves++
      if (ptrMoves > 25) {
        ptrRgb = pickColor().map((c) => c * 2.5)
        ptrMoves = 0
      }
      ptrVx = (e.offsetX - ptrX) * 10
      ptrVy = (e.offsetY - ptrY) * 10
      ptrX = e.offsetX
      ptrY = e.offsetY
      ptrActive = true
    }

    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      const r = cvs.getBoundingClientRect()
      const x = t.pageX - r.left
      const y = t.pageY - r.top
      ptrVx = (x - ptrX) * 10
      ptrVy = (y - ptrY) * 10
      ptrX = x
      ptrY = y
      ptrActive = true
    }

    cvs.addEventListener('mousemove', onMouse)
    cvs.addEventListener('touchmove', onTouch, { passive: true })

    // ── Color palette ─────────────────────────────────────────
    const palette = [
      () => [0.05 + Math.random() * 0.08, 0.6 + Math.random() * 0.4, 0.3 + Math.random() * 0.3], // green
      () => [0.1 + Math.random() * 0.1, 0.4 + Math.random() * 0.35, 0.55 + Math.random() * 0.4], // teal
      () => [0.3 + Math.random() * 0.25, 0.1 + Math.random() * 0.15, 0.55 + Math.random() * 0.4], // purple
      () => [0.55 + Math.random() * 0.35, 0.3 + Math.random() * 0.25, 0.05 + Math.random() * 0.08], // amber
      () => [0.15 + Math.random() * 0.15, 0.3 + Math.random() * 0.3, 0.6 + Math.random() * 0.35], // blue
      () => [0.05 + Math.random() * 0.08, 0.6 + Math.random() * 0.35, 0.45 + Math.random() * 0.3], // mint
    ]
    let palIdx = 0
    const pickColor = () => {
      palIdx = (palIdx + 1) % palette.length
      return palette[palIdx]()
    }

    // ── Smoke bar — bottom-edge continuous emitter ────────────
    const BAR_SLOTS = 12
    let barSlot = 0

    const emitSmoke = () => {
      const i = barSlot
      barSlot = (barSlot + 1) % BAR_SLOTS
      const gap = cvs.width / (BAR_SLOTS + 1)
      const bx = gap * (i + 1)
      const x = bx + (Math.random() - 0.5) * gap * 0.4
      const y = cvs.height * 0.96 + (Math.random() - 0.5) * cvs.height * 0.02
      inject(x, y, (Math.random() - 0.5) * 40, -(40 + Math.random() * 70), pickColor())
    }

    // ── Content deflection — bounce smoke off section edges ───
    const sectionEls = Array.from(
      document.querySelectorAll(
        '.hero, .stats-bar, .value, .showcase, .exercises, .algorithms, .features, .about, .cta'
      )
    )
    let deflIdx = 0
    const EDGE_PTS = 3

    const deflect = () => {
      if (!sectionEls.length) return
      const sec = sectionEls[deflIdx % sectionEls.length]
      deflIdx++
      const r = sec.getBoundingClientRect()
      if (r.bottom < 0 || r.top > cvs.height) return

      for (let p = 0; p < EDGE_PTS; p++) {
        const xr = r.left + Math.random() * r.width
        const side = Math.random() > 0.5
        if (side && r.top > 0 && r.top < cvs.height) {
          const px = (xr < cvs.width * 0.5 ? -1 : 1) * (15 + Math.random() * 25)
          inject(xr, r.top, px, -(10 + Math.random() * 20), pickColor())
        } else if (r.bottom > 0 && r.bottom < cvs.height) {
          const px = (xr < cvs.width * 0.5 ? -1 : 1) * (15 + Math.random() * 25)
          inject(xr, r.bottom, px, 10 + Math.random() * 20, pickColor())
        }
      }
      const ym = r.top + Math.random() * r.height
      if (ym > 0 && ym < cvs.height) {
        if (r.left > 10) inject(r.left, ym, -(20 + Math.random() * 15), (Math.random() - 0.5) * 20, pickColor())
        if (r.right < cvs.width - 10)
          inject(r.right, ym, 20 + Math.random() * 15, (Math.random() - 0.5) * 20, pickColor())
      }
    }

    // ── Canvas resize ─────────────────────────────────────────
    const onResize = () => {
      if (cvs.width !== cvs.clientWidth || cvs.height !== cvs.clientHeight) {
        cvs.width = cvs.clientWidth
        cvs.height = cvs.clientHeight
        buildBuffers()
      }
    }

    // ── Simulation loop ───────────────────────────────────────
    let prev = Date.now()
    let frame = 0
    let tick = 0

    const step = () => {
      onResize()
      const now = Date.now()
      const dt = Math.min((now - prev) / 1000, 0.016)
      prev = now
      tick++

      // Emit smoke every 10th frame (~6 puffs/sec) — slow, gentle wisps
      if (tick % 60 === 0) emitSmoke()
      if (tick % 134 === 0) deflect()

      const tw = simW,
        th = simH
      const px = [1 / tw, 1 / th] as const
      g!.viewport(0, 0, tw, th)

      // 1. Advect velocity through itself
      advP.use()
      g!.uniform2f(advP.u['px'], px[0], px[1])
      g!.uniform1i(advP.u['vel'], velPP.a.slot)
      g!.uniform1i(advP.u['qty'], velPP.a.slot)
      g!.uniform1f(advP.u['dt'], dt)
      g!.uniform1f(advP.u['fade'], SIM.velocityFade)
      draw(velPP.b.fbo)
      velPP.flip()

      // 2. Advect dye/density through velocity
      g!.uniform1i(advP.u['vel'], velPP.a.slot)
      g!.uniform1i(advP.u['qty'], densPP.a.slot)
      g!.uniform1f(advP.u['fade'], SIM.densityFade)
      draw(densPP.b.fbo)
      densPP.flip()

      // 3. Pointer injection
      if (ptrActive) {
        inject(ptrX, ptrY, ptrVx, ptrVy, ptrRgb)
        ptrActive = false
      }

      // 4. Compute curl (vorticity magnitude)
      curlP.use()
      g!.uniform2f(curlP.u['px'], px[0], px[1])
      g!.uniform1i(curlP.u['vel'], velPP.a.slot)
      draw(curlBuf.fbo)

      // 5. Vorticity confinement — re-inject curl energy
      vortP.use()
      g!.uniform2f(vortP.u['px'], px[0], px[1])
      g!.uniform1i(vortP.u['vel'], velPP.a.slot)
      g!.uniform1i(vortP.u['omega'], curlBuf.slot)
      g!.uniform1f(vortP.u['strength'], SIM.vorticityAmt)
      g!.uniform1f(vortP.u['dt'], dt)
      draw(velPP.b.fbo)
      velPP.flip()

      // 6. Compute divergence ∇·v
      divP.use()
      g!.uniform2f(divP.u['px'], px[0], px[1])
      g!.uniform1i(divP.u['vel'], velPP.a.slot)
      draw(divBuf.fbo)

      // 7. Decay pressure field
      fadeP.use()
      g!.activeTexture(g!.TEXTURE0 + pressPP.a.slot)
      g!.bindTexture(g!.TEXTURE_2D, pressPP.a.tex)
      g!.uniform1i(fadeP.u['field'], pressPP.a.slot)
      g!.uniform1f(fadeP.u['scale'], SIM.pressureFade)
      draw(pressPP.b.fbo)
      pressPP.flip()

      // 8. Jacobi pressure solve (iterative)
      jacobiP.use()
      g!.uniform2f(jacobiP.u['px'], px[0], px[1])
      g!.uniform1i(jacobiP.u['divField'], divBuf.slot)
      const pSlot = pressPP.a.slot
      g!.activeTexture(g!.TEXTURE0 + pSlot)
      for (let i = 0; i < SIM.jacobiSteps; i++) {
        g!.bindTexture(g!.TEXTURE_2D, pressPP.a.tex)
        g!.uniform1i(jacobiP.u['pField'], pSlot)
        draw(pressPP.b.fbo)
        pressPP.flip()
      }

      // 9. Gradient subtract — project velocity to divergence-free
      gradSubP.use()
      g!.uniform2f(gradSubP.u['px'], px[0], px[1])
      g!.uniform1i(gradSubP.u['pField'], pressPP.a.slot)
      g!.uniform1i(gradSubP.u['vel'], velPP.a.slot)
      draw(velPP.b.fbo)
      velPP.flip()

      // 10. Display density to screen
      g!.viewport(0, 0, g!.drawingBufferWidth, g!.drawingBufferHeight)
      showP.use()
      g!.uniform1i(showP.u['field'], densPP.a.slot)
      draw(null)

      frame = requestAnimationFrame(step)
    }

    // Seed initial smoke
    for (let i = 0; i < BAR_SLOTS; i++) emitSmoke()
    frame = requestAnimationFrame(step)

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(frame)
      cvs.removeEventListener('mousemove', onMouse)
      cvs.removeEventListener('touchmove', onTouch)
    })
  }
}
