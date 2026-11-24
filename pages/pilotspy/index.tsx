import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
export default function PilotSpyRedirect() {
  useEffect(() => { window.location.replace('/seetakeoffs/'); }, []);
  return <main style={{padding:'120px 24px'}}><Head>
    <title>PilotSpy - See takeoffs</title><meta name="robots" content="noindex" />
    <link rel="canonical" href="https://pawelbudnik.com/seetakeoffs/" />
    <meta httpEquiv="refresh" content="0;url=/seetakeoffs/" />
  </Head><p>Continue to <Link href="/seetakeoffs/">PilotSpy</Link>.</p></main>;
}
