/* eslint-disable @next/next/no-img-element -- Protected image blobs must stay in this browser. */
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/PilotSpy.module.css';

const CAPTURE_INTERVAL = 300000;
const CAPTURE_UPLOAD_DELAY = 15000;
const API = 'https://webcam.pawelbudnik.com';
type SnapshotStatus = { active: boolean; captured: string | null; opens: string | null; closes: string | null };
const displayTime = (value: string) => new Date(value).toLocaleString('en-GB', {
  timeZone: 'Europe/Zurich', day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
});

export default function SeeTakeoffs() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<SnapshotStatus | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showingLastCapture, setShowingLastCapture] = useState(false);
  const [now, setNow] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const imageDialog = useRef<HTMLDialogElement | null>(null);
  const lastCapture = useRef(false);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);

  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    const current = ++generation.current;
    setBusy(true);
    try {
      const result = await fetch(API + '/status', { credentials: 'include', cache: 'no-store', signal: controller.signal });
      if (result.status === 401) {
        setAuthenticated(false); setPhoto(null); setStatus(null); return;
      }
      if (!result.ok) throw new Error('Could not refresh. Please try again.');
      const next: SnapshotStatus = await result.json();
      if (current !== generation.current) return;
      setAuthenticated(true); setStatus(next);
      if (next.active) lastCapture.current = false;
      const showLast = !next.active && lastCapture.current;
      const image = await fetch(API + (next.active ? '/image' : showLast ? '/last-capture' : '/cat'), {
        credentials: 'include', cache: 'no-store', signal: controller.signal,
      });
      if (image.status === 401) { setAuthenticated(false); setPhoto(null); return; }
      if (!image.ok) { setPhoto(null); throw new Error(next.active || showLast ? 'No captured snapshot is available yet.' : 'The off-duty photo is temporarily unavailable.'); }
      const blob = await image.blob();
      if (current !== generation.current) return;
      setPhoto(URL.createObjectURL(blob)); setShowingLastCapture(showLast); setMessage('');
    } catch (error) {
      if (!controller.signal.aborted && current === generation.current) setMessage(error instanceof Error ? error.message : 'Connection unavailable. Please try again.');
    } finally {
      if (current === generation.current) { setBusy(false); setChecking(false); }
    }
  }, []);

  useEffect(() => {
    refresh();
    let timer: number;
    const schedule = () => {
      // Capture runs in five-minute clock slots; allow time for upload to finish.
      const delay = CAPTURE_INTERVAL - ((Date.now() - CAPTURE_UPLOAD_DELAY) % CAPTURE_INTERVAL);
      timer = window.setTimeout(() => { refresh(); schedule(); }, delay);
    };
    schedule();
    const visible = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', visible);
    const cancel = () => { ++generation.current; request.current?.abort(); };
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', visible); cancel(); };
  }, [refresh]);

  useEffect(() => {
    if (!status?.active || !status.closes) return;
    const timer = window.setTimeout(() => {
      setPhoto(null); setStatus(previous => previous ? { ...previous, active: false } : previous); refresh();
    }, Math.max(0, new Date(status.closes).getTime() - Date.now()) + 50);
    return () => clearTimeout(timer);
  }, [status, refresh]);

  useEffect(() => {
    const tick = () => setNow(new Date().toISOString());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!photo) imageDialog.current?.close();
  }, [photo]);

  async function openImage() {
    const dialog = imageDialog.current;
    if (!dialog) return;
    setZoom(1);
    dialog.showModal();
    try { await dialog.requestFullscreen?.(); } catch { /* The modal fills the viewport when fullscreen is unavailable. */ }
  }

  function closeImage() {
    imageDialog.current?.close();
  }

  function imageClosed() {
    if (document.fullscreenElement === imageDialog.current) document.exitFullscreen().catch(() => {});
    setZoom(1);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('');
    try {
      const result = await fetch(API + '/login', { method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      setPassword('');
      if (!result.ok) {
        const detail = await result.json().catch(() => ({}));
        throw new Error(detail.error || 'Sign-in failed. Please try again.');
      }
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign-in unavailable. Please try again.'); }
    finally { setBusy(false); }
  }

  async function logout() {
    lastCapture.current = false; setShowingLastCapture(false);
    ++generation.current; request.current?.abort(); setPhoto(null); setBusy(true);
    try {
      const result = await fetch(API + '/logout', { method: 'POST', credentials: 'include' });
      if (!result.ok) throw new Error('Logout failed. Please try again.');
      setAuthenticated(false); setStatus(null); setMessage('Logged out.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Logout failed. Please try again.'); }
    finally { setBusy(false); }
  }

  return <main className={`${styles.page} ${authenticated ? styles.viewerPage : ''}`}>
    <Head>
      <title>PilotSpy - See takeoffs</title>
      <meta name="description" content="Private mountain weather snapshots for planning your next flight." />
      <meta name="robots" content="noindex" />
      <link rel="canonical" href="https://pawelbudnik.com/seetakeoffs/" />
      <meta property="og:url" content="https://pawelbudnik.com/seetakeoffs/" />
    </Head>
    {checking ? <section className={styles.card}><p role="status">Checking your sign-in...</p></section> : !authenticated ?
      <section className={styles.card}>
        <form onSubmit={login} className={styles.form}>
          <label htmlFor="viewing-password">Viewing password</label>
          <input id="viewing-password" name="password" type="password" autoComplete="current-password" required maxLength={256}
            value={password} onChange={event => setPassword(event.target.value)} />
          <button disabled={busy}>{busy ? 'Signing in...' : 'View webcam'}</button>
        </form>
      </section> : <section className={`${styles.card} ${styles.viewer}`} aria-label="Webcam viewer" aria-busy={busy}>
        <div className={styles.actions}><button onClick={refresh} disabled={busy}>{busy ? 'Refreshing...' : 'Refresh'}</button>
          <button className={styles.secondary} onClick={logout} disabled={busy}>Log out</button></div>
        {photo && <button className={styles.photoButton} onClick={openImage} aria-label="Open image full screen">
          <img className={styles.photo} src={photo} alt={status?.active || showingLastCapture ? 'Latest mountain snapshot' : 'Our cat, off duty'} />
        </button>}
        {status && !status.active && <h2 className={styles.night}>Sorry, can&apos;t see shit now anyway ¯\(ツ)/¯</h2>}
        {status && !status.active && <div><button disabled={busy || (!showingLastCapture && !status.captured)}
          onClick={() => { lastCapture.current = !showingLastCapture; refresh(); }}>
          {showingLastCapture ? 'Show cat' : 'Last capture'}
        </button></div>}
        {now && <p className={styles.muted}><time dateTime={now}>{displayTime(now)}</time></p>}
      </section>}
    <dialog ref={imageDialog} className={styles.imageDialog} onClose={imageClosed} aria-label="Full-screen image viewer">
      <div className={styles.zoomControls}>
        <button onClick={() => setZoom(value => Math.max(1, value - 0.5))} disabled={zoom <= 1} aria-label="Zoom out">-</button>
        <button onClick={() => setZoom(1)} aria-label="Fit image to screen">{Math.round(zoom * 100)}% / Fit</button>
        <button onClick={() => setZoom(value => Math.min(5, value + 0.5))} disabled={zoom >= 5} aria-label="Zoom in">+</button>
        <button onClick={closeImage}>Close</button>
      </div>
      <div className={styles.zoomViewport}>
        <div className={styles.zoomCanvas} style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
          {photo && <img src={photo} alt={status?.active || showingLastCapture ? 'Latest mountain snapshot' : 'Our cat, off duty'} />}
        </div>
      </div>
    </dialog>
    <p className={styles.message} role="status" aria-live="polite">{message}</p>
    <p className={styles.hours}>Snapshots operate from one hour before sunrise until 30 minutes after sunset.<br />
      Automatically refreshed every five minutes.</p>
  </main>;
}
