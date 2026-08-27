import { expect, test } from "@playwright/test";

test("shows the final home-page lockup and supplied photography", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Sara & Matt" })).toBeVisible();
  await expect(page.getByText("May 30, 2027", { exact: true })).toBeVisible();
  await expect(page.getByText("Welcome", { exact: true })).toBeVisible();
  await expect(page.getByAltText("Sara and Matt in front of a pagoda tower in Japan")).toHaveAttribute(
    "src",
    /pagoda-tower\.jpeg/,
  );
  await expect(page.getByAltText("Sara and Matt together at a temple in Japan")).toHaveAttribute(
    "src",
    /holding-hands\.jpeg/,
  );
});

test("desktop navigation reaches every available route and leaves Registry inert", async ({ page }) => {
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

  await expect(page.locator(".desktopNavRight .navPending")).toHaveText("Registry");
  await expect(page.locator(".desktopNavRight a", { hasText: "Registry" })).toHaveCount(0);

  const secondaryNavigation = page.getByRole("navigation", { name: "Secondary navigation" });
  await expect(secondaryNavigation.getByRole("link", { name: "FAQs" })).toHaveAttribute("href", "/faq/");
  await expect(secondaryNavigation.getByRole("link", { name: "RSVP" })).toHaveAttribute("href", "/rsvp/");
});

test("mobile navigation opens and provides every working route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menu = page.locator(".mobileMenu");
  await expect(menu).not.toHaveAttribute("open", "");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");

  const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(navigation.getByRole("link", { name: "Schedule" })).toHaveAttribute("href", /\/schedule\/$/);
  await expect(navigation.getByRole("link", { name: "RSVP" })).toHaveAttribute("href", /\/rsvp\/$/);
  await expect(navigation.locator(".navPending")).toHaveText("Registry");
});

test("schedule presents the event and its exact map destination", async ({ page }) => {
  await page.goto("/schedule");

  await expect(page.getByRole("heading", { name: "Ceremony & Reception" })).toBeVisible();
  await expect(page.getByText("5:00 pm - 11:00 pm", { exact: true })).toBeVisible();
  const venue = page.getByRole("link", { name: /TPC Jasna Polana/ });
  await expect(venue).toHaveAttribute("href", /google\.com\/maps\/place\/TPC\+Jasna\+Polana/);
  await expect(venue).toHaveAttribute("target", "_blank");
  await expect(venue).toHaveAttribute("rel", /noopener/);
  await expect(page.locator(".scheduleAerial")).toHaveAttribute("src", /jasna-polana-aerial\.jpg/);
});

test("travel preserves both room-block destinations", async ({ page }) => {
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

  for (const path of ["/", "/schedule", "/travel", "/faq", "/rsvp"] as const) {
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.pageWidth).toBe(dimensions.viewportWidth);
  }
});
