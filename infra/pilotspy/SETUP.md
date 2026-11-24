# PilotSpy operations

Canonical viewer: **https://pawelbudnik.com/seetakeoffs/**.
`/pilotspy/` redirects there; `/pilotspy/privacy/` remains available for OAuth.
`webcam.pawelbudnik.com` is an API only. Its root redirects to the canonical page.
The Next.js page calls it with credentials; CORS permits only the canonical site
origin. There is no iframe, separate backend viewer, public image URL, or frontend
password comparison.

## Deployed infrastructure

The existing Cloudflare Worker `pilotspy`, private R2 bucket `pilotspy-private`,
and custom domain are reused. Cloudflare nameservers are active. The existing
VIEW_PASSWORD was preserved. SESSION_SECRET and UPLOAD_TOKEN were added using
cryptographically random values; local copies are encrypted with Windows DPAPI
under the operator's LocalAppData/PilotSpy directory and never enter the repo.
The original cat photo is stored privately as `cat.jpg`.

Only authenticated sessions can retrieve `/image`, `/cat`, and `/status`.
`/upload` and `/schedule` require the independent upload bearer token. Captures
replace `current.jpg` atomically. The schedule is published separately so nighttime
hours can be shown without taking a nighttime photo. The image route independently
checks capture-window metadata; the browser also clears the displayed mountain
image at closing time. Downloaded images cannot be revoked from a visitor's device.

Cookies are host-only, Secure, HttpOnly and SameSite=Strict, with a 30-day lifetime.
Logout clears the cookie. Login allows approximately five attempts per IP per
minute per Cloudflare location. No camera or Drive credentials are sent to viewers.

## Credential rotation

From the repository root, enter replacement credentials only at Wrangler's hidden
prompt, never in shell arguments:

```powershell
wrangler.cmd secret put VIEW_PASSWORD --config infra/pilotspy/wrangler.toml
```

Changing VIEW_PASSWORD invalidates existing sessions. SESSION_SECRET can likewise
be rotated to log everyone out. Rotating UPLOAD_TOKEN requires updating the private
HA scheduler.json as well; do not reset it independently while the scheduler runs.
Never make the R2 bucket public or share the webcam Drive file publicly.

## Device scheduler

The daemon wraps the existing `/config/pilotspy/pilotspy.py` and preserves its
camera configuration and rclone Drive upload. It uses sun.sun predictions and
recent history, persistent state, and OS locks. Missing trusted sun data fails
closed. Startup belongs to Advanced SSH & Web Terminal's init_commands, Start on
boot and Watchdog, with no camera integration or HA automation.

The add-on's SUPERVISOR_TOKEN can authorize `http://supervisor/core`; a separate
long-lived HA token is not needed there. Scheduler credentials belong only in
`/config/pilotspy/scheduler.json`, mode 0600. The scheduler is installed on the Green. Its root-only configuration uses the
existing latest.jpg plus the fresh snapshot.tmp fallback when Drive fails. The
SSH app has one PilotSpy init command, auto boot, and watchdog enabled. The scheduler log
is private and rotated. No HA entities, automations, or camera integrations were
created. The existing capture script and camera/rclone credentials are retained.

## Checks

```powershell
node --test infra/pilotspy/worker.test.mjs
python scripts/pilotspy/test_scheduler.py
npm.cmd run build
node node_modules/next/dist/bin/next export
```

Production smoke checks: backend root redirects to the canonical URL; unauthenticated
image/status/cat return 401; login preflight allows only https://pawelbudnik.com;
a valid session can fetch the private cat image at night; logout restores 401.
During flying hours, confirm an actual camera upload, timestamp, manual refresh,
and a subsequent automatic capture. Check add-on restart recovery and duplicate
process prevention on the actual device before claiming those checks passed.

References: [Cloudflare rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/),
[R2 private storage](https://developers.cloudflare.com/r2/),
[SSH app configuration](https://github.com/hassio-addons/repository/blob/master/ssh/DOCS.md).

## Verification recorded on 24 November 2026

- Production Next.js build and GitHub Pages export passed; the Pages deployment
  completed successfully. The canonical page contains the native viewer with no
  iframe or link to a separate backend viewer. The old page redirects and the
  OAuth privacy policy links back to the canonical viewer.
- Seven Worker checks and five scheduler checks passed, covering authentication,
  cookies, CSRF/CORS, private image delivery, rate limiting, upload preservation,
  sun windows, Supervisor token reuse and the fresh Drive-failure fallback.
- The original cat JPEG was uploaded to private R2. The user confirmed successful
  password authentication, the nighttime cat/message, Refresh, logout, and phone
  display on the deployed canonical page.
- The real camera returned a valid 196,419-byte JPEG. Its nighttime diagnostic was
  kept private and removed from the device afterward. It showed indoor reflection
  through the window, so mountain framing remains a daylight check.
- Existing authorized Drive access returned the original JPEG, matching the prior
  local snapshot. File and folder permission checks showed only named users, with
  no anyone/public or domain sharing. No Drive permissions were changed.
- The real scheduler published the exact sun.sun window through the protected
  Worker API. Exactly one supervisor/daemon pair ran. Duplicate supervisor launch
  exited cleanly, and a concurrent scheduler invocation was blocked by its lock.
- Advanced SSH & Web Terminal was restarted. A new private R2 schedule heartbeat
  arrived afterward, proving automatic scheduler recovery. A full Green hardware
  reboot was not performed.
- An actual camera JPEG sent outside the valid window was rejected with HTTP 400.
  No nighttime mountain snapshot was published. The first scheduled daylight
  capture is due around 06:45 Europe/Zurich on 25 November 2026; its successful
  R2 image upload and subsequent five-minute camera cadence remain unverified.

Nighttime viewing is live and verified. Do not claim verified daytime webcam
operation until a successful current.jpg capture is present after opening time.
