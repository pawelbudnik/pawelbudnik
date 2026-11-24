"""Unit tests run on Windows too; fcntl itself is provided by Linux on the HA add-on."""
import datetime as dt
import importlib.util
from pathlib import Path
import sys
import types
import unittest
import tempfile
import os
from unittest.mock import patch
if sys.platform == 'win32':
    sys.modules['fcntl'] = types.ModuleType('fcntl')
spec=importlib.util.spec_from_file_location('scheduler',Path(__file__).with_name('scheduler.py'))
scheduler=importlib.util.module_from_spec(spec)
spec.loader.exec_module(scheduler)
class Windows(unittest.TestCase):
    def test_sun_predictions_span_midnight_and_dst_without_approximation(self):
        records=[{'attributes':{'next_rising':'2026-10-25T06:00:00Z','next_setting':'2026-10-25T16:20:00Z'}}, {'attributes':{'next_rising':'2026-10-26T06:01:00Z','next_setting':'2026-10-25T16:20:00Z'}}]
        result=scheduler.windows(records)
        self.assertEqual(len(result),1)
        self.assertEqual(result[0][0].isoformat(),'2026-10-25T05:00:00+00:00')
        self.assertEqual(result[0][1].isoformat(),'2026-10-25T16:50:00+00:00')
    def test_missing_sun_fails_closed(self):
        self.assertEqual(scheduler.windows([{'attributes':{}}]),[])
    def test_fresh_capture_survives_drive_failure(self):
        with tempfile.TemporaryDirectory() as directory:
            latest=Path(directory)/'latest.jpg'
            fallback=Path(directory)/'snapshot.tmp'
            latest.write_bytes(b'old')
            os.utime(latest,(1,1))
            fallback.write_bytes(b'\xff\xd8fresh\xff\xd9')
            process=types.SimpleNamespace(wait=lambda timeout:1,poll=lambda:1)
            with patch.object(scheduler.subprocess,'Popen',return_value=process):
                data,captured=scheduler.capture({'capture_command':['test-only'], 'snapshot_path':str(latest),'fallback_snapshot_path':str(fallback)})
            self.assertEqual(data,b'\xff\xd8fresh\xff\xd9')
            self.assertEqual(latest.read_bytes(),b'old')
    def test_supervisor_token_is_reused_for_existing_capture_child(self):
        with patch.dict(os.environ,{},clear=True), patch.object(scheduler.Path,'is_file',return_value=True), patch.object(scheduler.Path,'read_text',return_value='test-supervisor-token\n'):
            self.assertEqual(scheduler.supervisor_token(),'test-supervisor-token')
            self.assertEqual(os.environ['SUPERVISOR_TOKEN'],'test-supervisor-token')
    def test_failed_upload_cannot_replace_remote_image(self):
        with patch.object(scheduler.urllib.request,'urlopen',side_effect=OSError('secret-url')):
            with self.assertRaises(OSError):
                scheduler.upload({'worker_url':'https://example.com','upload_token':'test'},b'jpeg',*[dt.datetime.now(dt.timezone.utc)]*3)
if __name__=='__main__': unittest.main()
