#!/usr/bin/env python3
"""Compress and resize images in the articles directory.

Supports JPEG, PNG, WebP, and HEIC/HEIF formats.
HEIC images are converted to JPEG automatically.
PNG images without transparency are also converted to JPEG.

Usage:
    python compress_images.py [directory] [--quality N] [--max-size N] [--dry-run]

Options:
    directory    Target directory (default: current directory)
    --quality    JPEG quality 1-95 (default: 80)
    --max-size   Max width/height in px (default: 1200)
    --dry-run    Show what would be done without changing files
    --min-kb     Skip files smaller than this KB (default: 200)
"""

import argparse
import os
import sys
from pathlib import Path

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIC_SUPPORTED = True
except ImportError:
    HEIC_SUPPORTED = False

from PIL import Image, ImageOps

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}


def compress_image(path: Path, max_size: int, quality: int, dry_run: bool) -> None:
    if not HEIC_SUPPORTED and path.suffix.lower() in {".heic", ".heif"}:
        print(f"  [スキップ] {path.name}: pillow-heif が未インストール")
        return

    original_size = path.stat().st_size

    with Image.open(path) as img:
        try:
            img = ImageOps.exif_transpose(img)
        except Exception:
            pass

        img.thumbnail((max_size, max_size), Image.LANCZOS)

        is_heic = path.suffix.lower() in {".heic", ".heif"}
        is_png_with_alpha = (
            path.suffix.lower() == ".png"
            and (img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info))
        )

        if is_png_with_alpha:
            # 透過PNGはPNGのまま保存
            save_path = path
            fmt = "PNG"
            save_kwargs = {"optimize": True}
        else:
            # HEIC / 不透明PNG → JPEG に変換
            save_path = path.with_suffix(".jpg")
            fmt = "JPEG"
            img = img.convert("RGB")
            save_kwargs = {"quality": quality, "optimize": True}

        if dry_run:
            print(f"  [dry-run] {path.name} → {save_path.name} ({original_size//1024}KB → 圧縮後)")
            return

        img.save(save_path, fmt, **save_kwargs)

    new_size = save_path.stat().st_size
    ratio = (1 - new_size / original_size) * 100
    suffix = f" ({path.name} → {save_path.name})" if save_path != path else ""
    print(f"  {path.name}{suffix}: {original_size//1024}KB → {new_size//1024}KB ({ratio:.0f}% 削減)")

    # macOS の大文字小文字非区別FSでは .JPG と .jpg が同一ファイルになるため samefile で確認
    if save_path != path and not os.path.samefile(path, save_path):
        path.unlink()


def main():
    parser = argparse.ArgumentParser(description="記事内の画像を圧縮します")
    parser.add_argument("directory", nargs="?", default=".", help="対象ディレクトリ")
    parser.add_argument("--quality", type=int, default=80, help="JPEG品質 (default: 80)")
    parser.add_argument("--max-size", type=int, default=1200, help="最大幅/高さ px (default: 1200)")
    parser.add_argument("--min-kb", type=int, default=200, help="この KB 未満はスキップ (default: 200)")
    parser.add_argument("--dry-run", action="store_true", help="変更せずに確認のみ")
    args = parser.parse_args()

    base = Path(args.directory).resolve()
    if not base.exists():
        print(f"ディレクトリが見つかりません: {base}")
        sys.exit(1)

    targets = [
        p for p in base.rglob("*")
        if p.suffix.lower() in EXTENSIONS and p.stat().st_size > args.min_kb * 1024
    ]

    if not targets:
        print("圧縮対象の画像が見つかりませんでした。")
        return

    if not HEIC_SUPPORTED:
        print("警告: pillow-heif が未インストールのため HEIC は処理されません。")
        print("  インストール: pip install pillow-heif\n")

    mode = "[dry-run] " if args.dry_run else ""
    print(f"{mode}{len(targets)} 件の画像を処理します:\n")

    for p in sorted(targets):
        compress_image(p, args.max_size, args.quality, args.dry_run)

    print("\n完了しました。")


if __name__ == "__main__":
    main()
