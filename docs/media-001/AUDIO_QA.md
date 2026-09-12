# AUDIO_QA.md — Technical Audio QA (MEDIA-001)

Master file: `audio/master/The_R2_podcast.m4a` (copied verbatim from the
source handoff on 12 Sep 2026; original never modified).

## Technical audio QA — measured, not estimated

Tooling: ffprobe / ffmpeg 8.1.1 (loudnorm + silencedetect filters), run
directly against the master file.

| Characteristic | Handoff preliminary value | Measured value | Match |
|---|---|---|---|
| Duration | ~21:39 | 21:39.4 (1299.4s) | ✅ |
| Container | M4A / MPEG-4 | mov,mp4,m4a,3gp,3g2,mj2 | ✅ |
| Codec | AAC | AAC-LC (mp4a.40.2) | ✅ |
| Sample rate | 44.1 kHz | 44100 Hz | ✅ |
| Channels | Mono | 1 (mono) | ✅ |
| Encoded bitrate | ~66 kbps | 66.1 kbps (stream), 67.5 kbps (container) | ✅ |
| Integrated loudness | ~-24.9 LUFS | -24.96 LUFS | ✅ |
| Loudness range | ~6.2 LU | 6.10 LU | ✅ |
| True peak | ~-1.6 dBFS | -1.63 dBFS | ✅ |

All preliminary values in the CC handoff (Section 6) are confirmed by
direct measurement.

## Additional checks

- **Clipping:** none — true peak (-1.63 dBFS) has clear headroom below 0 dBFS.
- **Silence:** one gap of ~1.02s detected at 10:22 (622.1s–623.2s,
  threshold -40dB). Consistent with a natural spoken pause, not a dropout
  or encoding fault. No other silence above 1s detected across the full
  21:39 runtime.
- **Encoding integrity:** ffprobe reports `probe_score=100`, file decodes
  cleanly start to finish with ffmpeg (no decode errors/warnings emitted).
- **Anomalies:** none observed in waveform/loudness analysis.

**Technical audio QA: PASS.**

## Editorial / human listening QA

Not performed by this worker — no playback/listening facility was used,
and per AGENTS.md this status must not be conflated with technical QA.

**Editorial listening QA: PENDING (human action required).**
