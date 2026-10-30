import { expect, test, type Page } from "@playwright/test";
import { storyChapters } from "../lib/story";

async function openBook(page: Page) {
  if (new URL(page.url()).pathname !== "/our-story/") return;
  await page.getByRole("button", { name: "Open Matt & Sara’s storybook" }).click();
  await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "open");
}

test("book arrows stay inside the book and respect boundaries and rapid input", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  await openBook(page);
  const book = page.locator(".storyBook");
  const next = book.getByRole("button", { name: "Next page", exact: true });
  const previous = book.locator(".storyPagePrevious");
  const spread = page.locator(".storyBook > .storyBookSpread[data-active-chapter]");
  await expect(previous).toBeEnabled();
  await expect(page.getByRole("button", { name: /Replay/ })).toHaveCount(0);
  await expect(page.locator(".storyCopy h2, .storyChapterLinks, .storyComparison, .storyChapterOrnament")).toHaveCount(0);
  await next.click();
  await expect(book).toHaveAttribute("data-turning", "true");
  await book.press("ArrowRight");
  await book.press("ArrowRight");
  await expect(spread).toHaveAttribute("data-active-chapter", "new-york");
  await expect(book).toHaveAttribute("data-turning", "false");
  await expect(spread.locator("em")).toHaveText("just friends");
  await book.press("ArrowLeft");
  await expect(book).toHaveAttribute("data-turning", "false");
  await expect(spread).toHaveAttribute("data-active-chapter", "blacksburg");
  await expect(spread.locator(".storyScene")).toHaveAttribute("data-state", "still");
  for (const id of ["new-york", "home", "kyoto"]) {
    await next.click();
    await expect(book).toHaveAttribute("data-turning", "false");
    await expect(spread).toHaveAttribute("data-active-chapter", id);
  }
  const close = book.getByRole("button", { name: "Close book", exact: true });
  await expect(close).toBeEnabled();
  const bounds = await book.boundingBox();
  for (const arrow of [close, previous]) {
    const button = await arrow.boundingBox();
    expect(button!.x).toBeGreaterThanOrEqual(bounds!.x);
    expect(button!.y + button!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height);
  }
});

test("motion variants remain available through direct links without comparison controls", async ({ page }) => {
  for (const motion of ["gentle", "characters"]) {
    await page.goto(`/our-story/?motion=${motion}`);
    await openBook(page);
    await expect(page.locator(".storyExperience")).toHaveAttribute("data-motion", motion);
    await expect(page.locator(".storyComparison")).toHaveCount(0);
  }
});

test("scrolling chapters preserve every paragraph and load the storybook illustrations", async ({ page }) => {
  await page.goto("/our-story/scroll/");
  await openBook(page);
  for (const chapter of storyChapters) {
    const section = page.locator(`#${chapter.id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator(".storyParagraph")).toHaveText(chapter.text);
    await expect.poll(() => section.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  }
  await expect(page.locator(".storyParagraph em")).toHaveText("just friends");
});

test("reduced motion uses still illustrations and instant page changes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/our-story/?motion=characters");
  await openBook(page);
  await expect(page.locator(".storyBookSpread[data-active-chapter] .storyScene")).toHaveAttribute("data-state", "still");
  await expect(page.locator(".storyBookSpread[data-active-chapter] .storyBackground")).toBeVisible();
  expect(await page.locator(".storyArtwork").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.locator(".storyBook")).toHaveAttribute("data-turning", "false");
  await expect(page.locator(".storyBook > .storyBookSpread[data-active-chapter]")).toHaveAttribute("data-active-chapter", "new-york");
});

test("scenes pause offscreen and settle after one six-second playback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/scroll/?motion=characters");
  await openBook(page);
  const first = page.locator('#blacksburg .storyScene');
  await expect(page.locator(".storyExperience")).toHaveAttribute("data-motion", "characters");
  await expect(first).toBeVisible();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-state", "playing");
  await page.locator("#kyoto").scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-state", "paused");
  await first.scrollIntoViewIfNeeded();
  await expect(first.locator(".storyCandleGlow")).toHaveCSS("animation-play-state", "running");
  await expect(first).toHaveAttribute("data-state", "finished", { timeout: 10000 });
  await page.locator("#kyoto").scrollIntoViewIfNeeded();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveAttribute("data-state", "finished");
});

test("failed artwork leaves the story and navigation available", async ({ page }) => {
  await page.route("**/images/story/*", (route) => route.abort());
  await page.goto("/our-story/");
  await openBook(page);
  await expect(page.locator(".storyImageFallback")).toBeVisible();
  await expect(page.locator(".storyBook > .storyBookSpread[data-active-chapter] .storyParagraph")).toContainText("Over Shabbat dinners at Chabad");
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.locator(".storyBook > .storyBookSpread[data-active-chapter]")).toHaveAttribute("data-active-chapter", "new-york");
  await expect(page.locator(".storyBook > .storyBookSpread[data-active-chapter] .storyParagraph")).toContainText("Vin Sur Vingt");
});

test("a delayed later illustration does not block the first chapter or its own text", async ({ page }) => {
  let releaseImages!: () => void;
  const imagesAllowed = new Promise<void>((resolve) => { releaseImages = resolve; });
  let heldRequests = 0;
  await page.route("**/images/story/kyoto-*.webp", async (route) => {
    heldRequests += 1;
    await imagesAllowed;
    await route.continue();
  });
  try {
    await page.goto("/our-story/scroll/", { waitUntil: "domcontentloaded" });
    await openBook(page);
    await expect(page.locator("#blacksburg .storyParagraph")).toBeVisible();
    const finalChapter = page.locator("#kyoto");
    await finalChapter.scrollIntoViewIfNeeded();
    await expect.poll(() => heldRequests).toBeGreaterThan(0);
    await expect(finalChapter.locator(".storyParagraph")).toBeVisible();
    const before = await finalChapter.locator(".storyScene").boundingBox();
    releaseImages();
    await expect.poll(() => finalChapter.locator(".storyBackground").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    const after = await finalChapter.locator(".storyScene").boundingBox();
    expect(after!.height).toBeCloseTo(before!.height, 0);
  } finally {
    releaseImages();
  }
});

test("both layouts fit narrow phones and tablet widths", async ({ page }) => {
  for (const width of [320, 390, 899, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/our-story/", "/our-story/scroll/"]) {
      await page.goto(path);
      await openBook(page);
      await expect(page.getByRole("heading", { name: "Our Story", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      expect(await page.locator(".storyParagraph").first().evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(17.5);
    }
  }
});

test("all book pages keep one height with centered arrows at every breakpoint", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/our-story/");
    await openBook(page);
    await page.evaluate(() => document.fonts.ready);
    const book = page.locator(".storyBook");
    const initial = await book.boundingBox();
    for (let index = 0; index < 4; index++) {
      if (index > 0) await page.getByRole("button", { name: "Next page" }).click();
      const bounds = await book.boundingBox();
      expect(bounds!.height).toBeCloseTo(initial!.height, 0);
      for (const arrow of await book.locator(".storyPageButton").all()) {
        const box = await arrow.boundingBox();
        expect(box!.y + box!.height / 2).toBeCloseTo(bounds!.y + bounds!.height / 2, 0);
      }
      const copy = await book.locator("[data-active-chapter] .storyCopy").boundingBox();
      expect(copy!.y + copy!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    }
  }
});

test("page edges fade on hover and retain the shadow during a turn", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  await openBook(page);
  if (!isMobile) await page.mouse.move(0, 0);
  const next = page.getByRole("button", { name: "Next page" });
  const indicator = next.locator(".storyArrow");
  const edgeOpacity = () => next.evaluate((button) => getComputedStyle(button, "::before").opacity);
  await expect.poll(edgeOpacity).toBe("0");
  if (!isMobile) {
    await next.hover();
    await expect.poll(edgeOpacity).toBe("1");
  }
  await next.click();
  await expect(next).toHaveAttribute("data-pressed", "true");
  await expect.poll(edgeOpacity).toBe("1");
  await expect(indicator).toHaveCSS("color", "rgb(0, 0, 0)");
  await expect.poll(() => indicator.evaluate((arrow) => getComputedStyle(arrow, "::before").content)).toBe("none");
  await expect(page.locator(".storyBook")).toHaveAttribute("data-turning", "false");
  await expect(next).toHaveAttribute("data-pressed", "false");
});

test("side taps and horizontal swipes turn pages while vertical scrolling does not", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/our-story/");
  await openBook(page);
  const book = page.locator(".storyBook");
  const active = page.locator("[data-active-chapter]");
  const next = page.getByRole("button", { name: "Next page" });
  await next.click({ position: { x: 20, y: 30 } });
  await expect(active).toHaveAttribute("data-active-chapter", "new-york");
  const swipe = async (dx: number, dy: number) => {
    await book.evaluate((element, delta) => {
      const start = new Touch({ identifier: 1, target: element, clientX: 200, clientY: 400 });
      const end = new Touch({ identifier: 1, target: element, clientX: 200 + delta.dx, clientY: 400 + delta.dy });
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [start] }));
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }));
    }, { dx, dy });
  };
  await swipe(-100, 10);
  await expect(active).toHaveAttribute("data-active-chapter", "home");
  await swipe(10, 150);
  await expect(active).toHaveAttribute("data-active-chapter", "home");
  await swipe(100, 10);
  await expect(active).toHaveAttribute("data-active-chapter", "new-york");
});

test("page turns retain decoded scene nodes and wait for delayed artwork", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/images/story/new-york-*.webp", async (route) => { await gate; await route.continue(); });
  await page.goto("/our-story/");
  await openBook(page);
  const book = page.locator(".storyBook");
  const oldScene = await page.locator('[data-active-chapter] .storyArtwork').elementHandle();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(book).toHaveAttribute("data-loading", "true");
  await expect(page.locator('[data-active-chapter]')).toHaveAttribute("data-active-chapter", "blacksburg");
  release();
  await expect(book).toHaveAttribute("data-turning", "true");
  expect(await oldScene!.evaluate((node) => node.isConnected)).toBe(true);
  const incoming = page.locator('[data-incoming="true"] .storyArtwork');
  const incomingNode = await incoming.elementHandle();
  expect(await incoming.locator("img").evaluateAll((images) => images.every((image) => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(page.locator('[data-active-chapter]')).toHaveAttribute("data-active-chapter", "new-york");
  expect(await incomingNode!.evaluate((node) => node.isConnected && node === document.querySelector('[data-active-chapter] .storyArtwork'))).toBe(true);
  expect(await oldScene!.evaluate((node) => node.isConnected)).toBe(true);
});

test("turns rotate a two-sided leaf without clipping the spread into a wipe", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  await openBook(page);
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.locator(".storyBook")).toHaveAttribute("data-turning", "true");
  const outgoing = page.locator(".storyOutgoing");
  await expect(outgoing).toHaveCSS("clip-path", "none");
  if (isMobile) {
    await expect(outgoing).toHaveCSS("animation-name", "storySingleSheetForward");
    for (const sheet of [outgoing, page.locator('[data-incoming="true"]')]) {
      for (const part of [".storyBookText", ".storyBookIllustration"]) {
        await expect(sheet.locator(part)).toHaveCSS("animation-name", "none");
        await expect(sheet.locator(part)).toHaveCSS("transform", "none");
      }
    }
  } else {
    await expect(outgoing.locator(".storyBookText")).toHaveCSS("animation-name", "storyLeafToLeft");
    await expect(page.locator('[data-incoming="true"] .storyBookIllustration')).toHaveCSS("animation-name", "storyLeafFromRight");
    await expect(outgoing.locator(".storyBookText")).toHaveCSS("backface-visibility", "hidden");
  }
  await expect(page.locator('[data-active-chapter]')).toHaveAttribute("data-active-chapter", "new-york");
  if (isMobile) {
    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(page.locator(".storyBook")).toHaveAttribute("data-turning", "true");
    const returning = page.locator('[data-incoming="true"]');
    await expect(returning).toHaveCSS("animation-name", "storySingleSheetBackward");
    await expect(page.locator(".storyOutgoing")).toHaveCSS("animation-name", "none");
    for (const sheet of [returning, page.locator(".storyOutgoing")]) {
      for (const part of [".storyBookText", ".storyBookIllustration"]) {
        await expect(sheet.locator(part)).toHaveCSS("animation-name", "none");
        await expect(sheet.locator(part)).toHaveCSS("transform", "none");
      }
    }
    await expect(page.locator('[data-active-chapter]')).toHaveAttribute("data-active-chapter", "blacksburg");
  }
});

test("cover opens to page one, locks navigation during animations, and closes from the last page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  const stage = page.locator(".storyBookStage");
  const cover = page.getByRole("button", { name: "Open Matt & Sara’s storybook" });
  await expect(stage).toHaveAttribute("data-cover", "closed");
  await expect(cover).toContainText("Matt & Sara");
  await expect(page.getByRole("button", { name: "Next page", exact: true })).toHaveCount(0);
  await cover.click();
  await expect(stage).toHaveAttribute("data-cover", "opening");
  await expect(cover).toBeDisabled();
  await page.locator(".storyBookExperience").dispatchEvent("keydown", { key: "ArrowRight" });
  await expect(stage).toHaveAttribute("data-cover", "open");
  await expect(page.locator(".storyBook")).toBeFocused();
  await expect(page.locator("[data-active-chapter]")).toHaveAttribute("data-active-chapter", "blacksburg");
  for (const id of ["new-york", "home", "kyoto"]) {
    await page.getByRole("button", { name: "Next page", exact: true }).click();
    await expect(page.locator(".storyPageNext")).toBeDisabled();
    await page.locator(".storyBook").press("ArrowRight");
    await expect(page.locator("[data-active-chapter]")).toHaveAttribute("data-active-chapter", id);
    await expect(page.locator(".storyBook")).toHaveAttribute("data-turning", "false");
  }
  await page.getByRole("button", { name: "Close book", exact: true }).click();
  await expect(stage).toHaveAttribute("data-cover", "closing");
  await expect(page.locator(".storyPageNext")).toBeDisabled();
  await expect(stage).toHaveAttribute("data-cover", "closed");
  await expect(cover).toBeEnabled();
  await expect(cover).toBeFocused();
  await cover.press("Enter");
  await expect(stage).toHaveAttribute("data-cover", "open");
  await expect(page.locator("[data-active-chapter]")).toHaveAttribute("data-active-chapter", "blacksburg");
});

test("the cover remains available while page-one artwork loads", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/images/story/blacksburg-storybook.webp", async (route) => { await gate; await route.continue(); });
  try {
    await page.goto("/our-story/", { waitUntil: "domcontentloaded" });
    const cover = page.getByRole("button", { name: "Open Matt & Sara’s storybook" });
    await expect(cover).toBeVisible();
    await cover.click();
    await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "preparing");
    await expect(cover).toBeDisabled();
    await expect(page.locator(".storyBook")).toHaveCSS("opacity", "0");
    release();
    await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "open");
    await expect(page.locator("[data-active-chapter] .storyBackground")).toBeVisible();
  } finally { release(); }
});

test("reduced motion opens and closes the cover without animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/our-story/");
  await openBook(page);
  for (const id of ["new-york", "home", "kyoto"]) {
    await page.getByRole("button", { name: "Next page", exact: true }).click();
    await expect(page.locator("[data-active-chapter]")).toHaveAttribute("data-active-chapter", id);
  }
  await page.getByRole("button", { name: "Close book", exact: true }).click();
  await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "closed");
  expect(await page.locator(".storyBookStage").evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  await openBook(page);
  await expect(page.locator("[data-active-chapter]")).toHaveAttribute("data-active-chapter", "blacksburg");
});

test("the first page closes through its back arrow, keyboard, or swipe", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/our-story/");
  for (const input of ["arrow", "keyboard", "swipe"]) {
    await openBook(page);
    await expect(page.locator("[data-active-chapter]")).toHaveAttribute("data-active-chapter", "blacksburg");
    if (input === "arrow") await page.locator(".storyPagePrevious").click();
    if (input === "keyboard") await page.locator(".storyBook").press("ArrowLeft");
    if (input === "swipe") await page.locator(".storyBook").evaluate((element) => {
      const start = new Touch({ identifier: 1, target: element, clientX: 80, clientY: 300 });
      const end = new Touch({ identifier: 1, target: element, clientX: 200, clientY: 305 });
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [start] }));
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [end] }));
    });
    await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "closed");
    await expect(page.getByRole("button", { name: "Open Matt & Sara’s storybook" })).toBeFocused();
  }
});

test("cover carries its inside artwork while the flat left page stays concealed", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  const cover = page.getByRole("button", { name: "Open Matt & Sara’s storybook" });
  const rings = cover.locator(".storyCoverRings");
  if (!isMobile) {
    await page.mouse.move(0, 0);
    const rest = await rings.evaluate((el) => getComputedStyle(el).filter);
    await cover.hover();
    await expect(rings).not.toHaveCSS("filter", rest);
    await expect.poll(() => rings.evaluate((el) => getComputedStyle(el, "::before").opacity)).toBe("1");
  }
  await cover.click();
  await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "opening");
  const inside = page.locator(".storyCoverInside img");
  await expect(inside).toHaveAttribute("src", "/images/story/blacksburg-storybook.webp");
  await expect(page.locator(".storyCoverInside")).toHaveCSS("backface-visibility", "hidden");
  await expect(page.locator(".storyCover")).toHaveCSS("transform-style", "preserve-3d");
  if (isMobile) await expect(page.locator(".storyCoverInside")).toHaveCSS("display", "none");
  else await expect.poll(() => page.locator(".storyBook").evaluate(el => getComputedStyle(el).clipPath)).toContain("50%");
  await expect(page.locator(".storyBookStage")).toHaveAttribute("data-cover", "open");
  await expect(page.locator(".storyBook")).toHaveCSS("clip-path", "none");
  await expect(page.locator("[data-active-chapter] .storyBackground")).toBeVisible();
});
