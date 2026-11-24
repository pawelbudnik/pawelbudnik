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
`/config/pilotspy/scheduler.json`, mode 0600. Device installation and actual camera
capture must be verified separately from deploying the website. Do not infer that
the webcam is live merely because the build or Worker deployment succeeds.

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
