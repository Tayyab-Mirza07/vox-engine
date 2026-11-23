#!/usr/bin/env bash
# Assembles the "Gone" long video: overlays each mastered Short (CTA trimmed) onto its case-file background,
# joins intro / cards / clips / outro, then loudness-normalizes to -14 LUFS / -1.5 dBTP.
set -euo pipefail
cd "$(dirname "$0")/.."
D=out/gone
IDS=(sodder flight19 flannan celeste dbcooper alcatraz hoffa mh370)
for i in 0 1 2 3 4 5 6 7; do
  [ -f $D/clip$i.mp4 ] && continue
  frames=$(python3 -c "import json;print(json.load(open('$D/clips.json'))[$i]['frames'])")
  dur=$(python3 -c "print($frames/30)")
  fo=$(python3 -c "print(max(0,$frames/30-0.5))")
  ffmpeg -y -hide_banner -loglevel error -loop 1 -framerate 30 -i $D/bg$i.png -i public/gone/clips/${IDS[$i]}.mp4 \
    -filter_complex "[1:v]fps=30,trim=end_frame=$frames,setpts=PTS-STARTPTS,scale=563:1000[v];[0:v][v]overlay=182:40,format=yuv420p[o];[1:a]atrim=0:$dur,asetpts=PTS-STARTPTS,afade=t=in:d=0.15,afade=t=out:st=$fo:d=0.5,aresample=48000[a]" \
    -map "[o]" -map "[a]" -frames:v $frames -c:v libx264 -preset veryfast -crf 20 -r 30 -c:a aac -b:a 192k -ac 2 $D/clip$i.tmp.mp4
  mv $D/clip$i.tmp.mp4 $D/clip$i.mp4
  echo "clip $i ok"
done
# normalise the Remotion sections to the same stream format
for n in intro card0 card1 card2 card3 card4 card5 card6 card7 outro; do
  [ -f $D/n_$n.mp4 ] && continue
  ffmpeg -y -hide_banner -loglevel error -i $D/$n.mp4 -c:v libx264 -preset veryfast -crf 20 -r 30 -pix_fmt yuv420p -af aresample=48000 -c:a aac -b:a 192k -ac 2 $D/n_$n.tmp.mp4
  mv $D/n_$n.tmp.mp4 $D/n_$n.mp4
done
: > $D/list.txt
echo "file 'n_intro.mp4'" >> $D/list.txt
for i in 0 1 2 3 4 5 6 7; do echo "file 'n_card$i.mp4'" >> $D/list.txt; echo "file 'clip$i.mp4'" >> $D/list.txt; done
echo "file 'n_outro.mp4'" >> $D/list.txt
ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i $D/list.txt -c copy $D/joined.mp4
ffmpeg -hide_banner -i $D/joined.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2> $D/ln.txt
python3 - <<'PY'
import json,subprocess
t=open('out/gone/ln.txt').read(); j=json.loads(t[t.rindex('{'):t.rindex('}')+1])
af=f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true"
subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i','out/gone/joined.mp4','-c:v','copy','-af',af,'-ar','48000','-c:a','aac','-b:a','192k','-movflags','+faststart','out/gone-final.mp4'],check=True)
PY
echo "wrote out/gone-final.mp4"
