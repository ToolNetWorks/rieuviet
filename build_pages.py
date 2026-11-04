#!/usr/bin/env python3
"""
RIEU VIỆT — Static HTML Generator Entrypoint.
Delegates generation to the modular scripts.sitegen package.
"""
import sys
from scripts.sitegen.builder import build

if __name__ == '__main__':
    count = build()
    sys.exit(0 if count == 9 else 1)
