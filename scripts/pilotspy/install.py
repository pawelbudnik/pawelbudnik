#!/usr/bin/env python3
"""Run locally inside Advanced SSH & Web Terminal, never through chat."""
import getpass
import json
import os
from pathlib import Path
import shutil

root=Path('/config/pilotspy')
root.mkdir(parents=True,exist_ok=True)
source=Path(__file__).resolve().parent
if not (root/'pilotspy.py').is_file():
    raise SystemExit('Expected existing /config/pilotspy/pilotspy.py; nothing changed.')
config_path=root/'scheduler.json'
if config_path.exists():
    raise SystemExit('scheduler.json already exists. Edit it locally; refusing to overwrite secrets.')
print('Your working pilotspy.py and rclone configuration will be retained.')
snapshot=input('Absolute path of the local JPEG written by pilotspy.py: ').strip()
if not Path(snapshot).is_absolute():
    raise SystemExit('An absolute local snapshot path is required.')
config={'ha_url':input('Home Assistant URL [http://homeassistant:8123]: ').strip() or 'http://homeassistant:8123',
        'ha_token':getpass.getpass('Home Assistant long-lived access token (hidden): '),
        'worker_url':input('Worker URL [https://webcam.pawelbudnik.com]: ').strip() or 'https://webcam.pawelbudnik.com',
        'upload_token':getpass.getpass('Cloudflare UPLOAD_TOKEN (hidden): '),
        'capture_command':['python3','/config/pilotspy/pilotspy.py'], 'snapshot_path':snapshot}
if not config['ha_token'] or not config['upload_token']:
    raise SystemExit('Tokens cannot be empty. Nothing written.')
if not config['worker_url'].startswith('https://'):
    raise SystemExit('HTTPS is required. Nothing written.')
os.umask(0o077)
config_path.write_text(json.dumps(config,indent=2)+'\n')
for name in ['scheduler.py','start.sh']:
    destination=root/name
    if source/name != destination:
        shutil.copyfile(source/name,destination)
    os.chmod(destination,0o700)
print('Installed. Test with: python3 /config/pilotspy/scheduler.py --once')
print('Then configure the add-on init_commands as documented in SETUP.md.')
