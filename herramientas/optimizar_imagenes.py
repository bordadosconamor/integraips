#!/usr/bin/env python3
"""
Optimiza las fotografías del sitio INTEGRA IPS.

Uso:
    pip install Pillow
    python herramientas/optimizar_imagenes.py  CARPETA_ORIGINALES

Toma las fotos originales (JPG, PNG, WEBP o HEIC convertidas) desde CARPETA_ORIGINALES,
respetando la misma estructura de subcarpetas que assets/img (institucional/ y stock/),
y guarda versiones optimizadas en assets/img con:
  - lado mayor máximo de 1920 px (2400 px para la portada)
  - JPG progresivo calidad 82, sin metadatos (EXIF/GPS)
  - orientación corregida
El logotipo (logo.png, favicon.png) se copia sin recomprimir para no alterar su identidad.
"""
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Falta Pillow. Instale con:  pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "img"
KEEP_AS_IS = {"logo.png", "favicon.png"}
EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def optimizar(src: Path, dst: Path):
    dst.parent.mkdir(parents=True, exist_ok=True)
    if src.name.lower() in KEEP_AS_IS:
        dst.write_bytes(src.read_bytes())
        print(f"  copiado sin cambios  {dst.relative_to(ROOT)}")
        return
    maxside = 2400 if "hero" in src.stem or "portada" in src.stem else 1920
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "L"):
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1] if im.mode in ("RGBA", "LA") else None)
            im = bg
        im.thumbnail((maxside, maxside), Image.LANCZOS)
        out = dst.with_suffix(".jpg")
        im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    kb_in, kb_out = src.stat().st_size // 1024, out.stat().st_size // 1024
    print(f"  {out.relative_to(ROOT)}  {kb_in} KB -> {kb_out} KB")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    origen = Path(sys.argv[1]).resolve()
    if not origen.is_dir():
        sys.exit(f"No existe la carpeta: {origen}")
    n = 0
    for f in sorted(origen.rglob("*")):
        if f.suffix.lower() in EXTS:
            optimizar(f, DEST / f.relative_to(origen))
            n += 1
    print(f"Listo: {n} imagen(es) procesada(s).")


if __name__ == "__main__":
    main()
