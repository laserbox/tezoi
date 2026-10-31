"""Convert a Photara/3DGS binary PLY to a browser-friendly .splat preview."""
import argparse
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('input')
parser.add_argument('output')
parser.add_argument('--stride', type=int, default=2)
args = parser.parse_args()
with open(args.input, 'rb') as f:
    header = b''
    while not header.endswith(b'end_header\n'):
        byte = f.read(1)
        if not byte:
            raise ValueError('Invalid PLY header')
        header += byte
lines = header.decode('ascii').splitlines()
count = int(next(line.split()[-1] for line in lines if line.startswith('element vertex ')))
properties = [line.split()[-1] for line in lines if line.startswith('property float ')]
fields = {name: i for i, name in enumerate(properties)}
source = np.memmap(args.input, dtype='<f4', mode='r', offset=len(header), shape=(count, len(properties)))
selected = source[::args.stride]
out = np.empty(len(selected), dtype=[('position','<f4',3),('scale','<f4',3),('color','u1',4),('rotation','u1',4)])
out['position'] = selected[:, [fields[x] for x in ('x','y','z')]]
out['scale'] = np.exp(np.clip(selected[:, [fields[f'scale_{i}'] for i in range(3)]], -20, 10))
out['color'][:,:3] = np.clip((0.5 + 0.28209479177387814 * selected[:, [fields[f'f_dc_{i}'] for i in range(3)]]) * 255, 0, 255).astype('u1')
opacity = np.clip(selected[:, fields['opacity']], -80, 80)
out['color'][:,3] = (255 / (1 + np.exp(-opacity))).astype('u1')
q = selected[:, [fields[f'rot_{i}'] for i in range(4)]]
q = q / np.maximum(np.linalg.norm(q, axis=1, keepdims=True), 1e-10)
out['rotation'] = np.clip(q * 128 + 128, 0, 255).astype('u1')
out.tofile(args.output)
print(f'{len(out):,} splats, {out.nbytes:,} bytes')
