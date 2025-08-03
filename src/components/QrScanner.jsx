import { useEffect, useRef, useState } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function QrScanner({
  onScan,
  label = 'Scan',
  qrbox = 240,
  fps = 10,
  aspectRatio = 1.0,
  disableFlip = false,
}) {
  const [open, setOpen] = useState(false)
  const regionIdRef = useRef(`html5qr-${Math.random().toString(36).slice(2)}`)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const config = {
      fps,
      qrbox,
      aspectRatio,
      disableFlip,
      rememberLastUsedCamera: true,
    }

    scannerRef.current = new Html5QrcodeScanner(regionIdRef.current, config, /* verbose */ false)

    scannerRef.current.render(
      (decodedText /*, decodedResult */) => {
        onScan(decodedText.trim())
        // Close after a successful scan
        setOpen(false)
      },
      /* onScanError: ignore per-frame decode errors */
      () => {}
    )

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [open, fps, qrbox, aspectRatio, disableFlip, onScan])

  return (
    <div className="qr">
      {!open ? (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setOpen(true)}
        >
          {label}
        </button>
      ) : (
        <div className="scanner">
          <div id={regionIdRef.current} className="scanner-box" />
          <div className="row">
            <button type="button" className="btn" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
