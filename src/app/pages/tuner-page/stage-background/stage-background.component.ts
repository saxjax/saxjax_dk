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
      { z: 22, focus: 9, spread: -10, swayAmp: 2.0, swaySpd: 0.0009, phase: 1.2, op: 0.60 },
      { z: 0, focus: 3, spread: -4, swayAmp: 1.4, swaySpd: 0.0011, phase: 2.5, op: 0.52 },
      { z: 0, focus: -3, spread: 4, swayAmp: 1.4, swaySpd: 0.0010, phase: 3.8, op: 0.52 },
      { z: 22, focus: -9, spread: 10, swayAmp: 2.0, swaySpd: 0.0008, phase: 5.1, op: 0.60 },
      { z: 55, focus: -16, spread: 18, swayAmp: 2.8, swaySpd: 0.0006, phase: 0.7, op: 0.72 },
    ]

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
    const canvas = el.nativeElement
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animId = 0
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Simplex-inspired 2D value noise (lightweight, no deps)
    const perm = new Uint8Array(512)
    for (let i = 0; i < 256; i++) perm[i] = i
    for (let i = 255; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0
      const t = perm[i]
      perm[i] = perm[j]
      perm[j] = t
    }
    for (let i = 256; i < 512; i++) perm[i] = perm[i - 256]

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const lerp = (a: number, b: number, t: number) => a + t * (b - a)
    const grad = (hash: number, x: number, y: number) => {
      const h2 = hash & 3
      return (h2 & 1 ? -x : x) + (h2 & 2 ? -y : y)
    }

    const noise = (x: number, y: number) => {
      const xi = x | 0
      const yi = y | 0
      const xf = x - xi
      const yf = y - yi
      const u = fade(xf)
      const v = fade(yf)
      const a = perm[(xi & 255) + perm[yi & 255]]
      const b = perm[((xi + 1) & 255) + perm[yi & 255]]
      const c = perm[(xi & 255) + perm[(yi + 1) & 255]]
      const d = perm[((xi + 1) & 255) + perm[(yi + 1) & 255]]
      return lerp(
        lerp(grad(a, xf, yf), grad(b, xf - 1, yf), u),
        lerp(grad(c, xf, yf - 1), grad(d, xf - 1, yf - 1), u),
        v
      )
    }

    // Fractal brownian motion
    const fbm = (x: number, y: number, octaves: number) => {
      let val = 0
      let amp = 0.5
      let freq = 1
      for (let i = 0; i < octaves; i++) {
        val += amp * noise(x * freq, y * freq)
        amp *= 0.5
        freq *= 2.0
      }
      return val
    }

    // Render at half resolution for performance
    const scale = 2
    const cols = Math.ceil(w / (8 * scale))
    const rows = Math.ceil(h / (8 * scale))

    const draw = (time: number) => {
      const t = time * 0.0001
      ctx.clearRect(0, 0, w, h)

      const cellW = w / cols
      const cellH = h / rows

      for (let iy = 0; iy < rows; iy++) {
        for (let ix = 0; ix < cols; ix++) {
          const nx = (ix / cols) * 3 + t * 0.4
          const ny = (iy / rows) * 2 + t * 0.15
          const v = fbm(nx, ny, 3) * 0.5 + 0.5 // 0-1

          // Very subtle: max alpha ~0.045
          const alpha = v * v * 0.045
          if (alpha < 0.003) continue

          ctx.fillStyle = `rgba(200,220,210,${alpha})`
          ctx.fillRect(ix * cellW, iy * cellH, cellW + 1, cellH + 1)
        }
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    })
  }
}
