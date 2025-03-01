import { Component, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'floating-window',
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.scss'],
})
export class FloatingWindowComponent {
  @Output() closeEvent = new EventEmitter<void>()
  private isDragging = false
  private isResizing = false
  private startX = 0
  private startY = 0
  private startWidth = 300 // Default width
  private startHeight = 200 // Default height

  close(): void {
    this.closeEvent.emit()
  }

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true
    this.startX = event.clientX
    this.startY = event.clientY
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
  }

  onMouseMove(event: MouseEvent): void {
    const windowElement = event.target as HTMLElement
    if (this.isDragging) {
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      const floatingWindow = windowElement.closest('.floating-window') as HTMLElement
      floatingWindow.style.transform = `translate(${dx}px, ${dy}px)`
    }
    if (this.isResizing) {
      const dx = event.clientX - this.startX
      const dy = event.clientY - this.startY
      const floatingWindow = windowElement.closest('.floating-window') as HTMLElement
      floatingWindow.style.width = `${this.startWidth + dx}px`
      floatingWindow.style.height = `${this.startHeight + dy}px`
    }
  }

  onMouseUp(): void {
    this.isDragging = false
    this.isResizing = false
    document.removeEventListener('mousemove', this.onMouseMove.bind(this))
    document.removeEventListener('mouseup', this.onMouseUp.bind(this))
  }

  onResizeMouseDown(event: MouseEvent): void {
    this.isResizing = true
    this.startX = event.clientX
    this.startY = event.clientY
    const windowElement = event.target as HTMLElement
    const floatingWindow = windowElement.closest('.floating-window') as HTMLElement
    this.startWidth = floatingWindow.offsetWidth
    this.startHeight = floatingWindow.offsetHeight
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
  }
}
