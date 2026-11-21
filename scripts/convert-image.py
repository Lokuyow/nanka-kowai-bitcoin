"""Convert a still image without overwriting the source."""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path, help="Destination (.avif, .webp, or .jpg)")
    parser.add_argument("--width", type=int, help="Maximum width in pixels")
    parser.add_argument("--quality", type=int, default=80, help="Encoder quality (1-100)")
    args = parser.parse_args()

    if args.source.resolve() == args.output.resolve():
        parser.error("The output must be different from the source.")
    if args.width is not None and args.width < 1:
        parser.error("--width must be positive.")
    if not 1 <= args.quality <= 100:
        parser.error("--quality must be between 1 and 100.")

    suffix = args.output.suffix.lower()
    options = {
        ".avif": {"speed": 4, "subsampling": "4:4:4"},
        ".webp": {"method": 6},
        ".jpg": {"optimize": True},
    }
    if suffix not in options:
        parser.error("Use .avif, .webp, or .jpg for the output.")

    with Image.open(args.source) as original:
        if getattr(original, "is_animated", False):
            parser.error("This script expects a still image.")
        image = ImageOps.exif_transpose(original)
        if suffix == ".jpg" and image.mode not in {"L", "RGB", "CMYK"}:
            if image.has_transparency_data:
                parser.error("Use AVIF or WebP for images with transparency.")
            image = image.convert("RGB")
        if args.width:
            image.thumbnail((args.width, image.height), Image.Resampling.LANCZOS)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        image.save(
            args.output,
            quality=args.quality,
            icc_profile=image.info.get("icc_profile"),
            **options[suffix],
        )

    print(
        f"{args.output}: {image.width}x{image.height}, {args.output.stat().st_size:,} bytes "
        f"(source: {args.source.stat().st_size:,} bytes)"
    )


if __name__ == "__main__":
    main()
