"""
Crops guide images to remove surrounding manual text, keeping only the SCM system screenshots.
Strategy: detect the Flash SCM dark header bar (dark pixels spanning most of image width)
as the top anchor, crop from just above it to the bottom of the image.
For images with multiple screenshots, returns all of them as separate crops.
"""

import os
from PIL import Image
import numpy as np

IMG_DIR = os.path.join(os.path.dirname(__file__), '../static/img')
BACKUP_DIR = os.path.join(os.path.dirname(__file__), '../static/img/_originals')

# Guide image prefix numbers that need processing
GUIDE_PREFIXES = [str(i).zfill(2) for i in range(1, 24)]

def is_dark_row(pixels, y, width, threshold=80, min_fraction=0.6):
    """True if at least min_fraction of the row pixels are dark (r+g+b < threshold*3)."""
    row = pixels[y, :, :3]
    dark = np.sum(row < threshold, axis=1)  # count channels < threshold per pixel
    dark_pixels = np.sum(dark == 3)  # pixels where all 3 channels are dark
    return dark_pixels / width >= min_fraction

def find_scm_screenshot_starts(img_array):
    """
    Returns list of y-coordinates where SCM screenshots start.
    The Flash SCM interface has a dark header bar that spans most of the width.
    We look for rows that are dark (the nav/header) following a light region.
    """
    height, width = img_array.shape[:2]
    starts = []
    in_dark = False

    for y in range(height):
        dark = is_dark_row(img_array, y, width, threshold=70, min_fraction=0.35)
        if dark and not in_dark:
            # Entered a dark band — potential screenshot top
            # Check that this is sustained for at least 15px (real header bar)
            sustained = all(is_dark_row(img_array, min(y+i, height-1), width, threshold=70, min_fraction=0.30)
                           for i in range(15))
            if sustained:
                starts.append(max(0, y - 2))
                in_dark = True
        elif not dark and in_dark:
            in_dark = False

    return starts

def crop_guide_image(filepath, out_path):
    img = Image.open(filepath)
    arr = np.array(img)
    height, width = arr.shape[:2]

    starts = find_scm_screenshot_starts(arr)

    if not starts:
        print(f"  [SKIP] no SCM header found in {os.path.basename(filepath)}")
        return False

    # Find the end of each screenshot section (start of next section or end of image)
    crops = []
    for i, start in enumerate(starts):
        # End = next screenshot start (if any), or image bottom
        if i + 1 < len(starts):
            # Between two screenshots there may be text; look for next dark band
            end = starts[i + 1]
        else:
            end = height
        crops.append((start, end))

    if len(crops) == 1:
        # Single screenshot: just crop and overwrite
        cropped = img.crop((0, crops[0][0], width, crops[0][1]))
        cropped.save(out_path, quality=90)
        print(f"  [OK]   {os.path.basename(filepath)} → cropped y={crops[0][0]}:{crops[0][1]}")
    else:
        # Multiple screenshots: save as separate files _a, _b, ...
        base, ext = os.path.splitext(out_path)
        for idx, (top, bot) in enumerate(crops):
            cropped = img.crop((0, top, width, bot))
            letter = chr(ord('a') + idx)
            out = f"{base}_{letter}{ext}"
            cropped.save(out, quality=90)
        print(f"  [SPLIT] {os.path.basename(filepath)} → {len(crops)} crops")

    return True


def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)

    files = sorted(f for f in os.listdir(IMG_DIR)
                   if f.endswith('.jpg') and any(f.startswith(p + '_') for p in GUIDE_PREFIXES))

    print(f"Processing {len(files)} guide images...")

    for fname in files:
        src = os.path.join(IMG_DIR, fname)
        backup = os.path.join(BACKUP_DIR, fname)

        # Backup original
        if not os.path.exists(backup):
            Image.open(src).save(backup)

        crop_guide_image(src, src)

    print("\nDone.")


if __name__ == '__main__':
    main()
