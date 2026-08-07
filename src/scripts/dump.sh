#!/usr/bin/env bash
# dump.sh – AI‑ready compact codebase dump
# Output goes to /tmp by default → never scanned by find.
# Usage: ./dump.sh [output-file]

set -euo pipefail

OUTPUT="${1:-/tmp/venus-pwa-compact.txt}"

# Exclude directories and binary files
find . -type f \
  -not -path './node_modules/*' \
  -not -path './dist/*' \
  -not -path './.git/*' \
  -not -path './public/images/*' \
  -not -name 'package-lock.json' \
  -not -name '*.png' \
  -not -name '*.svg' \
  -not -name '*.ico' \
  -not -name '*.jpg' \
  -not -name '*.jpeg' \
  -not -name '*.gif' \
  -not -name '*.webp' \
  -not -name '*.ttf' \
  -not -name '*.woff' \
  -not -name '*.woff2' \
  | sort \
  | while read -r file; do
      echo "// FILE: $file" >> "$OUTPUT"
      cat "$file" >> "$OUTPUT"
      echo "" >> "$OUTPUT"
    done

echo "Compact dump written to $OUTPUT"