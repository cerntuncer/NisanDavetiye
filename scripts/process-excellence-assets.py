"""Download and process Excellence template ornament PNGs (transparent backgrounds)."""
from __future__ import annotations

import urllib.request
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

BASE_URL = "https://tdy-excellence-template.thedigitalyes.com"
EXCELLENCE = (
    Path(__file__).resolve().parents[1]
    / "NisanDavetiye.UI"
    / "public"
    / "assets"
    / "images"
    / "excellence"
)

ASSETS: dict[str, str] = {
    "column-left.png": "/assets/column-left-Deau9Trj.png",
    "column-right.png": "/assets/column-right-DejZoXz8.png",
    "curtain-left.png": "/assets/curtain-left-new-C9yBPbWK.png",
    "curtain-center.png": "/assets/curtain-center-new-EwKr26ZU.png",
    "curtain-right.png": "/assets/curtain-right-new-Dusl3IYi.png",
    "candles.png": "/assets/candles-BlDM94c8.png",
    "flower-vase.png": "/assets/flower-vase-B9_turUq.png",
    "roses-top-left.png": "/assets/roses-top-left-D0RRxzlV.png",
    "roses-bottom-right.png": "/assets/roses-bottom-right-C-Wj2fia.png",
    "bouquet.png": "/assets/bouquet-BbYUpj3K.png",
    "vase-left.png": "/assets/vase-left-DfaX_fU4.png",
    "vase-right.png": "/assets/vase-right-BfgTPz8l.png",
}

SKIP = {"monogram.png", "intro-poster.jpg"}


def edge_seeds(h: int, w: int) -> list[tuple[int, int]]:
    seeds: list[tuple[int, int]] = []
    for x in range(w):
        seeds.append((x, 0))
        seeds.append((x, h - 1))
    for y in range(h):
        seeds.append((0, y))
        seeds.append((w - 1, y))
    return seeds


def flood_mask(mask: np.ndarray) -> np.ndarray:
    h, w = mask.shape
    visited = np.zeros((h, w), dtype=bool)
    bg = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x, y in edge_seeds(h, w):
        if mask[y, x] and not visited[y, x]:
            visited[y, x] = True
            bg[y, x] = True
            queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and mask[ny, nx]:
                visited[ny, nx] = True
                bg[ny, nx] = True
                queue.append((nx, ny))

    return bg


def make_transparent(path: Path, light_threshold: int = 246, dark_threshold: int = 42) -> tuple[int, int]:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)

    light = (
        (rgb[:, :, 0] >= light_threshold)
        & (rgb[:, :, 1] >= light_threshold)
        & (rgb[:, :, 2] >= light_threshold)
    )
    dark = (
        (rgb[:, :, 0] <= dark_threshold)
        & (rgb[:, :, 1] <= dark_threshold)
        & (rgb[:, :, 2] <= dark_threshold)
    )

    bg = flood_mask(light) | flood_mask(dark)
    arr[:, :, 3] = np.where(bg, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(path)
    return int(bg.sum()), h * w


def download_assets() -> None:
    EXCELLENCE.mkdir(parents=True, exist_ok=True)
    for name, rel in ASSETS.items():
        dest = EXCELLENCE / name
        url = BASE_URL + rel
        print(f"download {name}")
        urllib.request.urlretrieve(url, dest)


def main(download: bool = True) -> None:
    if download:
        download_assets()
    for path in sorted(EXCELLENCE.glob("*")):
        if path.name in SKIP or path.suffix.lower() not in {".png", ".webp"}:
            continue
        removed, total = make_transparent(path)
        print(f"{path.name}: {removed}/{total} ({100 * removed / total:.1f}%)")


if __name__ == "__main__":
    import sys
    main(download="--no-download" not in sys.argv)
