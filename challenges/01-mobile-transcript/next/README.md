# Challenge 01 — the next pass on the phone reader

Sayan Khutia · [@i-sayankh](https://github.com/i-sayankh)

I studied the 14 screens in `../after/` and used the live reader on my own
account (one 1 min 36 s recording, phone and laptop, emulated with
Playwright plus my iPhone 16). The Track 1 issues I filed on the way
(#155–#162) are linked where they come from the same screens.

## What is wrong now

Measured on the 320 × 568 screen in `01-reader-320.png` (CSS px):
header rows 118, "Keep reading" bar 55, player 95, "Audio unavailable" line
20. **About 290 of 568 px (51 %) is chrome; the transcript gets the rest.**

| Screen | What is wrong |
|---|---|
| 01–03 Reader | Two header rows for a file name and "1m 44s · EN ·" (the trailing "·" is an empty third field). Text is justified with hyphenation in a narrow column ("be- cause", wide gaps). Lines break in the middle of sentences, each with its own timestamp ("…several people have a hard" / 0:07 "stop at the top of the hour"), so a sentence is split across two rows and two timestamps. The player is fully drawn with a seek bar, three buttons, "00:00 / 00:00" and a red "Audio unavailable" line, although it cannot play. |
| 04 Scrolled | Right that the header scrolls away. But the bar and the dead player stay, still ~170 px. |
| 05 Preview boundary | The end note is good. Under it, half a screen of empty space, then the same "Keep reading" bar repeats what the note just said. |
| 06 Search | Works (count, ↑ ↓, pinned match). But it adds two rows at the top while the bottom stack stays, so at 320 the transcript shrinks to about three lines. |
| 07 Download | A full-height sheet with its own look (monospace buttons, grey section rules). "Copy" is not in it; copy lives in the More menu. |
| 08 More menu | Nine items, four of them duplicates of something on screen: Home (= back arrow), Copy transcript, Timestamps: shown (= reading settings), Sign in (= Keep reading). Delete sits in the same list as Home with no gap. Signed in it grows to 11 and the last two sit under the player (#149). |
| 09 Reading settings | A third panel style: no title, no close button, two settings. |
| 10 Selection | A dark popover that covers the next line, with Copy and Play. No way to share the quote with its timestamp, which is what people select a line for. |
| 11 Sign-up | A fourth panel style: a centred modal. |
| 12 Load failure | "Couldn't load transcript (HTTP 503)." is the system talking. Tabs, search and download stay active and lead nowhere. |
| 13 Not on this account | Title stuck on "Loading…", a default-blue "Sign in" link, active tabs. The same pattern on the live site tells people a missing recording is "still ready" (#156). |
| 14 Desktop | Works, but a finished file shows "QUEUED" in the sidebar, the 🎓 player button has no label, and the preview banner pushes the first line down 330 px. |

Missing entirely:
- **Processing.** No screen for "still transcribing". On the live site, the only sign of an upload on a short phone is under the tab bar (#159), and a stopped upload shows "Queued" for 24 minutes (#158).
- **Speakers.** Every screen is one speaker. My own recording shows the same: nothing tells you who is talking.

## What is already right, and kept

- **Three tabs (Transcript · Summary · AI Chat).** They are the three jobs people come for. (The live site now calls the second one "Overview"; I keep one name per job.)
- **Timestamps in a gutter.** They are good for scanning and a tap target to play. Kept, one per paragraph instead of one per fragment.
- **Search behaviour.** The count, ↑ ↓ and the pinned current match. Kept as is, only moved so the keyboard does not fight the bottom bars.
- **The download sheet's content.** Formats, translated subtitles, Drive, summary. The contents are right; only the look and the missing Copy change.
- **The header scrolls away while reading.** Kept.
- **The inline "End of free preview — 48 % read" note.** It is the honest version of the upsell, so it stays and the repeating bar goes.
- **The brand.** Ink, green accent, Inter, and mono timestamps. Tokens are taken from the live reader.

## Proposed direction

The rule for this pass: **remove or merge first; add only what is missing.**

Removed or merged (9):

1. **One sheet pattern for everything.** Search results, Export, Reading options, More and Sign-up all use the same bottom sheet: handle, title, ✕, Esc and scrim to close, focus trapped, 85 % max height. Four panel styles become one.
2. **Copy + Download → one "Export" sheet.** Copy text sits first, then the four file formats. Subtitles, Drive and summary go under "More formats", closed by default.
3. **More menu: 9 → 4.** Rename, File details, Quiz me, then a gap, then Delete. Home, Copy, Timestamps and Sign in go, because each already exists on screen.
4. **Reading settings stop being a panel.** Text size, timestamps and speakers become a "View" row at the top of the More sheet.
5. **"Keep reading" bar + player → one dock of ≤ 64 px.** Mini player (play, time, speed) with a thin preview line and a "Keep reading" button in the same row. Tap to expand the full player.
6. **No audio, no player.** When audio is unavailable the dock shows one quiet line, "Audio isn't available for this file", with no dead controls.
7. **Paragraphs, not fragments.** Consecutive segments from the same speaker join into one paragraph with one timestamp. Tapping any sentence still plays from it.
8. **Left-aligned text, no hyphenation.**
9. **Error and no-access screens drop the controls that can't work.** One message in the user's words, one action.

Added (4):

1. **Processing screen.** "Still transcribing — about 2 minutes left", with a progress line. Summary and chat say they are coming. A note that you can close the page, and whether that is safe right now ("Keep this page open until the upload finishes").
2. **Speakers.** A name chip at each turn with a colour dot and a tap to rename. Shown as a four-person meeting at 320 px.
3. **After selecting a line:** a bottom action bar (not a popover over the text) with Copy with timestamp · Share quote · Play from here.
4. **Keyboard-up behaviour.** With the search keyboard open, the dock hides and the search field and results stay at the top.

Screens I will build: reader (320/375/390), processing, four speakers at 320, search, the one sheet pattern (Export shown), More (reduced), selection, preview boundary + keyboard, load failure, not on this account, desktop 1280, and a compare page with the current PNG next to each new screen.

## Answers to the eight questions

**1. What is the one thing a person on a phone came here to do, and how many taps away is it now?**
To read the transcript and find the part they need. Reading is 0 taps today, but only in half the screen. Finding a moment takes 1 tap (search). Getting the text out takes 2 taps and a scroll (Download), or 2 taps in a different place (More → Copy). In the next pass, reading gets about 90 px more, and copying or exporting is 1 tap into one sheet.

**2. The "Keep reading" bar and the player take the bottom of the screen. Is that the right trade, and what happens when the keyboard is up?**
Not as two bars. A dead player is never worth 95 px, and the bar repeats the inline preview note. The next pass uses one dock of 64 px or less, and none at all when there is nothing to play or buy. With the keyboard up the dock hides, and search stays at the top where the eye already is.

**3. The More menu has nine items. Which belong there, which on the screen, and which should not exist on a phone?**
In More: Rename, File details, Quiz me, then Delete after a gap (four items). On the screen: search and Export (with copy). Not on a phone, because they duplicate something visible: Home, Copy transcript, Timestamps, Sign in. Reading settings become a View row in the same sheet.

**4. Search, download, settings: three ways to open a panel. Should they feel like one?**
Yes: one bottom-sheet component with the same handle, title, close, focus and height rules. Sign-up and the top-up dialog should use it too; the top-up dialog is broken today (#155) partly because it is its own separate component.

**5. What does the reader look like while the transcript is still processing?**
The same reader with an honest placeholder: file name, a progress line with "about N minutes left", greyed tabs that say what will appear ("Summary is written when the transcript is ready"), and whether it is safe to close the page. See `screens/02-processing.html`.

**6. Show a meeting with four speakers at 320 px.**
Paragraphs by speaker turn. A short name chip (colour dot and name) starts each turn, with no repeated name on the lines that follow. The timestamp moves beside the chip, so the text keeps the full width at 320. Tapping a chip renames the speaker everywhere. See `screens/03-four-speakers-320.html`.

**7. Text selection on a phone: what should happen after you select a line?**
A bottom action bar replaces the dock while the selection lasts, with Copy with timestamp · Share quote (a link that opens at that second) · Play from here. It doesn't cover the text the way the popover does, and it disappears when the selection ends.

**8. The desktop page is unchanged. Should it be?**
Mostly yes. The desktop layout works, and a phone pass should not rewrite it. The shared fixes carry over: paragraphs by speaker, one Export surface (a popover on desktop), no "QUEUED" on finished files, and a label on the 🎓 button. See `screens/11-desktop-1280.html`.
