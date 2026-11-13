#!/usr/bin/env bash
# Deploy site/ to the Aliyun lightweight server behind https://tezoi.cn.
#
#   scripts/deploy_aliyun.sh            # package, upload changed files, check
#
# Needs an SSH key that the server accepts (default ~/.ssh/tezoi_deploy).
# Override with TEZOI_HOST / TEZOI_SSH_KEY. GitHub Pages is unaffected.
set -euo pipefail

HOST="${TEZOI_HOST:-root@47.112.101.47}"
KEY="${TEZOI_SSH_KEY:-$HOME/.ssh/tezoi_deploy}"
REMOTE_DIR=/var/www/tezoi/site
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PKG="$(mktemp -d)/site"
trap 'rm -rf "$(dirname "$PKG")"' EXIT

python3 "$ROOT/scripts/prepare_pages.py" "$ROOT/site" "$PKG"

# GitHub Pages serves the site under /tezoi/; the Aliyun server serves it at the root.
sed -i.bak 's#<base href="/tezoi/">#<base href="/">#; s#href="/tezoi/"#href="/"#g' "$PKG/404.html"
rm -f "$PKG/404.html.bak"
if grep -q '/tezoi/' "$PKG/404.html"; then echo "404.html still points at /tezoi/" >&2; exit 1; fi

ssh -i "$KEY" "$HOST" "mkdir -p $REMOTE_DIR"
rsync -az --delete --info=stats1 -e "ssh -i $KEY" "$PKG/" "$HOST:$REMOTE_DIR/"

# Check from the server itself, so a local proxy cannot mislead the result.
ssh -i "$KEY" "$HOST" 'for u in https://tezoi.cn/ https://tezoi.cn/company.html http://127.0.0.1/; do
  printf "%s %s\n" "$(curl -s -o /dev/null -m 15 -w %{http_code} "$u")" "$u"; done'
