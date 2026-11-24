#!/bin/sh
# Launched by Advanced SSH & Web Terminal init_commands. No HA automation required.
# Use a supervisor loop so an unexpected Python exit is recovered.
set -eu
umask 077
mkdir -p /config/pilotspy
exec 9>/config/pilotspy/supervisor.lock
flock -n 9 || exit 0
while :; do
  python3 /config/pilotspy/scheduler.py
  sleep 15
done
