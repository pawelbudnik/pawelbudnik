
import Head from 'next/head';
import Link from 'next/link';

export default function PilotSpyPrivacy() {
  return (
    <main style={{
      maxWidth: 700,
      margin: '60px auto',
      padding: 24,
      fontFamily: 'Arial, sans-serif',
      lineHeight: 1.7
    }}>
      <Head>
        <title>PilotSpy - Privacy Policy</title>
        <link rel="canonical" href="https://pawelbudnik.com/pilotspy/privacy/" />
      </Head>

      <h1>PilotSpy Privacy Policy</h1>
      <p>Last updated: 24 November 2026</p>

      <h2>About PilotSpy</h2>
      <p>
        PilotSpy is a privately operated project that
        monitors cloud cover around paragliding takeoff
        areas near Interlaken, Switzerland.
      </p>

      <h2>Data Collection</h2>
      <p>
        PilotSpy captures periodic landscape photographs
        from a privately operated camera. It does not
        intentionally collect personal information or
        record audio.
      </p>

      <h2>Google Drive Access</h2>
      <p>
        PilotSpy uses rclone and the Google Drive API
        to upload and update camera snapshots in a
        designated Google Drive folder.
      </p>
      <p>
        Google Drive authorization is used solely for
        managing these snapshots. OAuth credentials
        are stored on the operator&apos;s local device
        and are not shared with viewers.
      </p>

      <h2>Storage and Sharing</h2>
      <p>
        Current snapshots replace previous images.
        Google Drive may retain file revisions according
        to its storage and retention policies.
      </p>
      <p>
        The website serves snapshots from private Cloudflare R2 storage only
        after password authentication. Google Drive remains a private backup
        accessible to authorized Drive users. Personal data is not sold or used
        for advertising.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Google processes backup images and account authorization data. Cloudflare
        processes private website images and authentication requests. A secure,
        HTTP-only session cookie remembers sign-in for approximately 30 days;
        logging out clears it. Login rate limiting uses the connecting IP address.
      </p>

      <h2>Data Access and Deletion</h2>
      <p>
        For questions about images, access, or deletion,
        contact the project operator using the email
        address below.
      </p>

      <h2>Contact</h2>
      <p>
        Email: pawelbudnik@gmail.com
      </p>

      <p>
        <Link href="/seetakeoffs/">Back to PilotSpy</Link>
      </p>
    </main>
  );
}
