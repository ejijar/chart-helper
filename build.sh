#!/bin/bash
# ============================================================
# EMS Chart Helper — Build Script
# Stitches modular source files into a single deployable HTML
# Usage: bash build.sh
# ============================================================
SRC="src"
DIST="dist"
OUTPUT="$DIST/index.html"
echo "Building EMS Chart Helper..."
while IFS= read -r line; do
  if echo "$line" | grep -q 'href="css/base.css"'; then
    echo "<style>"
    cat "$SRC/css/base.css"
    echo "</style>"
  elif echo "$line" | grep -q 'src="js/ems-prompt.js"'; then
    echo "<script>"
    cat "$SRC/js/ems-prompt.js"
    echo "</script>"
  elif echo "$line" | grep -q 'src="js/dispatch.js"'; then
    echo "<script>"
    cat "$SRC/js/dispatch.js"
    echo "</script>"
  elif echo "$line" | grep -q 'src="js/app.js"'; then
    echo "<script>"
    cat "$SRC/js/app.js"
    echo "</script>"
  elif echo "$line" | grep -q 'src="js/chart.js"'; then
    echo "<script>"
    cat "$SRC/js/chart.js"
    echo "</script>"
  elif echo "$line" | grep -q 'src="js/auth.js"'; then
    echo "<script>"
    cat "$SRC/js/auth.js"
    echo "</script>"
  else
    echo "$line"
  fi
done < "$SRC/index.html" > "$OUTPUT"
echo "Build complete: $OUTPUT"
echo "   $(wc -l < "$OUTPUT") lines"
