#!/usr/bin/env bash
set -euo pipefail
BASE="https://dqrsjhcfmpjhcxvtxosy.supabase.co/functions/v1"
ORIGIN="https://tamayuz10x.com"
status=$(curl -sS -o /dev/null -w '%{http_code}' -H "Origin: $ORIGIN" "$BASE/public-auth-config")
[ "$status" = "200" ] || { echo "public config failed: $status"; exit 1; }
for endpoint in assessment-attempts assessment-content assessment-reports; do
  status=$(curl -sS -o /dev/null -w '%{http_code}' -H "Origin: $ORIGIN" "$BASE/$endpoint")
  case "$status" in
    401|403) ;;
    *) echo "$endpoint unauthenticated check failed: $status"; exit 1 ;;
  esac
done
echo "Assessment live endpoint smoke: PASS"
