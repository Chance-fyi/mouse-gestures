import { forwardRef, useImperativeHandle, useRef, useState } from "react"

import { i18n } from "~utils/common"

export interface ConfirmDialogProps {
  cancelText?: string
  confirmText?: string
  title?: string
  content?: string
  onConfirm?: () => void
  onCancel?: () => void
  forceConfirm?: boolean
}

interface ConfirmDialogRef {
  show: (options: ConfirmDialogProps) => void
  hide: () => void
}

const ConfirmDialog = forwardRef<ConfirmDialogRef>((_props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [cancelText, setCancelText] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null)
  const [onCancel, setOnCancel] = useState<(() => void) | null>(null)
  const [forceConfirm, setForceConfirm] = useState(false)

  useImperativeHandle(ref, () => ({
    show: ({
      cancelText,
      confirmText,
      title,
      content,
      onConfirm,
      onCancel,
      forceConfirm
    }) => {
      setCancelText(cancelText || i18n("cancel"))
      setConfirmText(confirmText || i18n("confirm"))
      setTitle(title || i18n("confirm"))
      setContent(content || i18n("confirm_content"))
      setOnConfirm(() => onConfirm || null)
      setOnCancel(() => onCancel || null)
      setForceConfirm(!!forceConfirm)
      dialogRef.current?.showModal()
    },
    hide: handleCancel
  }))

  const close = () => {
    dialogRef.current?.close()
  }

  const handleConfirm = () => {
    onConfirm?.()
    close()
  }

  const handleCancel = () => {
    if (forceConfirm) {
      requestAnimationFrame(() => {
        dialogRef.current?.showModal()
      })
      return
    }
    onCancel?.()
    close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      id="confirm"
      onCancel={(e) => {
        e.preventDefault()
        handleCancel()
      }}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base whitespace-pre-line">{content}</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {!forceConfirm && (
              <button className="btn" onClick={handleCancel}>
                {cancelText}
              </button>
            )}
            <button
              type="button"
              className="btn btn-neutral"
              onClick={handleConfirm}>
              {confirmText}
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        {!forceConfirm && (
          <button className="cursor-default" onClick={handleCancel}></button>
        )}
      </form>
    </dialog>
  )
})

export const useConfirm = () => {
  const ref = useRef<ConfirmDialogRef>(null)

  const ConfirmUI = <ConfirmDialog ref={ref} />
  const showConfirm = (options: ConfirmDialogProps) => {
    ref.current?.show(options)
  }

  return {
    ConfirmUI,
    showConfirm
  }
}
