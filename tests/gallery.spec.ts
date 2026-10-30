import { expect, test } from "@playwright/test";
import { galleryPhotos } from "../lib/gallery";
import { readFile } from "node:fs/promises";

test("gallery shows the selected photos without cropping and opens an accessible viewer", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/our-story/");
  const gallery = page.getByRole("region", { name: "Gallery", exact: true });
  await expect(gallery.getByRole("img")).toHaveCount(20);
  const first = gallery.getByRole("button", { name: /^View photo 1:/ });
  await first.scrollIntoViewIfNeeded();
  await expect.poll(() => first.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  const imageBox = await first.locator("img").boundingBox();
  expect(imageBox!.width / imageBox!.height).toBeCloseTo(galleryPhotos[0].width / galleryPhotos[0].height, 2);
  await first.click();
  const viewer = page.getByRole("dialog", { name: "Gallery photo viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer).toBeFocused();
  await expect(viewer.getByRole("button", { name: "Close photo viewer" })).toHaveCount(0);
  await expect(viewer.getByRole("button", { name: "Previous photo" })).toBeDisabled();
  await viewer.getByRole("button", { name: "Next photo" }).click();
  await expect(viewer.getByRole("img")).toHaveAttribute("src", galleryPhotos[1].src);
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.getByRole("img")).toHaveAttribute("src", galleryPhotos[0].src);
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(first).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  const last = gallery.getByRole("button", { name: /^View photo 20:/ });
  await last.click();
  await expect(viewer.getByRole("button", { name: "Next photo" })).toBeDisabled();
  await viewer.click({ position: { x: 5, y: 5 } });
  await expect(last).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("all selected gallery assets are available", async ({ request, isMobile }) => {
  test.skip(isMobile, "Assets are shared between layouts");
  for (const photo of galleryPhotos) {
    const response = await request.get(photo.src);
    expect(response.ok(), photo.src).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/jpeg");
  }
});

test("final gallery preserves the saved selections and captions without editing controls", async ({ page, isMobile }) => {
  const draft = JSON.parse(await readFile("docs/story-assets/gallery-final-draft.json", "utf8"));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/our-story/");
  const gallery = page.getByRole("region", { name: "Gallery", exact: true });
  await expect(gallery.locator(".storyGalleryItem")).toHaveCount(20);
  await expect(gallery.locator(".storyGalleryCaption")).toHaveCount(14);
  await expect(gallery.getByRole("button", { name: /Remove photo|Undo removal|Download edits|description|Arrange photos/ })).toHaveCount(0);
  for (const src of [...draft.removed, "/images/gallery/matt-sara-21.jpg", "/images/gallery/matt-sara-15.jpg"]) {
    await expect(gallery.locator(`img[src="${src}"]`)).toHaveCount(0);
  }
  for (const item of galleryPhotos) {
    expect(item.caption ?? "").toBe(draft.captions[item.src] ?? "");
  }
  const first = gallery.getByRole("button", { name: /^View photo 1:/ });
  await first.scrollIntoViewIfNeeded();
  if (!isMobile) {
    await first.hover();
    await expect(gallery.locator("#gallery-caption-1")).toHaveCSS("opacity", "1");
  }
  await first.click();
  const viewer = page.getByRole("dialog", { name: "Gallery photo viewer" });
  await expect(viewer.locator(".storyGalleryViewerCaption")).toHaveText(draft.captions[galleryPhotos[0].src]);
  await viewer.getByRole("button", { name: "Next photo" }).click();
  await expect(viewer.locator(".storyGalleryViewerCaption")).toHaveCount(0);
  await viewer.getByRole("button", { name: "Next photo" }).click();
  await expect(viewer.getByRole("img")).toHaveAttribute("src", galleryPhotos[2].src);
  await expect(viewer.locator(".storyGalleryViewerCaption")).toHaveText(draft.captions[galleryPhotos[2].src]);
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(gallery.locator(".storyGalleryItem")).toHaveCount(20);
  await expect(gallery.locator("#gallery-caption-1")).toHaveText(draft.captions[galleryPhotos[0].src]);
});

test("mobile cover opens fully before the page extends downward", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Single-sheet mobile opening");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  await page.getByRole("button", { name: "Open Matt & Sara’s storybook" }).click();
  const samples = await page.evaluate(async () => {
    const stage = document.querySelector<HTMLElement>(".storyBookStage")!;
    const cover = document.querySelector<HTMLElement>(".storyCover")!;
    const book = document.querySelector<HTMLElement>(".storyBook")!;
    const frames: { left: number; right: number; opacity: number; height: number; locked: boolean; state: string | undefined }[] = [];
    await new Promise<void>(resolve => {
      function sample() {
        const rect = cover.getBoundingClientRect();
        frames.push({ left: rect.left, right: rect.right, opacity: Number(getComputedStyle(book).opacity), height: stage.getBoundingClientRect().height, locked: document.querySelector<HTMLButtonElement>(".storyPageNext")!.disabled, state: stage.dataset.cover });
        if (stage.dataset.cover === "open") resolve();
        else requestAnimationFrame(sample);
      }
      sample();
    });
    return { frames, width: innerWidth };
  });
  expect(samples.frames.length).toBeGreaterThan(5);
  for (const frame of samples.frames) {
    expect(frame.left).toBeGreaterThanOrEqual(0);
    expect(frame.right).toBeLessThanOrEqual(samples.width);
  }
  expect(samples.frames.some(frame => frame.state === "opening" && frame.opacity > .2 && frame.opacity < .95)).toBe(true);
  const opening = samples.frames.filter(frame => frame.state === "opening");
  expect(Math.max(...opening.map(frame => frame.height)) - Math.min(...opening.map(frame => frame.height))).toBeLessThan(1);
  const expanding = samples.frames.filter(frame => frame.state === "expanding");
  expect(expanding.length).toBeGreaterThan(2);
  expect(expanding.at(-1)!.height).toBeGreaterThan(opening[0].height + 50);
  for (const frame of expanding) {
    expect(frame.right - frame.left).toBeLessThan(1);
    expect(frame.locked).toBe(true);
  }
  expect(samples.frames.at(-2)!.opacity).toBeCloseTo(1, 1);
  expect(Math.abs(samples.frames.at(-1)!.height - samples.frames.at(-2)!.height)).toBeLessThan(8);
  await expect(page.getByRole("button", { name: "Next page" })).toBeEnabled();
});

test("mobile binding follows the visible book height while expanding and shrinking", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile resizing shell");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/our-story/");
  const stage = page.locator(".storyBookStage");
  await page.getByRole("button", { name: "Open Matt & Sara’s storybook" }).click();
  await expect(stage).toHaveAttribute("data-cover", "expanding");
  const sampleFrame = () => stage.evaluate(async element => {
    const frames: { shell: number; frame: number; shadow: string; visible: string; opacity: string }[] = [];
    const phase = element.getAttribute("data-cover");
    await new Promise<void>(resolve => {
      const sample = () => {
        const frame = getComputedStyle(element, "::before");
        frames.push({ shell: element.getBoundingClientRect().height, frame: parseFloat(frame.height), shadow: frame.boxShadow, visible: frame.visibility, opacity: frame.opacity });
        if (element.getAttribute("data-cover") !== phase) resolve();
        else requestAnimationFrame(sample);
      };
      sample();
    });
    return frames;
  });
  const growing = await sampleFrame();
  await expect(page.locator(".storyBook")).toHaveCSS("box-shadow", "none");
  await page.getByRole("button", { name: "Close book", exact: true }).click();
  await expect(stage).toHaveAttribute("data-cover", "collapsing");
  const shrinking = await sampleFrame();
  for (const frame of [...growing, ...shrinking]) {
    expect(frame.frame).toBeCloseTo(frame.shell, 1);
    expect(frame.shadow).not.toBe("none");
    expect(frame.visible).toBe("visible");
    expect(Number(frame.opacity)).toBeGreaterThan(.99);
  }
  expect(growing.at(-1)!.frame).toBeGreaterThan(growing[0].frame);
  expect(shrinking.at(-1)!.frame).toBeLessThan(shrinking[0].frame);
  await expect(stage).toHaveAttribute("data-cover", "closed");
});

test("slideshow centers arrows, animates both directions and closes outside the photo", async ({ page }) => {
  await page.goto("/our-story/");
  await page.getByRole("button", { name: /^View photo 2:/ }).click();
  const viewer = page.getByRole("dialog");
  const next = viewer.getByRole("button", { name: "Next photo" });
  const previous = viewer.getByRole("button", { name: "Previous photo" });
  const box = await next.boundingBox();
  expect(box!.y + box!.height / 2).toBeCloseTo(page.viewportSize()!.height / 2, 0);
  await expect(viewer.locator('[role="status"]')).toHaveCount(0);
  const imageBox = await viewer.getByRole("img").boundingBox();
  const arrowBox = await next.locator("svg").boundingBox();
  expect(arrowBox!.x - (imageBox!.x + imageBox!.width)).toBeGreaterThanOrEqual(0);

  // Click the side area well above the visible arrow.
  await next.click({ position: { x: 20, y: 40 } });
  await expect(viewer.locator(".isEntering")).toBeVisible();
  await expect(viewer.locator(".storyGallerySlide")).toHaveCount(1);
  await expect(viewer.getByRole("img")).toHaveAttribute("src", galleryPhotos[2].src);
  expect(await next.locator("svg").boundingBox()).toEqual(arrowBox);
  const portrait = await viewer.getByRole("img").boundingBox();
  const leftTarget = await previous.boundingBox();
  expect(leftTarget!.x + leftTarget!.width).toBeCloseTo(portrait!.x, 0);
  expect(leftTarget!.y).toBeCloseTo(page.viewportSize()!.height * .2, 0);
  // The area next to a narrow portrait is clickable, even far from the fixed arrow.
  await previous.click({ position: { x: leftTarget!.width - 8, y: leftTarget!.height / 2 } });
  await expect(viewer.locator(".storyGalleryViewerContent")).toHaveAttribute("data-direction", "back");
  await expect(viewer.locator(".storyGallerySlide")).toHaveCount(1);
  await expect(viewer.getByRole("img")).toHaveAttribute("src", galleryPhotos[1].src);
  await viewer.getByRole("img").click();
  await expect(viewer).toBeVisible();
  await viewer.click({ position: { x: 5, y: 5 } });
  await expect(viewer).not.toBeVisible();
  await expect(page.getByRole("button", { name: /^View photo 2:/ })).toBeFocused();
});
