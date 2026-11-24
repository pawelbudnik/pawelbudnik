"""Unit tests run on Windows too; fcntl itself is provided by Linux on the HA add-on."""
import datetime as dt
import importlib.util
from pathlib import Path
import sys
import types
import unittest
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
    def test_failed_upload_cannot_replace_remote_image(self):
        with patch.object(scheduler.urllib.request,'urlopen',side_effect=OSError('secret-url')):
            with self.assertRaises(OSError):
                scheduler.upload({'worker_url':'https://example.com','upload_token':'test'},b'jpeg',*[dt.datetime.now(dt.timezone.utc)]*3)
if __name__=='__main__': unittest.main()
