Same problem on the **Paste link** path, signed out (emulated iPhone 14 in Playwright WebKit, and a 1280 px laptop in Chromium):

1. whipscribe.com → Paste → `https://example.com/not-audio` → Enter.
2. The error "We cannot fetch audio from example.com. Paste the episode's MP3 link or the show's RSS feed instead…" appears in plain grey text under a **full-width green progress bar that reads "0 %"**, and the three steps (Upload audio / Transcribe / Read it here) stay neutral.
3. The pasted link is cleared, so it has to be pasted again to fix it.

So the file path shows a full bar at 100 % and the link path a full bar at 0 %; in both, the progress UI stays up after a failure. Probably one fix covers both: on error, hide the bar and keep what the user entered.

![Paste-link error under a full green bar reading 0 %](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/02-mobile-390-paste-link-error.png)
