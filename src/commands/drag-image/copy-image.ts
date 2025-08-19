import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"

export class CopyImage implements CommandInterface {
  readonly uniqueKey: string = "drag-image-copy-image"
  readonly title: string = "command_drag_image_copy_image_title"
  readonly description: string = "command_drag_image_copy_image_description"
  config: { [key: string]: any } = {}
  data: DragData

  window: boolean = true

  async execute(): Promise<void> {
    let blob: Blob | null = null

    if (this.data.file) {
      // Priority use of drag-and-drop files
      blob = this.data.file
    } else if (this.data.content) {
      // If there is no file, try fetch url
      try {
        const resp = await fetch(this.data.content)
        blob = await resp.blob()
      } catch (err) {
        return
      }
    }

    if (!blob) return

    // Check if writing to this MIME is supported
    if (!this.isClipboardMimeSupported(blob.type)) {
      blob = await this.convertToPng(blob)
    }
    const clipboardItem = new ClipboardItem({
      [blob.type]: blob
    })
    await navigator.clipboard.write([clipboardItem])
  }

  // Convert any image blob to PNG blob
  private async convertToPng(blob: Blob): Promise<Blob> {
    const img = document.createElement("img")
    img.src = URL.createObjectURL(blob)
    await img.decode()

    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0)

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((pngBlob) => resolve(pngBlob!), "image/png")
    })
  }

  // Check if the browser supports writing to the specified MIME type
  private isClipboardMimeSupported(mime: string): boolean {
    if (typeof (window as any).ClipboardItem?.supports === "function") {
      try {
        return (window as any).ClipboardItem.supports(mime)
      } catch {
        return false
      }
    }

    return mime === "image/png"
  }
}
