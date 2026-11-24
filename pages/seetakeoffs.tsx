import Head from 'next/head';
import Link from 'next/link';
export default function SeeTakeoffs() {
  return <main style={{maxWidth:1100,margin:'100px auto 24px',padding:16}}>
    <Head><title>PilotSpy - See takeoffs</title><meta name="robots" content="noindex" /></Head>
    <h1 style={{fontSize:32,fontWeight:700}}>PilotSpy</h1>
    <p>Mountain weather, one snapshot at a time.</p>
    <iframe title="Password-protected PilotSpy webcam" src="https://webcam.pawelbudnik.com/" style={{width:'100%',height:'min(900px, 85vh)',minHeight:650,border:0,borderRadius:20,marginTop:20}} />
    <p><a href="https://webcam.pawelbudnik.com/" target="_blank" rel="noreferrer">Open webcam directly</a> if your browser blocks embedded cookies.</p>
    <p><Link href="/pilotspy/privacy/">Privacy policy</Link></p>
  </main>;
}
