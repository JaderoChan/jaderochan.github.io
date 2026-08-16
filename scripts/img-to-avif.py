#!/usr/bin/env python3
# Usage: python scripts/img-to-avif.py <input-image> [max-size]
# Requires: pip install Pillow pillow-avif-plugin

import sys
import os

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow not installed. Run: pip install Pillow pillow-avif-plugin", file=sys.stderr)
    sys.exit(1)

try:
    import pillow_avif  # registers AVIF encoder
except ImportError:
    pass

if len(sys.argv) < 2:
    print(f"Usage: python {sys.argv[0]} <input-image> [max-size]", file=sys.stderr)
    sys.exit(1)

input_path = os.path.abspath(sys.argv[1])
if not os.path.isfile(input_path):
    print(f"File not found: {input_path}", file=sys.stderr)
    sys.exit(1)

max_size = 560
if len(sys.argv) >= 3:
    try:
        max_size = int(sys.argv[2])
        if max_size <= 0:
            raise ValueError
    except ValueError:
        print("max-size must be a positive integer", file=sys.stderr)
        sys.exit(1)

stem = os.path.splitext(os.path.basename(input_path))[0]
output_path = os.path.join(os.path.dirname(input_path), stem + ".avif")

img = Image.open(input_path)

if img.width > max_size or img.height > max_size:
    img.thumbnail((max_size, max_size), Image.LANCZOS)

try:
    img.save(output_path, format="AVIF", quality=80)
except (KeyError, OSError) as e:
    print(f"Error saving AVIF: {e}", file=sys.stderr)
    print("Make sure pillow-avif-plugin is installed: pip install pillow-avif-plugin", file=sys.stderr)
    sys.exit(1)

print(f"Saved: {output_path}")
