**Device and browser**
Emulated iPhone 14, 390×844 (Playwright WebKit); also 320, 412 and 1280 px (Playwright Chromium). Signed out.

**Page**
https://whipscribe.com/pricing → Workspace card

**Steps**
1. Open the pricing page.
2. Look at the two highlighted perks in the Workspace card: "Unlimited transcription — files, links, recordings, any length" and "Your own API keys, no daily cap".

**Expected**
Each perk reads as one sentence that wraps normally, like the other perks in the list.

**What happened**
Each splits into two columns: the bold words on the left ("Unlimited / transcription"), the rest of the sentence in a narrow column on the right ("— files, / links, / recordings, / any length"). Cause: `li.ai-perk` is `display: flex; gap: 10px`, so the `<strong>` and the text after it become two separate flex items. Setting `li.ai-perk { display: block }` in the browser puts the sentence back together.

Repro: [`track-1/i-sayankh/repro/bugs.spec.ts` › "pricing: highlighted Workspace perks read as one sentence, not two columns"](https://github.com/i-sayankh/whipscribe-buildathon/blob/track-1-evidence/track-1/i-sayankh/repro/bugs.spec.ts)

**Screenshot or recording**
![Workspace perks at 320 px: the bold phrase and the rest of the sentence in two columns](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/03-mobile-320-pricing-perk-rows-split.png)

![The same perks at 1280 px, same split](https://raw.githubusercontent.com/i-sayankh/whipscribe-buildathon/track-1-evidence/track-1/i-sayankh/screenshots/03-desktop-1280-pricing-perk-rows-split.png)

**How much it matters**
A small annoyance, but on the main paid plan: these are the first two lines anyone reads when deciding on Workspace, and they are the only broken lines on the page.
