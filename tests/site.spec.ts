import { expect, test } from "@playwright/test";

test("shows the final home-page lockup and supplied photography", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sara & Matt" })).toBeVisible();
  await expect(page.getByText("May 30, 2027", { exact: true })).toBeVisible();
  await expect(page.getByText("05.30, 2027", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText("We are so excited to celebrate our marriage with our cherished family and friends."),
  ).toBeVisible();
  await expect(page.getByAltText("Sara and Matt in front of a pagoda tower in Japan")).toHaveAttribute(
    "src",
    /pagoda-tower-landscape-sara-wedding\.jpg/,
  );
  await expect(page.getByAltText("Sara and Matt together at a temple in Japan")).toHaveAttribute(
    "src",
    /welcome-portrait\.png/,
  );
  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
  await expect(page.locator(".homeStoryDivider")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Welcome" })).toHaveCSS(
    "font-family",
    /Milton One/,
  );
  await expect(page.getByRole("heading", { name: "Welcome" })).toHaveCSS("font-weight", "700");
});

test("uses the updated pagoda photo on mobile without stretching it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const photo = page.getByAltText("Sara and Matt in front of a pagoda tower in Japan");
  await expect(photo).toBeVisible();
  await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.currentSrc)).toMatch(
    /pagoda-tower-landscape-sara-wedding\.jpg/,
  );
  await expect(photo).toHaveCSS("object-fit", "cover");
  await expect(page.locator(".homeStoryPanorama")).toHaveCSS("aspect-ratio", "4 / 5");
});

test("keeps the home title visible and on one line across viewport shapes", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 600 },
    { width: 1366, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const title = page.getByRole("heading", { name: "Sara & Matt" });
    const titleBox = await title.boundingBox();
    expect(titleBox).not.toBeNull();
    expect(titleBox!.y).toBeGreaterThanOrEqual(0);
    expect(titleBox!.y + titleBox!.height).toBeLessThanOrEqual(viewport.height);
    await expect(title).toHaveCSS("white-space", "nowrap");
  }
});

test("desktop navigation reaches every available route", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 960 });
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Primary navigation" });

  for (const [label, path] of [
    ["Home", "/"],
    ["Schedule", "/schedule"],
    ["Travel", "/travel"],
  ] as const) {
    const expectedHref = path === "/" ? /^\/$/ : new RegExp(`^${path}/$`);
    await expect(navigation.getByRole("link", { name: label })).toHaveAttribute("href", expectedHref);
  }

  const secondaryNavigation = page.getByRole("navigation", { name: "Secondary navigation" });
  await expect(secondaryNavigation.getByRole("link", { name: "Registry" })).toHaveAttribute(
    "href",
    "/registry/",
  );
  await expect(secondaryNavigation.getByRole("link", { name: "FAQs" })).toHaveAttribute("href", "/faq/");
  await expect(secondaryNavigation.getByRole("link", { name: "RSVP" })).toHaveAttribute("href", "/rsvp/");
});

test("mobile navigation opens and provides every working route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menu = page.locator(".mobileMenu");
  const wordmark = page.locator(".mobileHeader .wordmark");
  const menuBox = await menu.boundingBox();
  const wordmarkBox = await wordmark.boundingBox();
  expect(menuBox).not.toBeNull();
  expect(wordmarkBox).not.toBeNull();
  expect(Math.abs(menuBox!.y + menuBox!.height / 2 - (wordmarkBox!.y + wordmarkBox!.height / 2))).toBeLessThanOrEqual(1);
  await expect(menu).not.toHaveAttribute("open", "");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");

  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu.getByText("Menu", { exact: true })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  await expect(navigation.getByRole("link", { name: "Schedule" })).toHaveAttribute("href", /\/schedule\/$/);
  await expect(navigation.getByRole("link", { name: "RSVP" })).toHaveAttribute("href", /\/rsvp\/$/);
  const registry = navigation.getByRole("link", { name: "Registry" });
  await expect(registry).toHaveAttribute("href", /\/registry\/$/);
  await expect(navigation).toHaveCSS("border-top-left-radius", "14px");
  await expect(navigation.locator(".mobileNavIcon")).toHaveCount(6);

  const menuItems = navigation.locator("li");
  const firstItem = await menuItems.first().boundingBox();
  const secondItem = await menuItems.nth(1).boundingBox();
  expect(firstItem).not.toBeNull();
  expect(secondItem).not.toBeNull();
  expect(secondItem!.x).toBe(firstItem!.x);
  expect(secondItem!.y).toBeGreaterThan(firstItem!.y);
});

test("mobile header remains pinned while scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1000));

  const headerBox = await page.locator(".siteHeader").boundingBox();
  expect(headerBox).not.toBeNull();
  expect(headerBox!.y).toBe(0);
  expect(
    await page.evaluate(() => document.elementFromPoint(window.innerWidth / 2, 46)?.closest(".siteHeader") !== null),
  ).toBe(true);
});

test("schedule presents the event and its exact map destination", async ({ page }) => {
  await page.goto("/schedule");

  await expect(page.getByRole("heading", { name: "Ceremony & Reception" })).toBeVisible();
  await expect(page.getByText("5:00 pm - 11:00 pm", { exact: true })).toBeVisible();
  await expect(page.getByText("TPC Jasna Polana", { exact: true })).toBeVisible();
  await expect(page.getByText("4519 Province Line Rd, Princeton, NJ 08540", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /TPC Jasna Polana/ })).toHaveCount(0);
  const mapLink = page.getByRole("link", { name: "View Map" });
  await expect(mapLink).toHaveAttribute("href", /google\.com\/maps\/place\/TPC\+Jasna\+Polana/);
  await expect(mapLink).toHaveAttribute("target", "_blank");
  await expect(mapLink).toHaveAttribute("rel", /noopener/);
  await expect(mapLink).toHaveCSS("border-radius", "4px");
  const calendarLink = page.getByRole("link", { name: "Add to Calendar" });
  await expect(calendarLink).toHaveAttribute("href", "/sara-and-matt-wedding.ics");
  await expect(calendarLink).toHaveAttribute("download", "");
  await expect(calendarLink).toHaveCSS("border-radius", "4px");
  for (const action of [mapLink, calendarLink]) {
    expect(await action.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
  await expect(page.locator(".scheduleAerial")).toHaveAttribute("src", /jasna-polana-aerial\.jpg/);

  const calendarResponse = await page.request.get("/sara-and-matt-wedding.ics");
  expect(calendarResponse.ok()).toBe(true);
  expect(await calendarResponse.text()).toContain("DTSTART;TZID=America/New_York:20270530T170000");

  const sceneBox = await page.locator(".scheduleScene").boundingBox();
  const viewport = page.viewportSize();
  expect(sceneBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(sceneBox!.y + sceneBox!.height).toBeGreaterThanOrEqual(viewport!.height - 1);
});

test("travel preserves both room-block destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 960 });
  await page.goto("/travel");
  await expect(page.getByRole("heading", { name: "Accommodations" })).toBeVisible();

  const nassau = page.getByRole("link", { name: /room block for The Nassau Inn/ });
  await expect(nassau).toHaveAttribute(
    "href",
    "https://reservations.travelclick.com/13522?groupID=5358089",
  );
  await expect(nassau).toHaveAttribute("target", "_blank");

  const graduate = page.getByRole("link", { name: /room block for The Graduate by Hilton/ });
  await expect(graduate).toHaveAttribute("href", /groupCode=GRPSAC/);
  await expect(graduate).toHaveAttribute("rel", /noreferrer/);

  const buttons = page.locator(".hotelLink");
  const firstButton = await buttons.first().boundingBox();
  const secondButton = await buttons.nth(1).boundingBox();
  expect(firstButton).not.toBeNull();
  expect(secondButton).not.toBeNull();
  expect(Math.abs(firstButton!.y - secondButton!.y)).toBeLessThanOrEqual(1);
});

test("registry provides the Joy link and password", async ({ page }) => {
  await page.goto("/registry");

  await expect(page.getByRole("heading", { name: "Registry" })).toBeVisible();
  await expect(page.getByText("jragnk", { exact: true })).toBeVisible();
  const registryLink = page.getByRole("link", { name: "View our registry" });
  await expect(registryLink).toHaveAttribute(
    "href",
    "https://withjoy.com/matthew-and-sara-may-2027/registry",
  );
  await expect(registryLink).toHaveAttribute("target", "_blank");
  await expect(registryLink).toHaveAttribute("rel", /noopener/);
});

test("FAQs begin collapsed and can be expanded", async ({ page }) => {
  await page.goto("/faq");
  const firstQuestion = page.locator(".faqList details").first();
  await expect(firstQuestion).not.toHaveAttribute("open", "");

  await firstQuestion.locator("summary").click();
  await expect(firstQuestion).toHaveAttribute("open", "");
  await expect(firstQuestion.getByText(/Formal invitations with RSVP information/)).toBeVisible();
});

test("RSVP remains a static invitation-status page", async ({ page }) => {
  await page.goto("/rsvp");
  await expect(page.getByText(/Formal invitations with RSVP details/)).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
});

test("phone layouts have no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const [path, contentSelector] of [
    ["/", ".homeStoryLower"],
    ["/schedule", ".scheduleEvent"],
    ["/travel", ".travelIntro"],
    ["/registry", ".registryIntro"],
    ["/faq", ".faqList"],
    ["/rsvp", ".rsvpNotice"],
  ] as const) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.pageWidth).toBe(dimensions.viewportWidth);

    const contentBox = await page.locator(contentSelector).boundingBox();
    expect(contentBox).not.toBeNull();
    expect(contentBox!.x).toBeGreaterThanOrEqual(38);
    expect(dimensions.viewportWidth - contentBox!.x - contentBox!.width).toBeGreaterThanOrEqual(38);
  }
});

test("travel cards collapse when either paragraph is clicked", async ({ page }) => {
  await page.goto("/travel/");
  const cards = page.locator(".travelCard");
  await expect(cards).toHaveCount(3);

  for (const title of ["By Plane", "By Train", "By Car"]) {
    const card = page.getByRole("button", { name: title, exact: true });
    await expect(card).toHaveAttribute("aria-expanded", "false");
    for (const paragraph of await card.locator(".travelCardParagraph").all()) {
      await card.click();
      await expect(paragraph).toBeVisible();
      await paragraph.click();
      await expect(card).toHaveAttribute("aria-expanded", "false");
    }
    await card.press("Enter");
    await expect(card).toHaveAttribute("aria-expanded", "true");
    await card.press("Space");
    await expect(card).toHaveAttribute("aria-expanded", "false");
  }

  const flightCard = page.getByRole("button", { name: "By Plane", exact: true });
  await flightCard.click();
  await expect(flightCard.locator(".travelCardParagraph").first()).toContainText("Princeton Junction (~45 minutes)");
  await expect(flightCard.locator(".travelCardParagraph").first()).toContainText("hotels (~10 min)");
});

test("selected travel cards fill the gutters and slide the other choices away", async ({ page }) => {
  await page.goto("/travel/");
  const section = page.locator(".travelDirections");
  const cards = page.locator(".travelCard");

  for (const title of ["By Plane", "By Train", "By Car"]) {
    const card = page.getByRole("button", { name: title, exact: true });
    await card.click();
    await expect.poll(async () => {
      const selected = await card.boundingBox();
      const gutters = await section.boundingBox();
      return Math.abs(selected!.width - gutters!.width) + Math.abs(selected!.x - gutters!.x);
    }).toBeLessThan(1);

    const gutters = (await section.boundingBox())!;
    for (const other of await cards.filter({ hasNotText: title }).all()) {
      await expect(other).toHaveAttribute("aria-hidden", "true");
      await expect(other).toHaveAttribute("inert", "");
      const box = (await other.boundingBox())!;
      expect(box.x + box.width <= gutters.x + 1 || box.x >= gutters.x + gutters.width - 1).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth)).toBe(true);

    await card.press("Escape");
    await expect(page.locator('.travelCard[aria-hidden="true"]')).toHaveCount(0);
    await expect(page.getByRole("button", { name: "By Plane", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "By Train", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "By Car", exact: true })).toBeVisible();
  }
});


test("interior pages share title sizing and header spacing", async ({ page }) => {
  let reference: { size: number; gap: number } | undefined;
  for (const path of ["/travel/", "/registry/", "/faq/", "/rsvp/"]) {
    await page.goto(path);
    const title = page.locator(".pageTitle");
    await expect(title).toBeVisible();
    const metrics = await title.evaluate((element) => ({
      size: parseFloat(getComputedStyle(element).fontSize),
      gap: element.getBoundingClientRect().top - document.querySelector(".siteHeader")!.getBoundingClientRect().bottom,
    }));
    expect(metrics.size).toBeLessThanOrEqual(80);
    if (reference) {
      expect(metrics.size).toBe(reference.size);
      expect(Math.abs(metrics.gap - reference.gap)).toBeLessThan(1);
    }
    reference = metrics;
  }
  await page.goto("/schedule/");
  const scheduleTitle = page.locator(".pageTitle");
  const gap = await scheduleTitle.evaluate((element) => element.getBoundingClientRect().top - document.querySelector(".siteHeader")!.getBoundingClientRect().bottom);
  expect(Math.abs(gap - reference!.gap)).toBeLessThan(1);
});

test("section dividers sit halfway between adjacent sections", async ({ page }) => {
  for (const [path, before, after] of [
    ["/travel/", "main > section:first-child", ".travelDirections"],
    ["/registry/", ".registryIntro", ".registryContent"],
    ["/schedule/", ".scheduleLead", ".scheduleScene"],
    ["/rsvp/", ".rsvpNotice", ".rsvpPhoto"],
    ["/", ".homeHero", ".homePhotoStory"],
  ]) {
    await page.goto(path);
    const first = (await page.locator(before).boundingBox())!;
    const second = (await page.locator(after).boundingBox())!;
    const divider = (await page.locator(".sectionDivider").first().boundingBox())!;
    const gapAbove = divider.y - first.y - first.height;
    const gapBelow = second.y - divider.y - divider.height;
    expect(gapAbove).toBeGreaterThanOrEqual(47);
    expect(Math.abs(gapAbove - gapBelow)).toBeLessThan(1);
  }
});


test("FAQs animate both directions and handle rapid reversals", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/faq/");
  const item = page.locator(".faqList details").first();
  const trigger = item.locator("summary");
  const answer = item.locator(".faqAnswer");

  await trigger.click();
  expect(await answer.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
  await expect.poll(() => answer.evaluate((element) => element.getAnimations().length)).toBe(0);
  const expandedHeight = (await answer.boundingBox())!.height;
  expect(expandedHeight).toBeGreaterThan(40);

  await trigger.click();
  await expect(item).toHaveAttribute("open", "");
  expect(await answer.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
  await expect(item).not.toHaveAttribute("open", "");

  await trigger.click();
  await trigger.click();
  await trigger.click();
  await expect.poll(() => answer.evaluate((element) => element.getAnimations().length)).toBe(0);
  await expect(item).toHaveAttribute("open", "");
  expect((await answer.boundingBox())!.height).toBeCloseTo(expandedHeight, 0);
  await trigger.press("Enter");
  await expect(item).not.toHaveAttribute("open", "");
});

test("FAQs respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/faq/");
  const item = page.locator(".faqList details").first();
  const trigger = item.locator("summary");
  await expect(trigger).toBeVisible();
  await trigger.press("Enter");
  await expect(item).toHaveAttribute("open", "");
  expect(await item.locator(".faqAnswer").evaluate((element) => element.getAnimations().length)).toBe(0);
  await trigger.press("Space");
  await expect(item).not.toHaveAttribute("open", "");
});


test("home title waits for its fonts and fades in together", async ({ page }) => {
  let releaseFonts!: () => void;
  const fontsAllowed = new Promise<void>((resolve) => { releaseFonts = resolve; });
  await page.route("**/fonts/*", async (route) => {
    await fontsAllowed;
    await route.continue();
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const lockup = page.locator(".homeTitleLockup");
    await expect(lockup).toHaveCSS("opacity", "0");
    await expect(lockup).toHaveCSS("visibility", "hidden");
    releaseFonts();
    await expect(lockup).toHaveCSS("visibility", "visible");
    await expect(lockup).toHaveCSS("opacity", "1");
    expect(await page.evaluate(() =>
      document.fonts.check('700 1em "Milton One"') &&
      document.fonts.check('400 1em "Cormorant Garamond"'),
    )).toBe(true);
    await expect(lockup.getByText("May 30, 2027", { exact: true })).toBeVisible();
    await expect(lockup.getByText("Princeton, New Jersey", { exact: true })).toBeVisible();
  } finally {
    releaseFonts();
  }
});

test("home font reveal respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const lockup = page.locator(".homeTitleLockup");
  await expect(lockup).toHaveCSS("opacity", "1");
  await expect(lockup).toHaveCSS("transition-duration", "0s");
  await expect(page.locator(".homeGates")).toHaveCSS("opacity", "1");
  await expect(page.locator(".homeGates")).toHaveCSS("transition-duration", "0s");
});


test("home background waits for its image before fading in, including on reload", async ({ page }) => {
  let releaseImage!: () => void;
  const imageAllowed = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route("**/images/venue-gates.png", async (route) => {
    await imageAllowed;
    await route.continue();
  });

  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const image = page.locator(".homeGates");
    await expect(image).toHaveCSS("opacity", "0");
    releaseImage();
    await expect(image).toHaveCSS("opacity", "1");
    expect(await image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    await page.reload();
    await expect(image).toHaveCSS("opacity", "1");
  } finally {
    releaseImage();
  }
});


test("navigation fades every interior page, including return visits", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".homeTitleLockup")).toHaveCSS("opacity", "1");

  for (const [label, path] of [
    ["Schedule", "/schedule/"],
    ["Travel", "/travel/"],
    ["Registry", "/registry/"],
    ["FAQs", "/faq/"],
    ["RSVP", "/rsvp/"],
    ["Travel", "/travel/"],
  ]) {
    if (page.viewportSize()!.width <= 760) {
      await page.locator(".mobileMenu summary").click();
      await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: label, exact: true }).click();
    } else {
      await page.locator(".desktopHeader").getByRole("link", { name: label, exact: true }).click();
    }
    await page.waitForURL(`**${path}`);
    const content = page.locator(".pageReveal");
    await expect(content).toHaveCSS("visibility", "visible");
    expect(await content.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
    await expect(page.locator(".siteHeader")).toHaveCSS("opacity", "1");
    await expect(content).toHaveCSS("opacity", "1");
  }

  await page.goto("/faq/");
  const content = page.locator(".pageReveal");
  await expect(content).toHaveCSS("opacity", "1");
  await page.locator(".faqList summary").first().click();
  expect(await content.evaluate((element) => element.getAnimations().length)).toBe(0);
});

test("page reveal waits for fonts and the visible background photo", async ({ page }) => {
  let releaseFonts!: () => void;
  let releaseImage!: () => void;
  const fontsAllowed = new Promise<void>((resolve) => { releaseFonts = resolve; });
  const imageAllowed = new Promise<void>((resolve) => { releaseImage = resolve; });
  await page.route("**/fonts/*", async (route) => { await fontsAllowed; await route.continue(); });
  await page.route("**/images/jasna-polana-aerial.jpg", async (route) => { await imageAllowed; await route.continue(); });

  try {
    await page.goto("/schedule/", { waitUntil: "domcontentloaded" });
    const content = page.locator(".pageReveal");
    await expect(content).toHaveCSS("visibility", "hidden");
    await expect(page.locator(".siteHeader")).toBeVisible();
    releaseFonts();
    await expect.poll(() => page.evaluate(() => document.fonts.check('700 1em "Milton One"'))).toBe(true);
    await expect(content).toHaveCSS("visibility", "hidden");
    releaseImage();
    await expect(content).toHaveCSS("opacity", "1");
    expect(await page.locator(".scheduleAerial").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  } finally {
    releaseFonts();
    releaseImage();
  }
});

test("page fades respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/registry/");
  await expect(page.locator(".pageReveal")).toHaveCSS("opacity", "1");
  await expect(page.locator(".pageReveal")).toHaveCSS("transition-duration", "0s");
});
