#!/usr/bin/env bash
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA="$ROOT/src/data/briefings.json"
OUT="$ROOT/public/briefing-covers"
mkdir -p "$OUT"

node -e '
const fs=require("fs");
const items=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));
for(const x of items){
  if(!x.id || !x.originalUrl) continue;
  process.stdout.write(String(x.id).replace(/[\t\n]/g,"")+"\t"+String(x.originalUrl).replace(/[\t\n]/g,"")+"\n");
}
' "$DATA" | while IFS=$'\t' read -r id url; do
  [ -n "$id" ] || continue
  [ -n "$url" ] || continue
  target="$OUT/$id.png"
  if [ -s "$target" ]; then
    echo "cover exists: $id"
    continue
  fi

  echo "capturing: $id"
  tmp="$target.tmp.png"
  rm -f "$tmp"
  if timeout 35s npx -y playwright@1.55.0 screenshot \
      --browser chromium \
      --viewport-size "1280,720" \
      --wait-for-timeout 1800 \
      "$url" "$tmp"; then
    mv "$tmp" "$target"
  else
    echo "warning: failed or timed out while capturing $url" >&2
    rm -f "$tmp"
  fi
done
