#!/usr/bin/env bash
# Master AI context – bundles manifest, tokens, copy, config, and key source files
mkdir -p extracts
{
  echo "# Venus PWA — Full AI Context"
  echo ""
  echo "## PROJECT MANIFEST"
  cat extracts/venus-manifest.json
  echo ""
  echo "## DESIGN TOKENS & TYPOGRAPHY"
  cat src/index.css
  echo ""
  echo "## BRAND COPY"
  cat src/content/brand.js
  echo ""
  echo "## UI COPY (labels, placeholders, messages)"
  cat src/config/copy.js
  echo ""
  echo "## ROUTES, NAVIGATION & CONSTANTS"
  cat src/config/navigation.js
  echo ""
  cat src/config/constants.js
  echo ""
  echo "## API & DATA LAYER"
  echo "### src/api/client.js"
  cat src/api/client.js
  echo ""
  echo "### src/data/products.js"
  cat src/data/products.js
  echo ""
  echo "### src/data/categories.js"
  cat src/data/categories.js
} > extracts/venus-full-context.txt
echo "Full context written to extracts/venus-full-context.txt"