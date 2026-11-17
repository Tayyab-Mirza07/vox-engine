"""Compare effects and music against the narrator, while speaking and in the gaps.
   python3 scripts/check-mix.py out/stems/<name>"""
import re, statistics, subprocess, sys
d = sys.argv[1]
def mom(path):
    out = subprocess.run(['ffmpeg', '-hide_banner', '-i', path, '-af', 'ebur128=metadata=1,ametadata=print:key=lavfi.r128.M', '-f', 'null', '-'], capture_output=True, text=True).stderr
    t = [float(x) for x in re.findall(r'pts_time:([\d.]+)', out)]
    m = [float(x) for x in re.findall(r'lavfi\.r128\.M=(-?[\d.]+|-inf)', out)]
    return list(zip(t, m))
v = {round(a, 1): b for a, b in mom(f'{d}/voice.wav')}
voice = statistics.median([b for b in v.values() if b > -30])
print(f'voice median {voice:.1f}')
for name in ['fx-ducked', 'music-ducked']:
    sp, gap = [], []
    for t, m in mom(f'{d}/{name}.wav'):
        (sp if v.get(round(t, 1), -120) > -30 else gap).append(m)
    rel = []
    for t, m in mom(f'{d}/{name}.wav'):
        vv = v.get(round(t, 1), -120)
        if vv > -30 and m > -70:
            rel.append(m - vv)
    rel.sort()
    if rel:
        print(f'{name:13s} vs voice at the same moment: median {statistics.median(rel):+.1f} dB  p95 {rel[int(len(rel) * 0.95)]:+.1f} dB  max {rel[-1]:+.1f} dB  louder-than-voice {sum(r > 0 for r in rel) / len(rel):.1%}')
    for label, a in [('speaking', sp), ('gaps', gap)]:
        a = [x for x in a if x > -70]
        if a:
            a.sort()
            p95 = a[int(len(a) * 0.95)]
            print(f'{name:13s} {label:8s} median {statistics.median(a) - voice:+.1f} dB  p95 {p95 - voice:+.1f} dB  max {a[-1] - voice:+.1f} dB (vs voice)')
