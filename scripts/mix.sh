#!/usr/bin/env bash
# Final audio mix for an episode: voice on top, effects and music sidechain-ducked under it.
#   scripts/mix.sh <Composition> <out-name>
# Renders the video without sound plus three audio stems, then mixes and masters them with ffmpeg.
set -euo pipefail
COMP=$1; NAME=$2
BROWSER=${BROWSER:-/opt/pw-browsers/chromium}
mkdir -p out/stems/$NAME
if [ "${SKIP_VIDEO:-0}" != 1 ]; then
  npx remotion render src/index.tsx "$COMP" "out/$NAME-video.mp4" --muted --codec=h264 --crf=18 --browser-executable="$BROWSER" --log=error
fi
for st in voice fx music; do
  npx remotion render src/index.tsx "$COMP" "out/stems/$NAME/$st.wav" --codec=wav --props="{\"stem\":\"$st\"}" --browser-executable="$BROWSER" --log=error
done
S=out/stems/$NAME
FILTER="[0:a]asplit=3[v][vk1][vk2];\
[1:a][vk1]sidechaincompress=threshold=0.02:ratio=6:attack=5:release=250:makeup=1[fx];\
[2:a]${MUSIC_PRECOMP:+$MUSIC_PRECOMP,}volume=${MUSIC_GAIN:-1}[m];[m][vk2]sidechaincompress=threshold=${MUSIC_THRESHOLD:-0.015}:ratio=${MUSIC_RATIO:-8}:attack=15:release=${MUSIC_RELEASE:-450}:makeup=1[mu]"
# Ducked stems kept for level checks.
ffmpeg -v error -y -i $S/voice.wav -i $S/fx.wav -i $S/music.wav -filter_complex "$FILTER" -map "[fx]" $S/fx-ducked.wav -map "[mu]" $S/music-ducked.wav -map "[v]" $S/voice-out.wav
ffmpeg -v error -y -i "out/$NAME-video.mp4" -i $S/voice.wav -i $S/fx.wav -i $S/music.wav -filter_complex \
"[1:a]asplit=3[v][vk1][vk2];\
[2:a][vk1]sidechaincompress=threshold=0.02:ratio=6:attack=5:release=250:makeup=1[fx];\
[3:a]${MUSIC_PRECOMP:+$MUSIC_PRECOMP,}volume=${MUSIC_GAIN:-1}[m];[m][vk2]sidechaincompress=threshold=${MUSIC_THRESHOLD:-0.015}:ratio=${MUSIC_RATIO:-8}:attack=15:release=${MUSIC_RELEASE:-450}:makeup=1[mu];\
[v][fx][mu]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,alimiter=limit=0.79:level=false[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest "out/$NAME-final.mp4"
echo "wrote out/$NAME-final.mp4"
