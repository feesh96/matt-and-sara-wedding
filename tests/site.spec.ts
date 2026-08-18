import { expect, test } from "@playwright/test";

test("shows the save-the-date essentials", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sara & Matt" })).toBeVisible();
  await expect(page.getByText("May 30, 2027", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Princeton, New Jersey", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Save the date", { exact: true })).toHaveCount(0);

  const fade = await page.locator(".hero").evaluate((hero) =>
    getComputedStyle(hero, "::after").backgroundImage,
  );
  expect(fade).toContain("linear-gradient");
});

test("main navigation reaches every public page", async ({ page }) => {
  for (const item of [
    ["Schedule", "/schedule"],
    ["Travel", "/travel"],
    ["FAQ", "/faq"],
  ] as const) {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: item[0] }).click();
    await expect(page).toHaveURL(new RegExp(`${item[1]}/?$`));
  }
});

test("mobile pages keep a shared content edge without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ["/faq", "/travel"] as const) {
    await page.goto(path);

    const layout = await page.evaluate(() => {
      const left = (selector: string) =>
        Math.round(document.querySelector(selector)!.getBoundingClientRect().left);

      return {
        contentLeft: left(".pageContent"),
        headerLeft: left(".siteHeader"),
        headingLeft: left(".pageHeading"),
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    expect(layout.headerLeft).toBe(layout.headingLeft);
    expect(layout.headingLeft).toBe(layout.contentLeft);
    expect(layout.pageWidth).toBe(layout.viewportWidth);
  }
});

test("shows both hotel blocks with safe external booking links", async ({ page }) => {
  await page.goto("/travel");
  await expect(page.getByRole("heading", { name: "Accommodations" })).toBeVisible();

  const nassau = page.getByRole("link", { name: /room block for The Nassau Inn/ });
  await expect(nassau).toHaveAttribute(
    "href",
    "https://reservations.travelclick.com/13522?groupID=5358089",
  );
  await expect(nassau).toHaveAttribute("target", "_blank");
  await expect(nassau).toHaveAttribute("rel", /noopener/);

  const graduate = page.getByRole("link", { name: /room block for The Graduate by Hilton/ });
  await expect(graduate).toHaveAttribute("href", /ctyhocn=PCTGPGU/);
  await expect(graduate).toHaveAttribute("href", /groupCode=GRPSAC/);
  await expect(graduate).toHaveAttribute("target", "_blank");
  await expect(graduate).toHaveAttribute("rel", /noreferrer/);
});

test("uses Milton One Bold for the hero title", async ({ page }) => {
  await page.goto("/?type=script");
  const hero = await page.locator(".heroCopy h1").evaluate((heading) => {
    const style = getComputedStyle(heading);
    return {
      family: style.fontFamily,
      weight: style.fontWeight,
      color: style.color,
      left: heading.getBoundingClientRect().left,
      preview: document.documentElement.dataset.typeface,
    };
  });
  const contentLeft = await page.locator(".siteHeader").evaluate((header) =>
    header.getBoundingClientRect().left,
  );
  const fontLoaded = await page.evaluate(() => document.fonts.check('700 64px "Milton One"'));

  expect(hero.family).toContain("Milton One");
  expect(hero.weight).toBe("700");
  expect(fontLoaded).toBe(true);
  expect(hero.color).toBe("rgb(244, 239, 230)");
  expect(hero.preview).toBeUndefined();
  expect(Math.round(hero.left)).toBe(Math.round(contentLeft));
});

test("uses the supplied original hotel sketches", async ({ page }) => {
  await page.goto("/travel");

  await expect(page.getByAltText("Architectural sketch of the Nassau Inn")).toHaveAttribute(
    "src",
    /hotel-nassau-inn-sketch\.png/,
  );
  await expect(
    page.getByAltText("Architectural sketch of the Graduate by Hilton in Princeton"),
  ).toHaveAttribute("src", /hotel-graduate-sketch\.png/);
});

test("shows the selected couple photos in the editorial band", async ({ page }) => {
  await page.goto("/");

  const portrait = page.getByAltText(
    "Sara and Matt seated together during their engagement trip in Kyoto",
  );
  const sunset = page.getByAltText(
    "Sara and Matt holding hands while walking together at sunset",
  );

  await expect(page.getByRole("region", { name: "Sara and Matt" })).toBeVisible();
  await expect(portrait).toHaveAttribute("src", /couple-engagement-portrait\.jpeg/);
  await expect(sunset).toHaveAttribute("src", /couple-sunset-walk\.jpeg/);
});

test("uses the save-the-date monogram in the header and footer", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Sara and Matt, home" }).locator("img")).toHaveAttribute(
    "src",
    /monogram\.png/,
  );
  await expect(page.getByAltText("Sara and Matt monogram")).toHaveAttribute(
    "src",
    /monogram\.png/,
  );
});
