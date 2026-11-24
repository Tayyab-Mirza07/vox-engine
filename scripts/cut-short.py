#!/usr/bin/env python3
"""Cut a short "one reveal" version out of a finished Short.
usage: cut-short.py <in.mp4> <out.mp4> start-end [start-end ...]   (seconds, in order of playback)
Covers the (now wrong) progress bar, joins the pieces with tiny audio fades, then loudnorms to -14 LUFS / -1.5 dBTP."""
import json, subprocess, sys
src, out, *segs = sys.argv[1:]
segs = [tuple(map(float, s.split('-'))) for s in segs]
parts, labels = [], ''
for k, (a, b) in enumerate(segs):
    d = b - a
    parts.append(f"[0:v]trim={a}:{b},setpts=PTS-STARTPTS[v{k}];[0:a]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.04,afade=t=out:st={d-0.06:.3f}:d=0.06[a{k}]")
    labels += f"[v{k}][a{k}]"
fc = ';'.join(parts) + f";{labels}concat=n={len(segs)}:v=1:a=1[cv][ca];[cv]drawbox=x=0:y=0:w=iw:h=12:color=black:t=fill[v]"
tmp = out + '.tmp.mp4'
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-filter_complex', fc, '-map', '[v]', '-map', '[ca]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000', tmp.replace('.mp4', '.mov')], check=True)
tmp = tmp.replace('.mp4', '.mov')
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(r[r.rindex('{'):r.rindex('}') + 1])
af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', tmp, '-c:v', 'copy', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], check=True)
subprocess.run(['rm', tmp])
print('wrote', out)
