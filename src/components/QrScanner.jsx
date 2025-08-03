import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QrScanner({ onScan, label = 'Scan', size = 240 }) {
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const containerIdRef = useRef(`qr-${Math.random().toString(36).slice(2)}`)
  const qrRef = useRef(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => stopScanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const startScanner = async () => {
    if (busy) return
    setError('')
    setOpen(true)
    setBusy(true)
    try {
      if (!qrRef.current) {
        qrRef.current = new Html5Qrcode(containerIdRef.current, /* verbose */ false)
      }
      await qrRef.current.start(
        { facingMode: { exact: 'environment' } }, // prefer rear camera
        {
          fps: 10,
          qrbox: { width: size, height: size },
          rememberLastUsedCamera: true,
          aspectRatio: 1.0,
        },
        onScanSuccess,
        onScanError
      )
    } catch (e) {
      // fallback: try default facingMode if exact env not available
      try {
        await qrRef.current.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: size, height: size } },
          onScanSuccess,
          onScanError
        )
      } catch (err) {
        setError(err?.message || 'Unable to start camera')
        setOpen(false)
      }
    } finally {
      setBusy(false)
    }
  }

  const stopScanner = async () => {
    if (qrRef.current && qrRef.current.isScanning) {
      try {
        await qrRef.current.stop()
        await qrRef.current.clear()
      } catch {}
    }
    setOpen(false)
  }

  const onScanSuccess = async (decodedText) => {
    onScan(decodedText)
    await stopScanner()
  }

  const onScanError = () => {
    // ignore per-frame decode errors to avoid noisy UI
  }

  return (
    <div className="qr">
      {!open ? (
        <button type="button" className="btn btn-secondary" onClick={startScanner} disabled={busy}>
          {busy ? 'Opening…' : label}
        </button>
      ) : (
        <div className="scanner">
          <div id={containerIdRef.current} className="scanner-box" />
          <div className="row">
            <button type="button" className="btn" onClick={stopScanner}>Close</button>
          </div>
          {error && <div className="error" role="alert">{error}</div>}
        </div>
      )}
    </div>
  )
}
