#!/usr/bin/env bash
# Assemble the final 9:16 reel from two separately generated 9:16 clips.
# Usage: ./compose.sh left.mp4 right.mp4 [music.mp3] [out.mp4]
#   left.mp4  = "treats symptoms" clip (water never stops)
#   right.mp4 = "treats the cause" clip (water stops after the valve turns)
# Each clip is scaled to 540x960 and placed side by side between the title and labels.
# Clip audio is panned to its side; optional music is mixed underneath at low volume.
set -euo pipefail
L=${1:?left clip}; R=${2:?right clip}; M=${3:-}; OUT=${4:-symptoms-vs-cause-reel.mp4}
DIR=$(cd "$(dirname "$0")" && pwd)
BG=0xE9EEF2
has_audio() { ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$1" | grep -q .; }

V="[0:v]trim=0:10,setpts=PTS-STARTPTS,scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=30[l];\
[1:v]trim=0:10,setpts=PTS-STARTPTS,scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=30[r];\
color=c=$BG:s=1080x1920:d=10:r=30[bg];[bg][l]overlay=0:480[a];[a][r]overlay=540:480[b];\
[b][2:v]overlay=0:0,format=yuv420p[v]"
INPUTS=(-i "$L" -i "$R" -loop 1 -t 10 -i "$DIR/text-overlay-1080x1920.png")
A=""; MIX=()
if has_audio "$L"; then A+="[0:a]atrim=0:10,pan=stereo|c0=c0|c1=0.25*c0[al];"; MIX+=("[al]"); fi
if has_audio "$R"; then A+="[1:a]atrim=0:10,pan=stereo|c0=0.25*c0|c1=c0[ar];"; MIX+=("[ar]"); fi
if [ -n "$M" ]; then INPUTS+=(-i "$M"); A+="[3:a]atrim=0:10,volume=0.25,afade=t=out:st=9:d=1[am];"; MIX+=("[am]"); fi
MAP=(-map "[v]")
if [ ${#MIX[@]} -gt 0 ]; then
  A+="$(IFS=; echo "${MIX[*]}")amix=inputs=${#MIX[@]}:normalize=0,atrim=0:10[aout]"
  V="$V;$A"; MAP+=(-map "[aout]" -c:a aac -b:a 192k)
fi
ffmpeg -y "${INPUTS[@]}" -filter_complex "$V" "${MAP[@]}" -t 10 -c:v libx264 -crf 18 -preset medium -movflags +faststart "$OUT"
echo "Wrote $OUT"
