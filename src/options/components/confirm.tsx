import { forwardRef, useImperativeHandle, useRef, useState } from "react"

import { i18n } from "~utils/common"

export interface ConfirmDialogProps {
  cancelText?: string
  confirmText?: string
  title?: string
  content?: string
  onConfirm?: () => void
}

interface ConfirmDialogRef {
  show: (options: ConfirmDialogProps) => void
}

const ConfirmDialog = forwardRef<ConfirmDialogRef>((_props, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [cancelText, setCancelText] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null)

  useImperativeHandle(ref, () => ({
    show: ({ cancelText, confirmText, title, content, onConfirm }) => {
      setCancelText(cancelText || i18n("cancel"))
      setConfirmText(confirmText || i18n("confirm"))
      setTitle(title || i18n("confirm"))
      setContent(content || i18n("confirm_content"))
      setOnConfirm(() => onConfirm || null)
      dialogRef.current?.showModal()
    }
  }))

  const handleConfirm = () => {
    onConfirm?.()
    dialogRef.current?.close()
  }

  return (
    <dialog ref={dialogRef} className="modal" id="confirm">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base">{content}</p>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            <button className="btn">{cancelText}</button>
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
        <button className="cursor-default"></button>
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
