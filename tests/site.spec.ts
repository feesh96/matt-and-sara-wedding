import { expect, test } from "@playwright/test";

test("shows the final home-page lockup and supplied photography", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sara & Matt" })).toBeVisible();
  await expect(page.getByText("May 30, 2027", { exact: true })).toBeVisible();
  await expect(page.getByText("05.30, 2027", { exact: true })).toHaveCount(0);
  await expect(page.getByText(/We look forward to celebrating our marriage/)).toBeVisible();
  await expect(page.getByAltText("Sara and Matt in front of a pagoda tower in Japan")).toHaveAttribute(
    "src",
    /pagoda-tower-landscape\.png/,
  );
  await expect(page.getByAltText("Sara and Matt together at a temple in Japan")).toHaveAttribute(
    "src",
    /holding-hands\.jpeg/,
  );
  await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
  await expect(page.locator(".homeStoryDivider")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Welcome" })).toHaveCSS(
    "font-family",
    /Milton One/,
  );
  await expect(page.getByRole("heading", { name: "Welcome" })).toHaveCSS("font-weight", "700");
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
