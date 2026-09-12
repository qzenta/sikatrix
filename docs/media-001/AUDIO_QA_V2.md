# AUDIO_QA_V2.md — Technical Audio QA, v2

File: `audio/master/The_R2_podcast_v2.m4a`. Independent fresh technical
QA (ffprobe/ffmpeg, same method as v1) — not assumed carried over from
v1's result.

| Characteristic | v1 (original master) | v2 (regenerated) |
|---|---|---|
| Duration | 21:39.4 | 20:18.1 |
| Container | mov,mp4,m4a (M4A brand) | mov,mp4,m4a (dash/iso6mp41 brand — Google export) |
| Codec | AAC-LC mono | AAC-LC **stereo** |
| Sample rate | 44100 Hz | 44100 Hz |
| Bitrate | ~66 kbps | ~257 kbps |
| Integrated loudness | -24.96 LUFS | -24.92 LUFS |
| Loudness range | 6.10 LU | 5.70 LU |
| True peak | -1.63 dBFS | -4.76 dBFS (more headroom) |
| Clipping | None | None |
| Silence (>1s gaps) | One, ~1.02s at 10:22 | One, ~1.44s at 5:35 |
| Encoding integrity | probe_score 100, clean decode | probe_score 100, clean decode |

v2 is stereo and encoded at a much higher bitrate than v1 (consistent
with a fresh NotebookLM export using different default settings, not a
defect). No clipping in either file. Both have exactly one natural pause
over 1 second, consistent with normal conversational spoken-word audio,
not a dropout.

**Technical audio QA (v2): PASS.**

Note: before this file is adopted as the distribution master, confirm the
double `.m4a.m4a` extension on the supplied filename is renamed to a
single `.m4a` — handled when committing to `audio/master/`.
