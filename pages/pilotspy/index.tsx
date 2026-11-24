
import Head from 'next/head';
import Link from 'next/link';

export default function PilotSpy() {
  return (
    <main style={{
      maxWidth: 700,
      margin: '60px auto',
      padding: 24,
      fontFamily: 'Arial, sans-serif',
      lineHeight: 1.7
    }}>
      <Head>
        <title>PilotSpy - Paragliding Weather Camera</title>
      </Head>

      <h1>PilotSpy</h1>

      <p>
        PilotSpy is a personal project for monitoring
        cloud cover around paragliding takeoff areas
        near Interlaken, Switzerland.
      </p>

      <p>
        A privately operated camera captures periodic
        mountain-weather snapshots. These images are
        uploaded to Google Drive and shared with
        selected viewers.
      </p>

      <p>
        The Google Drive connection is used solely
        to upload and update camera snapshots.
      </p>

      <p>
        <Link href="/pilotspy/privacy/" legacyBehavior>
          <a>Privacy Policy</a>
        </Link>
      </p>

      <p>
        Contact: pawelbudnik@gmail.com
      </p>
    </main>
  );
}
