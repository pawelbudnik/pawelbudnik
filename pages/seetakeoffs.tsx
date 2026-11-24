/* eslint-disable @next/next/no-img-element -- Protected image blobs must stay in this browser. */
import { FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/PilotSpy.module.css';

const API = 'https://webcam.pawelbudnik.com';
type SnapshotStatus = { active: boolean; captured: string | null; opens: string | null; closes: string | null };
const displayTime = (value: string) => new Date(value).toLocaleString('en-GB', {
  timeZone: 'Europe/Zurich', day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: false,
});

export default function SeeTakeoffs() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<SnapshotStatus | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [message, setMessage] = useState('');
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
      // Remove a mountain snapshot immediately when the API reports private hours.
      if (!next.active) setPhoto(null);
      const image = await fetch(API + (next.active ? '/image' : '/cat'), {
        credentials: 'include', cache: 'no-store', signal: controller.signal,
      });
      if (image.status === 401) { setAuthenticated(false); setPhoto(null); return; }
      if (!image.ok) { setPhoto(null); throw new Error(next.active ? 'Awaiting a successful mountain snapshot.' : 'The off-duty photo is temporarily unavailable.'); }
      const blob = await image.blob();
      if (current !== generation.current) return;
      setPhoto(URL.createObjectURL(blob)); setMessage('');
    } catch (error) {
      if (!controller.signal.aborted && current === generation.current) setMessage(error instanceof Error ? error.message : 'Connection unavailable. Please try again.');
    } finally {
      if (current === generation.current) { setBusy(false); setChecking(false); }
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 300000);
    const visible = () => { if (!document.hidden) refresh(); };
    document.addEventListener('visibilitychange', visible);
    const cancel = () => { ++generation.current; request.current?.abort(); };
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', visible); cancel(); };
  }, [refresh]);

  useEffect(() => {
    if (!status?.active || !status.closes) return;
    const timer = window.setTimeout(() => {
      setPhoto(null); setStatus(previous => previous ? { ...previous, active: false } : previous); refresh();
    }, Math.max(0, new Date(status.closes).getTime() - Date.now()) + 50);
    return () => clearTimeout(timer);
  }, [status, refresh]);

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
    ++generation.current; request.current?.abort(); setPhoto(null); setBusy(true);
    try {
      const result = await fetch(API + '/logout', { method: 'POST', credentials: 'include' });
      if (!result.ok) throw new Error('Logout failed. Please try again.');
      setAuthenticated(false); setStatus(null); setMessage('Logged out.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Logout failed. Please try again.'); }
    finally { setBusy(false); }
  }

  return <main className={styles.page}>
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
      </section> : <section className={styles.card} aria-label="Webcam viewer" aria-busy={busy}>
        <div className={styles.actions}><button onClick={refresh} disabled={busy}>{busy ? 'Refreshing...' : 'Refresh'}</button>
          <button className={styles.secondary} onClick={logout} disabled={busy}>Log out</button></div>
        {photo && <img className={styles.photo} src={photo} alt={status?.active ? 'Latest mountain snapshot' : 'Our cat, off duty'} />}
        {status && !status.active && <h2 className={styles.night}>Sorry, can&apos;t see shit now anyway ¯\(ツ)/¯</h2>}
        <p className={styles.muted}>{status?.captured ? 'Last successful capture: ' + displayTime(status.captured) : 'Awaiting the first successful capture.'}</p>
        {status?.opens && status.closes && <p className={styles.muted}>Capture window: {displayTime(status.opens)} - {displayTime(status.closes)}</p>}
      </section>}
    <p className={styles.message} role="status" aria-live="polite">{message}</p>
    <p className={styles.hours}>Snapshots operate from one hour before sunrise until 30 minutes after sunset.<br />
      Automatically refreshed every five minutes. Operational times come from Home Assistant&apos;s sun.sun entity.</p>
  </main>;
}
