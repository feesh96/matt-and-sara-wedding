import { expect, test } from "@playwright/test";

test("shows the save-the-date essentials", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Sara & Matt" })).toBeVisible();
  await expect(page.getByText("May 30, 2027", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Princeton, New Jersey", { exact: true }).first()).toBeVisible();
});

test("main navigation reaches every public page", async ({ page }) => {
  for (const item of [
    ["Schedule", "/schedule"],
    ["Travel", "/travel"],
    ["FAQ", "/faq"],
  ] as const) {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: item[0] }).click();
    await expect(page).toHaveURL(new RegExp(`${item[1]}$`));
  }
});

test("mobile pages keep a shared content edge without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/faq");

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
});
