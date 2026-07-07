"""Remove baked-in black backgrounds from ornament PNGs (screenshot exports)."""
from __future__ import annotations

from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(__file__).resolve().parents[1] / "NisanDavetiye.UI" / "public" / "assets" / "images"
EXCELLENCE = ASSETS / "excellence"
FILES = [
    "footer-ornament.png",
    "photo-frame.png",
    "string-lights.png",
    "music-ornament.png",
    "zarf.png",
    "rings-illustration.png",
]

# Flood-fill misses enclosed black gaps; global key removes all near-black pixels.
GLOBAL_KEY_FILES = {"string-lights.png"}

# Extra flood seeds for inner transparent windows (x, y) at 1024 reference size.
INNER_SEED_FILES: dict[str, tuple[tuple[int, int], ...]] = {
    "footer-ornament.png": ((512, 580),),
    "rings-illustration.png": ((351, 302), (659, 323)),
}


def flood_from_seeds(dark: np.ndarray, seeds: tuple[tuple[int, int], ...]) -> np.ndarray:
    h, w = dark.shape
    visited = np.zeros((h, w), dtype=bool)
    bg = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x, y in seeds:
        if 0 <= x < w and 0 <= y < h and dark[y, x] and not visited[y, x]:
            queue.append((x, y))
            visited[y, x] = True
            bg[y, x] = True

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and dark[ny, nx]:
                visited[ny, nx] = True
                bg[ny, nx] = True
                queue.append((nx, ny))

    return bg


def edge_seeds(h: int, w: int) -> tuple[tuple[int, int], ...]:
    seeds: list[tuple[int, int]] = []
    for x in range(w):
        seeds.append((x, 0))
        seeds.append((x, h - 1))
    for y in range(h):
        seeds.append((0, y))
        seeds.append((w - 1, y))
    return tuple(seeds)


def remove_black_bg(
    path: Path,
    threshold: int = 40,
    inner_seeds: tuple[tuple[int, int], ...] | None = None,
) -> tuple[int, int]:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)
    dark = (rgb[:, :, 0] <= threshold) & (rgb[:, :, 1] <= threshold) & (rgb[:, :, 2] <= threshold)

    bg = flood_from_seeds(dark, edge_seeds(h, w))

    if inner_seeds:
        scale_x = w / 1024
        scale_y = h / 1024
        scaled = tuple(
            (int(round(x * scale_x)), int(round(y * scale_y))) for x, y in inner_seeds
        )
        bg |= flood_from_seeds(dark, scaled)

    arr[:, :, 3] = np.where(bg, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(path)
    return int(bg.sum()), h * w


def build_window_mask() -> None:
    frame_path = ASSETS / "footer-ornament.png"
    mask_path = ASSETS / "window-mask.png"
    if not frame_path.exists():
        return

    arr = np.array(Image.open(frame_path).convert("RGBA"))
    h, w = arr.shape[:2]
    alpha = arr[:, :, 3]
    dark = alpha < 40

    visited = np.zeros((h, w), dtype=bool)
    outer = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if dark[y, x] and not visited[y, x]:
                queue.append((x, y))
                visited[y, x] = True
                outer[y, x] = True

    for y in range(h):
        for x in (0, w - 1):
            if dark[y, x] and not visited[y, x]:
                queue.append((x, y))
                visited[y, x] = True
                outer[y, x] = True

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[ny, nx] and dark[ny, nx]:
                visited[ny, nx] = True
                outer[ny, nx] = True
                queue.append((nx, ny))

    window = dark & ~outer
    mask = np.where(window, 255, 0).astype(np.uint8)
    Image.fromarray(mask, mode="L").save(mask_path)


def remove_rings_holes(path: Path, max_threshold: int = 55) -> tuple[int, int]:
    """Remove baked-in black fill inside ring holes (not caught by per-channel key)."""
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)
    mx = rgb.max(axis=2)
    dark = mx <= max_threshold
    arr[:, :, 3] = np.where(dark, 0, arr[:, :, 3])
    Image.fromarray(arr).save(path)
    return int(dark.sum()), h * w


def remove_black_global(path: Path, threshold: int = 42) -> tuple[int, int]:
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3].astype(np.int16)
    dark = (rgb[:, :, 0] <= threshold) & (rgb[:, :, 1] <= threshold) & (rgb[:, :, 2] <= threshold)
    arr[:, :, 3] = np.where(dark, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(path)
    return int(dark.sum()), h * w


if __name__ == "__main__":
    for name in FILES:
        file_path = ASSETS / name
        if not file_path.exists():
            print(f"skip {name}")
            continue
        if name in GLOBAL_KEY_FILES:
            removed, total = remove_black_global(file_path)
            print(f"{name}: {removed}/{total} ({100 * removed / total:.1f}%)")
        elif name == "rings-illustration.png":
            removed, total = remove_black_bg(
                file_path,
                threshold=55,
                inner_seeds=INNER_SEED_FILES.get(name),
            )
            hole_removed, _ = remove_rings_holes(file_path)
            print(f"{name}: holes {hole_removed}, edge/seed {removed}/{total}")
        else:
            removed, total = remove_black_bg(
                file_path,
                inner_seeds=INNER_SEED_FILES.get(name),
            )
            print(f"{name}: {removed}/{total} ({100 * removed / total:.1f}%)")

    build_window_mask()
    print("window-mask.png updated")

    if EXCELLENCE.exists():
        for name in sorted(EXCELLENCE.glob("*.png")):
            if name.name.startswith("."):
                continue
            removed, total = remove_black_global(name)
            print(f"excellence/{name.name}: {removed}/{total} ({100 * removed / total:.1f}%)")
