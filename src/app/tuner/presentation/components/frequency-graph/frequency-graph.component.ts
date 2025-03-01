import { CommonModule } from '@angular/common'
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core'
import { Pitch } from '../../../../tuner/domain/models'

/**
 * Component for displaying a graph of pitch history over time.
 * Follows Clean Architecture principles as a presentational component.
 */
@Component({
  selector: 'app-frequency-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './frequency-graph.component.html',
  styleUrls: ['./frequency-graph.component.scss'],
})
export class FrequencyGraphComponent implements AfterViewInit, OnChanges {
  @Input() pitchHistory: Pitch[] = []
  @Input() tuningTolerance = 5
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>

  private ctx!: CanvasRenderingContext2D

  /**
   * Initializes the canvas after the view is initialized.
   */
  ngAfterViewInit(): void {
    this.initCanvas()

    // Handle window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas()
      this.drawGraph()
    })
  }

  /**
   * Redraws the graph when the pitch history changes.
   * @param changes The changes object
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pitchHistory'] && this.ctx) {
      this.drawGraph()
    }
  }

  /**
   * Initializes the canvas and context.
   */
  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement
    this.ctx = canvas.getContext('2d')!

    this.resizeCanvas()
    this.drawGraph()
  }

  /**
   * Resizes the canvas to match its container.
   */
  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement
    const container = canvas.parentElement

    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
  }

  /**
   * Draws the frequency graph.
   */
  private drawGraph(): void {
    if (!this.ctx || this.pitchHistory.length === 0) return

    const canvas = this.canvasRef.nativeElement
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height)

    // Draw background
    this.ctx.fillStyle = '#f5f5f5'
    this.ctx.fillRect(0, 0, width, height)

    // Draw the center line (perfect pitch)
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#2ecc71' // Green for in-tune
    this.ctx.lineWidth = 2
    this.ctx.setLineDash([5, 5])
    this.ctx.moveTo(0, height / 2)
    this.ctx.lineTo(width, height / 2)
    this.ctx.stroke()
    this.ctx.setLineDash([])

    // Draw tolerance range
    const toleranceHeight = (this.tuningTolerance / 50) * (height / 2)
    this.ctx.fillStyle = 'rgba(46, 204, 113, 0.1)' // Light green for tolerance range
    this.ctx.fillRect(0, height / 2 - toleranceHeight, width, toleranceHeight * 2)

    // Draw the pitch history
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#3498db' // Blue for the line
    this.ctx.lineWidth = 2

    const maxDeviation = 50 // +/- 50 cents
    const pointSpacing = width / Math.min(100, this.pitchHistory.length)

    this.pitchHistory.forEach((pitch, index) => {
      const x = width - (this.pitchHistory.length - index) * pointSpacing
      // Map deviation to y position (center = in tune, up = sharp, down = flat)
      const y = height / 2 - (pitch.deviation / maxDeviation) * (height / 2)

      if (index === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    })

    this.ctx.stroke()

    // Draw points for each pitch
    this.pitchHistory.forEach((pitch, index) => {
      const x = width - (this.pitchHistory.length - index) * pointSpacing
      const y = height / 2 - (pitch.deviation / maxDeviation) * (height / 2)

      // Determine color based on whether the pitch is in tune
      if (Math.abs(pitch.deviation) <= this.tuningTolerance) {
        this.ctx.fillStyle = '#2ecc71' // Green for in tune
      } else if (pitch.deviation < 0) {
        this.ctx.fillStyle = '#3498db' // Blue for flat
      } else {
        this.ctx.fillStyle = '#e74c3c' // Red for sharp
      }

      this.ctx.beginPath()
      this.ctx.arc(x, y, 4, 0, Math.PI * 2)
      this.ctx.fill()
    })
  }
}
