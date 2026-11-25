#!/usr/bin/env python3
"""Find the beat grid of a music track (numpy only): spectral-flux onsets -> tempo by autocorrelation -> phase-aligned grid.
usage: beats.py <music.mp3> <out.json> [min_bpm max_bpm]"""
import json, subprocess, sys
import numpy as np
src, out = sys.argv[1], sys.argv[2]
lo, hi = (float(sys.argv[3]), float(sys.argv[4])) if len(sys.argv) > 4 else (70.0, 150.0)
SR, HOP, N = 22050, 256, 1024
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32)
frames = 1 + (len(x) - N) // HOP
win = np.hanning(N).astype(np.float32)
idx = np.arange(N)[None, :] + HOP * np.arange(frames)[:, None]
spec = np.abs(np.fft.rfft(x[idx] * win, axis=1))
spec = np.log1p(spec * 10)
flux = np.maximum(0, np.diff(spec, axis=0)).sum(axis=1)
flux = np.concatenate([[0], flux])
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
fps = SR / HOP
# tempo: autocorrelation over plausible lags
ac = np.correlate(flux, flux, mode='full')[len(flux) - 1:]
lags = np.arange(len(ac))
bpm = 60 * fps / np.maximum(lags, 1)
ok = (bpm >= lo) & (bpm <= hi)
lag = lags[ok][np.argmax(ac[ok])]
# refine with parabolic interpolation
if 0 < lag < len(ac) - 1:
    a, b, c = ac[lag - 1], ac[lag], ac[lag + 1]
    lag = lag + 0.5 * (a - c) / (a - 2 * b + c + 1e-9)
period = lag / fps
# phase: choose offset maximizing summed onset strength on the grid
best, phase = -1e9, 0.0
for off in np.linspace(0, period, 64, endpoint=False):
    ts = np.arange(off, len(x) / SR, period)
    s = flux[np.clip((ts * fps).astype(int), 0, len(flux) - 1)].sum()
    if s > best:
        best, phase = s, off
beats = [round(float(t), 3) for t in np.arange(phase, len(x) / SR, period)]
# strong beats: local onset peaks above the 80th percentile, snapped to the grid
thr = np.percentile(flux, 80)
strong = [t for t in beats if flux[min(len(flux) - 1, int(t * fps))] > thr]
json.dump({'bpm': round(60 / period, 2), 'period': round(period, 4), 'beats': beats, 'strong': strong}, open(out, 'w'))
print('bpm', round(60 / period, 2), 'beats', len(beats), 'strong', len(strong), 'first', beats[:4])
