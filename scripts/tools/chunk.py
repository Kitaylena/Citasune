import sys, os
# usage: chunk.py <file> [outdir] [prefix]
# splits <file> into 19MiB parts named <prefix>00,<prefix>01,... returns count
CHUNK = 19 * 1024 * 1024
src = sys.argv[1]
outdir = sys.argv[2] if len(sys.argv) > 2 else os.path.dirname(src)
prefix = sys.argv[3] if len(sys.argv) > 3 else os.path.basename(src)
os.makedirs(outdir, exist_ok=True)
n = 0
with open(src, "rb") as f:
    while True:
        b = f.read(CHUNK)
        if not b: break
        open(os.path.join(outdir, prefix + str(n).zfill(2)), "wb").write(b)
        n += 1
print(n)
