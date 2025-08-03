import { useState } from 'react'
import QrScanner from './components/QrScanner'

export default function App() {
  const [instrumentId, setInstrumentId] = useState('')
  const [containerId, setContainerId] = useState('')
  const [links, setLinks] = useState([])
  const [toast, setToast] = useState('')

  const handleLink = (e) => {
    e.preventDefault()
    const a = instrumentId.trim()
    const b = containerId.trim()
    if (!a || !b) {
      ping('Both fields are required')
      return
    }
    const pair = { instrumentId: a, containerId: b, ts: new Date().toISOString() }
    setLinks((prev) => [pair, ...prev].slice(0, 20))
    setInstrumentId('')
    setContainerId('')
    ping('Linked ✓')
  }

  const ping = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Instrument ⇄ Container</h1>
        <p className="muted">Scan or type IDs, then link them together.</p>
      </header>

      <form className="card" onSubmit={handleLink}>
        <div className="field-row">
          <label htmlFor="instrument">Instrument ID</label>
          <div className="input-with-action">
            <input
              id="instrument"
              className="input"
              placeholder="e.g. INST-12345"
              value={instrumentId}
              onChange={(e) => setInstrumentId(e.target.value)}
              autoComplete="off"
            />
            <QrScanner
              label="Scan"
              onScan={(text) => setInstrumentId(text.trim())}
            />
          </div>
        </div>

        <div className="field-row">
          <label htmlFor="container">Container ID</label>
          <div className="input-with-action">
            <input
              id="container"
              className="input"
              placeholder="e.g. CONT-98765"
              value={containerId}
              onChange={(e) => setContainerId(e.target.value)}
              autoComplete="off"
            />
            <QrScanner
              label="Scan"
              onScan={(text) => setContainerId(text.trim())}
            />
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-primary" type="submit">Link</button>
        </div>
      </form>

      {!!links.length && (
        <section className="card">
          <h2 className="section-title">Recent Links</h2>
          <ul className="list">
            {links.map((l, i) => (
              <li key={l.ts + i} className="list-item">
                <span className="pill">{l.instrumentId}</span>
                <span className="arrow">→</span>
                <span className="pill alt">{l.containerId}</span>
                <time className="time" dateTime={l.ts}>
                  {new Date(l.ts).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  )
}
