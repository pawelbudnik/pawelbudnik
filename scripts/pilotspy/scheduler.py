#!/usr/bin/env python3
"""Independent PilotSpy daemon. Configuration and credentials stay under /config."""
import datetime as dt
import fcntl
import json
import logging
from logging.handlers import RotatingFileHandler
import os
from pathlib import Path
import signal
import subprocess
import time
import urllib.request

UTC = dt.timezone.utc
ROOT = Path('/config/pilotspy')
LOG = logging.getLogger('pilotspy')

def supervisor_token():
    token = os.environ.get('SUPERVISOR_TOKEN')
    if not token:
        path = Path('/run/s6/container_environment/SUPERVISOR_TOKEN')
        if path.is_file():
            token = path.read_text().strip()
    if token:
        # SSH login shells omit the container environment; the existing capture
        # script also needs this token when launched as a child.
        os.environ['SUPERVISOR_TOKEN'] = token
    return token

def parse(value):
    return dt.datetime.fromisoformat(value.replace('Z', '+00:00')).astimezone(UTC)

def ha_get(config, path):
    token = config.get('ha_token') or supervisor_token()
    if not token:
        raise RuntimeError('missing_ha_authentication')
    request = urllib.request.Request(config['ha_url'].rstrip('/') + '/api/' + path,
        headers={'Authorization': 'Bearer ' + token})
    with urllib.request.urlopen(request, timeout=20) as response:
        return json.load(response)

def windows(records):
    """Use actual sun.sun predictions; never approximate sunrise with a 24h subtraction."""
    rises, sets = set(), set()
    for record in records:
        attrs = record.get('attributes', {})
        if attrs.get('next_rising'):
            rises.add(parse(attrs['next_rising']))
        if attrs.get('next_setting'):
            sets.add(parse(attrs['next_setting']))
    return sorted((r - dt.timedelta(hours=1), s + dt.timedelta(minutes=30))
        for r in rises for s in sets if dt.timedelta(0) < s-r < dt.timedelta(hours=24))

def save(path, value):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(value))
    os.chmod(temporary, 0o600)
    temporary.replace(path)

def capture(config):
    """Run existing script unchanged, retaining its Drive upload. Suppress credential-bearing output."""
    started = time.time()
    proc = subprocess.Popen(config['capture_command'], stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL, start_new_session=True)
    try:
        code = proc.wait(timeout=180)
    except subprocess.TimeoutExpired:
        os.killpg(proc.pid, signal.SIGKILL)
        proc.wait()
        raise RuntimeError('capture_timeout') from None
    finally:
        if proc.poll() is None:
            os.killpg(proc.pid, signal.SIGKILL)
            proc.wait()
    candidates = [Path(config['snapshot_path'])]
    if config.get('fallback_snapshot_path'):
        candidates.append(Path(config['fallback_snapshot_path']))
    fresh = [p for p in candidates if p.is_file() and p.stat().st_mtime >= started-1]
    image = max(fresh,key=lambda p:p.stat().st_mtime) if fresh else None
    # Drive failure can still leave a valid fresh local image for the private upload.
    if image is None:
        raise RuntimeError('no_fresh_snapshot')
    if code:
        LOG.warning('Existing capture command returned a failure; using its fresh local snapshot')
    if image.stat().st_size > 10*1024*1024:
        raise RuntimeError('snapshot_too_large')
    data = image.read_bytes()
    if not data.startswith(b'\xff\xd8') or not data.endswith(b'\xff\xd9'):
        raise RuntimeError('invalid_snapshot')
    return data, dt.datetime.fromtimestamp(image.stat().st_mtime, UTC)

def upload(config, data, captured, start, end):
    request = urllib.request.Request(config['worker_url'].rstrip('/')+'/upload', data=data,
        method='PUT', headers={'Authorization':'Bearer '+config['upload_token'],
        'Content-Type':'image/jpeg', 'User-Agent':'PilotSpy/1.0', 'X-Captured-At':captured.isoformat(),
        'X-Opens-At':start.isoformat(), 'X-Closes-At':end.isoformat()})
    with urllib.request.urlopen(request, timeout=45) as response:
        if response.status != 200:
            raise RuntimeError('upload_failed')

def publish_schedule(config, start, end):
    request = urllib.request.Request(config['worker_url'].rstrip('/')+'/schedule',
        data=json.dumps({'opens':start.isoformat(),'closes':end.isoformat()}).encode(),
        method='PUT',headers={'Authorization':'Bearer '+config['upload_token'],'Content-Type':'application/json','User-Agent':'PilotSpy/1.0'})
    with urllib.request.urlopen(request,timeout=20) as response:
        if response.status != 200:
            raise RuntimeError('schedule_upload_failed')

def run(config, once=False):
    state_path = ROOT/'scheduler-state.json'
    try:
        state = json.loads(state_path.read_text())
    except (OSError, ValueError):
        state = {'records': [], 'last_slot': -1}
    while True:
        try:
            now = dt.datetime.now(UTC)
            current = ha_get(config, 'states/sun.sun')
            # History provides today's predictions even when starting after sunrise/sunset.
            # Cached predictions cover recorder downtime and survive add-on restarts.
            if not state['records'] or state.get('history_day') != now.date().isoformat():
                since = (now-dt.timedelta(hours=36)).isoformat()
                try:
                    history = ha_get(config, 'history/period/'+since+'?filter_entity_id=sun.sun')
                    state['records'].extend(record for series in history for record in series)
                    state['history_day'] = now.date().isoformat()
                except Exception:
                    LOG.warning('Sun history unavailable; using cached and current sun predictions')
            state['records'].append(current)
            # Retain only future/recent predictions; keep unique pairs to bound disk usage.
            unique = {}
            for record in state['records']:
                attrs = record.get('attributes', {})
                if attrs.get('next_setting') and parse(attrs['next_setting']) > now-dt.timedelta(days=2):
                    unique[(attrs.get('next_rising'),attrs['next_setting'])] = {'attributes':attrs}
            state['records'] = list(unique.values())
            predicted = windows(state['records'])
            next_window = next(((start,end) for start,end in predicted if end>=now), None)
            if next_window:
                publish_schedule(config,*next_window)
            window = next(((start,end) for start,end in predicted if start<=now<=end), None)
            slot = int(now.timestamp()//300)
            if window and slot != state['last_slot']:
                # Persist before invoking camera: restart cannot duplicate this five-minute slot.
                state['last_slot'] = slot
                save(state_path,state)
                # Preserve the existing script's post-sunset cache on restarts.
                (ROOT/'sunset.txt').write_text((window[1]-dt.timedelta(minutes=30)).isoformat())
                data, captured = capture(config)
                if not window[0] <= captured <= window[1]:
                    raise RuntimeError('capture_outside_window')
                upload(config,data,captured,*window)
                LOG.info('Snapshot uploaded successfully')
            save(state_path,state)
        except Exception as error:
            # Never log exception messages/tracebacks: URLs and subprocess errors may contain secrets.
            LOG.error('PilotSpy cycle failed (%s); previous remote image preserved', type(error).__name__)
        if once:
            return
        time.sleep(max(1,60-time.time()%60))

def sys_exit():
    raise SystemExit(0)

if __name__ == '__main__':
    import argparse
    parser=argparse.ArgumentParser()
    parser.add_argument('--once',action='store_true')
    args=parser.parse_args()
    signal.signal(signal.SIGTERM, lambda *_: sys_exit())
    os.umask(0o077)
    ROOT.mkdir(parents=True,exist_ok=True)
    logging.basicConfig(level=logging.INFO,format='%(asctime)s %(levelname)s %(message)s',
        handlers=[RotatingFileHandler(ROOT/'scheduler.log',maxBytes=1000000,backupCount=3)])
    # The advisory lock is held for the entire daemon lifetime, also covering manual --once runs.
    with (ROOT/'scheduler.lock').open('w') as lock:
        try:
            fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
        except BlockingIOError:
            raise SystemExit('PilotSpy scheduler is already running')
        config=json.loads((ROOT/'scheduler.json').read_text())
        if not config['worker_url'].startswith('https://'):
            raise SystemExit('worker_url must use HTTPS')
        run(config,args.once)
