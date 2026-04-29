"""
Refines guide images by:
1. Finding the first SCM dark navigation bar (header) as the crop start point
2. Finding the first large pure-white gap as the crop end point (removes white page margins)
3. For images without an SCM header, uses content-block detection as fallback
4. For stacked screenshots, stops before the second header bar
"""

import os
from PIL import Image
import numpy as np

IMG_DIR = os.path.join(os.path.dirname(__file__), '../static/img')
BACKUP_DIR = os.path.join(os.path.dirname(__file__), '../static/img/_originals')

GUIDE_PREFIXES = [str(i).zfill(2) for i in range(1, 24)]
PADDING = 4

# Skip: already looks good from previous crop pass
SKIP_IMAGES = {
    '04_入库单详情_箱单管理按钮.jpg',
    '12_TikTok授权入口.jpg',
    '15_Lazada订购成功.jpg',
}

# Keep first content block (not first dark-header block)
KEEP_FIRST_BLOCK = {
    '09_混箱箱单标签.jpg',  # first block = photo of boxes with labels
}

# Explicit (top_row, bot_row) overrides — used when auto-detection can't handle the image
MANUAL_CROP = {
    # Two SCM sections separated by 35-row internal gap; doc-text gap is only 29 rows —
    # no threshold distinguishes them, so crop is hardcoded to stop before the doc text.
    '19_批量修改库存信息.jpg': (0, 611),
}

# Stacked screenshots: stop at second dark header
SPLIT_AT_SECOND_HEADER = {
    '10_混箱箱单示例.jpg',
    '10_混箱箱单示例2.jpg',
    '18_商品映射关系列表.jpg',
    '20_套装档案创建.jpg',
    '22_单SKU库存更新.jpg',
}


# ──────────────────────────────────────────────
# Detection helpers
# ──────────────────────────────────────────────

def row_dark_fraction(pixels, y, width, dark_threshold=100):
    row = pixels[y, :, :3].astype(np.int32)
    return np.sum(np.all(row < dark_threshold, axis=1)) / width


def row_pure_white_fraction(pixels, y, width, white_threshold=245):
    row = pixels[y, :, :3].astype(np.int32)
    return np.sum(np.all(row > white_threshold, axis=1)) / width


def row_content_fraction(pixels, y, width, light_threshold=235):
    row = pixels[y, :, :3].astype(np.int32)
    light = np.all(row > light_threshold, axis=1)
    return 1.0 - np.sum(light) / width


def find_dark_header(arr, start_row=0, end_row=None,
                     dark_fraction=0.28, min_consecutive=5):
    """
    Find the first dark navigation bar at or after start_row.
    Returns the first row of the band, or None.
    """
    height, width = arr.shape[:2]
    if end_row is None:
        end_row = height
    consecutive = 0
    for y in range(start_row, end_row):
        if row_dark_fraction(arr, y, width) >= dark_fraction:
            consecutive += 1
            if consecutive >= min_consecutive:
                return y - min_consecutive + 1
        else:
            consecutive = 0
    return None


def find_screenshot_end(arr, from_row, pure_white_gap=40):
    """
    Starting from from_row, return the row where the first ≥pure_white_gap
    run of nearly-pure-white rows begins (= end of screenshot content).
    Falls back to image height.
    """
    height, width = arr.shape[:2]
    consecutive = 0
    gap_start = None
    for y in range(from_row, height):
        frac = row_pure_white_fraction(arr, y, width)
        if frac >= 0.99:
            if gap_start is None:
                gap_start = y
            consecutive += 1
            if consecutive >= pure_white_gap:
                return gap_start
        else:
            consecutive = 0
            gap_start = None
    return height


def find_content_blocks_fallback(arr, min_height=60, merge_gap=35,
                                  content_threshold=0.08):
    """
    Fallback for images without a dark header.
    Merge-first content detection: small within-UI gaps are bridged.
    """
    height, width = arr.shape[:2]
    is_content = [row_content_fraction(arr, y, width) >= content_threshold
                  for y in range(height)]

    raw_runs = []
    in_run, run_start = False, 0
    for y, c in enumerate(is_content):
        if c and not in_run:
            run_start, in_run = y, True
        elif not c and in_run:
            raw_runs.append([run_start, y])
            in_run = False
    if in_run:
        raw_runs.append([run_start, height])

    if not raw_runs:
        return []

    merged = [raw_runs[0]]
    for r in raw_runs[1:]:
        if r[0] - merged[-1][1] <= merge_gap:
            merged[-1][1] = r[1]
        else:
            merged.append(r)

    return [(b[0], b[1]) for b in merged if b[1] - b[0] >= min_height]


# ──────────────────────────────────────────────
# Main per-image logic
# ──────────────────────────────────────────────

def refine_image(src_path, dst_path, keep_first=False, split_at_second=False):
    img = Image.open(src_path)
    arr = np.array(img)
    height, width = arr.shape[:2]

    note = ""

    if keep_first:
        # First content block (e.g. photo of boxes)
        blocks = find_content_blocks_fallback(arr)
        if not blocks:
            print(f"  [SKIP] no content in {os.path.basename(src_path)}")
            return False
        top_row, bot_row = blocks[0]
        note = "first-content-block"

    else:
        # Primary strategy: start at first SCM dark header
        hdr = find_dark_header(arr)

        if hdr is not None:
            top_row = hdr
            bot_row = find_screenshot_end(arr, top_row)
            note = f"header@{hdr}"

            if split_at_second:
                # Look for a second dark header at least 100 rows after the first
                hdr2 = find_dark_header(arr, start_row=top_row + 100)
                if hdr2 is not None and hdr2 < bot_row:
                    bot_row = hdr2
                    note += f" split@{hdr2}"

        else:
            # Fallback: largest content block (standard threshold)
            blocks = find_content_blocks_fallback(arr)
            if not blocks:
                # Second-chance fallback for very light UIs (e.g. Lazada Seller Center)
                # Use 1.5% threshold and stop at first pure-white gap
                top_row = None
                for y in range(height):
                    if row_content_fraction(arr, y, width) >= 0.015:
                        top_row = y
                        break
                if top_row is None:
                    print(f"  [SKIP] no content in {os.path.basename(src_path)}")
                    return False
                bot_row = find_screenshot_end(arr, top_row)
                note = "fallback-light-ui"
            else:
                top_row, bot_row = max(blocks, key=lambda b: b[1] - b[0])
                note = "fallback-largest"

    top = max(0, top_row - PADDING)
    bot = min(height, bot_row + PADDING)
    cropped = img.crop((0, top, width, bot))
    cropped.save(dst_path, quality=90)
    print(f"  [OK]   {os.path.basename(src_path)} → y={top}:{bot}  ({bot-top}px)  [{note}]")
    return True


def main():
    files = sorted(
        f for f in os.listdir(IMG_DIR)
        if f.endswith('.jpg') and any(f.startswith(p + '_') for p in GUIDE_PREFIXES)
    )

    print(f"Refining {len(files)} guide images...\n")

    for fname in files:
        if fname in SKIP_IMAGES:
            print(f"  [SKIP] {fname}")
            continue

        backup = os.path.join(BACKUP_DIR, fname)
        dst = os.path.join(IMG_DIR, fname)

        if not os.path.exists(backup):
            print(f"  [WARN] no backup: {fname}")
            continue

        if fname in MANUAL_CROP:
            top_row, bot_row = MANUAL_CROP[fname]
            img = Image.open(backup)
            arr = np.array(img)
            height, width = arr.shape[:2]
            top = max(0, top_row - PADDING)
            bot = min(height, bot_row + PADDING)
            img.crop((0, top, width, bot)).save(dst, quality=90)
            print(f"  [OK]   {fname} → y={top}:{bot}  ({bot-top}px)  [manual]")
            continue

        refine_image(
            backup, dst,
            keep_first=(fname in KEEP_FIRST_BLOCK),
            split_at_second=(fname in SPLIT_AT_SECOND_HEADER),
        )

    print("\nDone.")


if __name__ == '__main__':
    main()
