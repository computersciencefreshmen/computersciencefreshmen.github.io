"""Compatibility entry point: generate the English public CV.

Use generate_multilingual_cv.py to generate all eight languages together.
"""

import sys

from generate_multilingual_cv import main

if __name__ == "__main__":
    if "--locale" not in sys.argv:
        sys.argv.extend(["--locale", "en"])
    main()
