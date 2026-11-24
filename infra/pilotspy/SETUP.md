# PilotSpy setup and verification

## Implemented / still required

GitHub Pages continues to host the public Next.js site. Both `/seetakeoffs/` and
`/pilotspy/` embed `https://webcam.pawelbudnik.com/`. A separate Cloudflare Worker
serves the viewer and authenticates every image/status request. Private R2 contains
only `current.jpg` and `cat.jpg`. No Drive links or storage credentials reach the
browser. Drive remains an optional backup through the unchanged existing script.

**External infrastructure has not been configured or tested.** This session has
no Cloudflare credentials. GitHub CLI authentication was invalid, but Git push
succeeded using local credentials after sandbox escalation. DNS was checked:
`pawelbudnik.com` currently uses `dns1.registrar-servers.com` and
`dns2.registrar-servers.com`, not Cloudflare. SSH answered on the supplied LAN host,
but its host key is not trusted by this session. No host key check was bypassed.
The existing capture script/local JPEG path could therefore not be inspected.
The attached cat photo is not available as a local file in this checkout.

## 1. Cloudflare (one-time)

Use your own Cloudflare account. Add the existing domain as a zone and carefully
copy **all** existing DNS records, including GitHub Pages, mail, and verification
records, before changing nameservers at the registrar. Keep the GitHub Pages
records and custom domain pointing to GitHub. Wait for Cloudflare to mark the
zone active. This is required for the same-site custom webcam subdomain and
reliable embedded session cookies. The repository does not change your DNS.

In PowerShell, from the repository root, with Node 22 installed:

```powershell
Set-Location infra/pilotspy
npx.cmd wrangler@4 login
npx.cmd wrangler@4 r2 bucket create pilotspy-private
npx.cmd wrangler@4 deploy
npx.cmd wrangler@4 secret put VIEW_PASSWORD
npx.cmd wrangler@4 secret put SESSION_SECRET
npx.cmd wrangler@4 secret put UPLOAD_TOKEN
```

The first deploy may show an unavailable service until secrets exist. Enter the
requested initial viewing password **only at the hidden VIEW_PASSWORD prompt**.
It is deliberately absent from all repository files. Generate two independent
random secrets (at least 32 bytes each) with your password manager, one for
SESSION_SECRET and one for UPLOAD_TOKEN; paste each at its hidden prompt. Retain
the upload token in your password manager for the HA installer. Do not use a
password in a CLI argument or commit a `.dev.vars` file. No R2 API key is needed
on HA: it can only upload through the Worker with this separate bearer token.

Keep the bucket private: do not enable an R2 public development URL, public custom
domain, or public Drive sharing for webcam files. If the Drive file is currently
public, set its sharing to Restricted. The site never uses Drive to serve images.
The R2 binding provides atomic replacement: a failed private upload leaves the
last successful object intact. Remove any existing independent capture schedule
before starting this daemon so the old script cannot also run outside its lock.

Save the attached original cat photograph as a JPEG **outside the repository**,
then upload it (replace the local filename):

```powershell
npx.cmd wrangler@4 r2 object put pilotspy-private/cat.jpg --file C:/path/to/cat.jpg --content-type image/jpeg --remote
```

To change the viewing password later:

```powershell
npx.cmd wrangler@4 secret put VIEW_PASSWORD
```

Password rotation also invalidates existing sessions. Rotating SESSION_SECRET
logs everyone out too. UPLOAD_TOKEN rotation must also be applied to HA's private
scheduler.json. Sessions are signed, host-only, Secure, HttpOnly, SameSite=Strict
cookies lasting 30 days. Logging out deletes the browser's cookie. Login is limited
to approximately five attempts per IP per minute per Cloudflare location; this is
Cloudflare's lightweight distributed rate limit, not a strict global quota.

Cloudflare Workers/R2 usage and account/billing requirements depend on your plan;
check your account before enabling R2. There is no paid third-party scheduler.

## 2. Home Assistant Green

Use your local terminal to connect, verify the displayed SSH host-key fingerprint
against the add-on/device, and authenticate locally. Never paste the password into
chat. Copy only the scheduler files from this checkout (scp legacy protocol avoids
requiring the add-on's optional SFTP setting):

```powershell
scp -O -P 22 scripts/pilotspy/scheduler.py scripts/pilotspy/start.sh scripts/pilotspy/install.py hassio@192.168.178.144:/config/pilotspy/
ssh -p 22 hassio@192.168.178.144
```

Inside Advanced SSH & Web Terminal:

```sh
python3 /config/pilotspy/install.py
python3 /config/pilotspy/scheduler.py --once
```

The installer prompts locally for the local JPEG filename produced by your
existing `/config/pilotspy/pilotspy.py`, HA URL, HA long-lived access token, and the
separate upload token. Find the JPEG path by inspecting your existing script
locally; do not send credential-containing script output to chat. Create a
long-lived HA access token from your HA profile Security page. `scheduler.json`
is written with owner-only permissions. If the existing script needs a virtual
environment, adjust `capture_command` in that private JSON to its Python binary.
Its rclone upload remains unchanged; ensure that it updates the existing Drive
file privately and does not delete the prior copy before uploading.

Merge these fields into the add-on configuration, retaining existing SSH settings
and any packages/commands already configured:

```yaml
packages:
  - python3
  - util-linux
  # Retain packages your existing script requires, including rclone if configured.
init_commands:
  - "nohup /bin/sh /config/pilotspy/start.sh >> /config/pilotspy/scheduler.log 2>&1 < /dev/null &"
```

Enable **Start on boot** and **Watchdog** for Advanced SSH & Web Terminal, then
restart that add-on. No camera integration or Home Assistant automation is used.
The Python standard library supplies all scheduler dependencies. The existing
script's own Python dependencies must continue to be installed on add-on startup.

The supervisor and daemon each hold an OS lock. The daemon polls sun.sun every
minute and captures at most once per five-minute slot while inside the window.
It uses actual next_rising/next_setting predictions, caches them persistently, and
reads recent entity history to recover today's events after a restart. If HA
Recorder/history is disabled and no cache exists after sunrise, it fails closed
until it has enough predictions; it never guesses sunrise by subtracting a day.
Leave Recorder enabled for sun.sun for immediate recovery. Restarts can shift the
first capture by up to a minute. Capture processes time out after three minutes;
an upload failure retries in the next five-minute slot. Failed attempts never
replace the R2 object. Logs suppress command output, tokens and exception details.
Protect the existing script/rclone config too, and stop any old capture loop.

```sh
chmod 600 /config/pilotspy/scheduler.json
pgrep -af '/config/pilotspy/scheduler.py'
tail -n 30 /config/pilotspy/scheduler.log
# Rotate this small operational log periodically if running indefinitely.
```

## 3. Verify before declaring it live

```powershell
node --test infra/pilotspy/worker.test.mjs
python scripts/pilotspy/test_scheduler.py
npm.cmd run build
npx.cmd next export
curl.exe -I https://webcam.pawelbudnik.com/
curl.exe -i https://webcam.pawelbudnik.com/image
```

The unauthenticated image request must return 401 and Cache-Control: no-store.
Open `/seetakeoffs/` on phone and desktop, enter the password, and verify:

- The latest image appears after a successful daytime capture; its timestamp
  matches the scheduler log. Refresh and the five-minute timer fetch a new image.
- Login survives reload and a new tab. Incorrect passwords fail and excessive
  attempts receive 429. Logout blocks subsequent /image requests.
- Outside the uploaded capture window, the mountain image is removed and /image
  returns 403 even with a valid cookie. The private cat photo appears above
  “Sorry, no more flying now anyway :P”, with the operational-hours notice below.
- Restart the add-on/device and confirm one daemon resumes. A second --once
  invocation while the daemon runs must report “already running”.
- Simulate an upload failure using a temporary invalid upload token locally;
  confirm the last successful object and timestamp remain unchanged, then restore
  the token. Do not modify the working camera credentials for this test.

The browser removes the displayed snapshot at the known closing boundary as well
as rechecking status every five minutes. Previously viewed/downloaded images
cannot be revoked from a visitor's device. When no successful current window has
ever been uploaded, access fails closed and the viewer reports it is waiting.
An old timestamp signals that capture has stopped; the interface never fabricates
successful captures. All displayed times use Europe/Zurich.

## 4. GitHub deployment

Git push is available through local credentials outside the sandbox; GitHub CLI
may need separate authentication to inspect Actions. To publish future changes:

```powershell
gh auth login -h github.com
git push origin master
gh run list --workflow nextjs.yml --limit 3
```

The existing GitHub Pages workflow builds/exports the site and deploys on master.
No infrastructure secrets are required in GitHub Actions. Preserve any unrelated
local work when committing. Verify the Actions run and both live viewer URLs.

References: [Cloudflare rate limits](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/),
[R2 uploads](https://developers.cloudflare.com/r2/objects/upload-objects/),
[SSH add-on configuration](https://github.com/hassio-addons/repository/blob/master/ssh/DOCS.md).
