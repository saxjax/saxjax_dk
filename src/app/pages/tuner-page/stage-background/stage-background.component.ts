import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core'

@Component({
  selector: 'stage-background',
  templateUrl: './stage-background.component.html',
  styleUrl: './stage-background.component.scss',
})
export class StageBackgroundComponent {
  readonly fogCanvas = viewChild<ElementRef<HTMLCanvasElement>>('fogCanvas')
  private readonly destroyRef = inject(DestroyRef)

  constructor() {
    afterNextRender(() => this.initFog())
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
