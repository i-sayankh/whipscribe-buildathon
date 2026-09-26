import { test, expect, type Page } from '@playwright/test';

// One test per confirmed Track 1 bug. Each test asserts what SHOULD happen,
// so it fails on the live site today and passes once the bug is fixed.
//
// Signed-out tests need nothing. Signed-in tests need, on your own account:
//   WS_STATE   path to a Playwright storageState file (sign in by hand, save it)
//   WS_JOB_ID  id of one of your own finished recordings (/view?id=...)
// The two upload tests also need WS_UPLOAD_FILE (your own short recording) and
// WS_ALLOW_UPLOAD=1, because they leave a stuck "Queued" job in your library.

const STATE = process.env.WS_STATE;
const JOB = process.env.WS_JOB_ID;
const signedIn = () => test.skip(!STATE || !JOB, 'needs WS_STATE and WS_JOB_ID');

const pageWiderThanScreen = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.visualViewport!.width);

test.describe('signed out', () => {
  test('docs: long endpoint paths wrap instead of widening the page @320', async ({ page }) => {
    await page.goto('/docs', { waitUntil: 'networkidle' });
    expect(await pageWiderThanScreen(page)).toBeLessThanOrEqual(0);
  });

  for (const tag of ['@390', '@1280']) {
    test(`pricing: highlighted Workspace perks read as one sentence, not two columns ${tag}`, async ({ page }) => {
      await page.goto('/pricing', { waitUntil: 'networkidle' });
      const split = await page.evaluate(() =>
        [...document.querySelectorAll('li.ai-perk-strong')].flatMap((li) => {
          const strong = li.querySelector('strong');
          const text = [...li.childNodes].find((n) => n.nodeType === 3 && n.textContent!.trim());
          if (!strong || !text) return [];
          const strongRange = document.createRange();
          strongRange.selectNodeContents(strong); // one rect per line, even inside a flex item
          const lines = strongRange.getClientRects();
          const range = document.createRange();
          range.selectNodeContents(text);
          // In running text, the words after <strong> continue on its last line.
          const continues = Math.abs(range.getClientRects()[0].top - lines[lines.length - 1].top) < 4;
          return continues ? [] : [li.textContent!.trim().slice(0, 40)];
        }),
      );
      expect(split).toEqual([]);
    });
  }
});

test.describe('signed in', () => {
  test.use({ storageState: STATE });

  test('reader: Overview heading is the recording name without the site suffix @412', async ({ page }) => {
    signedIn();
    await page.goto(`/view?id=${JOB}`, { waitUntil: 'networkidle' });
    await expect(page.locator('.ov-title')).not.toHaveText(/— Whipscribe$/);
  });

  test('reader: "In one minute" summary is not cut mid-word @412', async ({ page }) => {
    signedIn();
    await page.goto('/home', { waitUntil: 'networkidle' });
    const thesis: string = await page.evaluate(async (id) => {
      const r = await fetch(`/api/v1/jobs/${id}/overview`, { credentials: 'include' });
      return (await r.json()).overview.thesis;
    }, JOB);
    expect(thesis.trim()).toMatch(/[.!?…"”]$/);
  });

  test('reader: recording name in the desktop top bar is not cut when there is room @1280', async ({ page }) => {
    signedIn();
    await page.goto(`/view?id=${JOB}`, { waitUntil: 'networkidle' });
    const cut = await page.evaluate(() => {
      const el = [...document.querySelectorAll('strong')].find((e) => e.getBoundingClientRect().top < 50 && e.getBoundingClientRect().width > 0)!;
      return el.scrollWidth - el.clientWidth;
    });
    expect(cut).toBeLessThanOrEqual(1);
  });

  test('credits: signed-in page does not scroll sideways on a phone @390', async ({ page }) => {
    signedIn();
    await page.goto('/credits', { waitUntil: 'networkidle' });
    expect(await pageWiderThanScreen(page)).toBeLessThanOrEqual(0);
  });

  test('reader: a recording that does not exist gets one clear state @412', async ({ page }) => {
    signedIn();
    await page.goto('/view?id=00000000-0000-0000-0000-000000000000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    const body = page.locator('body');
    await expect(body).not.toContainText('transcript still ready');
    await page.locator('#tab-transcript').click();
    await expect(body).not.toContainText('invalid job_id');
    await expect(page.getByText('Loading…', { exact: true })).toHaveCount(0);
  });

  test.describe('upload (leaves a stuck job; opt in)', () => {
    test.skip(!process.env.WS_ALLOW_UPLOAD || !process.env.WS_UPLOAD_FILE, 'needs WS_ALLOW_UPLOAD=1 and WS_UPLOAD_FILE');

    const startUpload = async (page: Page) => {
      // Never send /commit: this is what a closed tab or lost connection does.
      await page.route('**/api/v1/uploads/*/commit', (r) => r.abort());
      await page.goto('/home', { waitUntil: 'networkidle' });
      const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByText('Upload files', { exact: true }).first().click()]);
      await chooser.setFiles(process.env.WS_UPLOAD_FILE!);
      await page.getByRole('button', { name: /Start transcribing/ }).click();
      await page.waitForTimeout(4000);
    };

    test('upload: progress is visible on screen while the file uploads @390', async ({ page }) => {
      signedIn();
      await startUpload(page);
      const { rowBottom, tabsTop } = await page.evaluate(() => ({
        rowBottom: document.querySelector('.file-row.pending')!.getBoundingClientRect().bottom,
        tabsTop: document.querySelector('.ws-tabs-mobile')!.getBoundingClientRect().top,
      }));
      expect(rowBottom).toBeLessThanOrEqual(tabsTop);
    });

    test('upload: an upload that never finishes does not stay "Queued" in the library @412', async ({ page }) => {
      signedIn();
      await startUpload(page);
      await page.unroute('**/api/v1/uploads/*/commit');
      await page.reload({ waitUntil: 'networkidle' });
      const stuck = await page.evaluate(async () => {
        const r = await fetch('/api/v1/jobs?limit=25&offset=0&sort=created&dir=desc', { credentials: 'include' });
        const { jobs } = await r.json();
        return jobs.filter((j: any) => j.status === 'queued' && /^original\./.test(j.filename) && Date.now() / 1000 - j.created_at < 120).length;
      });
      expect(stuck).toBe(0);
    });
  });
});
