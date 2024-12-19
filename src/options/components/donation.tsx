import Alipay from "data-base64:assets/Alipay.jpg"
import WeChatPay from "data-base64:assets/WeChatPay.png"
import { useState } from "react"

import { i18n } from "~utils/common"

export default () => {
  const [qrCode, setQrCode] = useState("")
  return (
    <>
      <dialog id="donation" className="modal">
        <div className="modal-box">
          <p className="pb-4 text-base">{i18n("donation")}</p>
          <div className="flex flex-row space-x-2 justify-center">
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setQrCode(Alipay)
                ;(
                  document.getElementById("qrcode") as HTMLDialogElement
                ).showModal()
              }}>
              <svg
                d="1734598298827"
                className="icon w-8 h-8"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1024.0512 701.0304V196.864A196.9664 196.9664 0 0 0 827.136 0H196.864A196.9664 196.9664 0 0 0 0 196.864v630.272A196.9152 196.9152 0 0 0 196.864 1024h630.272a197.12 197.12 0 0 0 193.8432-162.0992c-52.224-22.6304-278.528-120.32-396.4416-176.64-89.7024 108.6976-183.7056 173.9264-325.3248 173.9264s-236.1856-87.2448-224.8192-194.048c7.4752-70.0416 55.552-184.576 264.2944-164.9664 110.08 10.3424 160.4096 30.8736 250.1632 60.5184 23.1936-42.5984 42.496-89.4464 57.1392-139.264H248.064v-39.424h196.9152V311.1424H204.8V267.776h240.128V165.632s2.1504-15.9744 19.8144-15.9744h98.4576V267.776h256v43.4176h-256V381.952h208.8448a805.9904 805.9904 0 0 1-84.8384 212.6848c60.672 22.016 336.7936 106.3936 336.7936 106.3936zM283.5456 791.6032c-149.6576 0-173.312-94.464-165.376-133.9392 7.8336-39.3216 51.2-90.624 134.4-90.624 95.5904 0 181.248 24.4736 284.0576 74.5472-72.192 94.0032-160.9216 150.016-253.0816 150.016z"
                  fill="#009FE8"></path>
              </svg>
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setQrCode(WeChatPay)
                ;(
                  document.getElementById("qrcode") as HTMLDialogElement
                ).showModal()
              }}>
              <svg
                d="1734598483330"
                className="icon w-8 h-8"
                viewBox="0 0 1076 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M410.493712 644.226288c-64.448471 36.97706-74.006881-20.759958-74.006881-20.759958l-80.772173-193.983933c-31.078562-92.178305 26.897497-41.56191 26.897498-41.561909s49.746372 38.732181 87.50193 62.333712c37.732946 23.602608 80.745253 6.927882 80.745254 6.927882l528.043743-250.842313C881.479874 81.578667 720.547129 0 538.352656 0 241.013636 0 0 217.098768 0 484.919453c0 154.046856 79.806318 291.154103 204.11518 380.019214L181.698086 997.56551s-10.92805 38.720336 26.945952 20.759958c25.808892-12.243853 91.603314-56.122953 130.768353-82.82771 61.570288 22.083298 128.651441 34.345455 198.970414 34.345455 297.315331 0 538.378498-217.098768 538.378499-484.924837 0-77.573115-20.313102-150.8338-56.295235-215.861568-168.236416 104.176656-559.545472 346.282128-609.973434 375.167327z"
                  fill="#1EBE1F"></path>
              </svg>
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() =>
                chrome.tabs
                  .create({
                    url: "https://ko-fi.com/Y8Y8Z6ZRT"
                  })
                  .then()
              }>
              <img
                className="h-8"
                src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog id="qrcode" className="modal">
        <div className="modal-box w-1/5 max-w-xl">
          <img className="w-full" src={qrCode} alt="" />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
