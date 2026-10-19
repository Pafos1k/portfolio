import { test, expect } from "@playwright/test";

for (const width of [1524, 810, 390]) {
  test(`homepage preserves content and gallery at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 960 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("/");
    await expect(page.getByText("HI, I'M VLAD", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Full Stack", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Developer", exact: true }),
    ).toBeVisible();
    const portrait = page.locator('img[src*="vlad-portrait.png"]');
    await expect(portrait).toBeVisible();
    expect(
      await portrait.evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(
      page.locator('img[src*="vladislav-signature.svg"]'),
    ).toBeVisible();
    await expect(page.getByText("Buy Template", { exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByText("More Templates", { exact: true })).toHaveCount(
      0,
    );
    await expect(page.getByText("Made in Framer", { exact: true })).toHaveCount(
      0,
    );
    const gallery = page.locator("[data-portfolio-gallery]");
    await expect(gallery.locator("img")).toHaveCount(14);
    await expect(gallery.locator("a,video")).toHaveCount(0);
    const ring = gallery.locator(":scope > div > div");
    await page.waitForTimeout(4000);
    const initial = await ring.getAttribute("style");
    await page.waitForTimeout(250);
    expect(await ring.getAttribute("style")).not.toBe(initial);
    expect(errors).toEqual([]);
  });
}

for (const path of ["/about", "/works", "/blog", "/contact"]) {
  test(`direct route ${path} renders without runtime errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator("#main")).not.toBeEmpty();
    await page.waitForTimeout(2000);
    expect(await page.locator("body").innerText()).not.toContain(
      "Unable to load",
    );
    expect(errors).toEqual([]);
    await page.reload();
    await expect(page.locator("#main")).not.toBeEmpty();
  });
}

test("mobile navigation opens and follows About", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 960 });
  await page.goto("/");
  await page.locator('[data-framer-name="Menu"]').first().click();
  const about = page.getByRole("link", { name: "About", exact: true }).first();
  await expect(about).toBeVisible();
  await about.click();
  await expect(page).toHaveURL(/\/about$/);
  await page.goBack();
  await expect(page.getByText("HI, I'M VLAD", { exact: true })).toBeVisible();
});

test("gallery responds to dragging and preserves intro geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1524, height: 960 });
  await page.goto("/");
  const gallery = page.locator("[data-portfolio-gallery]");
  const ring = gallery.locator(":scope > div > div");
  await page.waitForTimeout(4000);
  const transform = await ring
    .locator(":scope > div")
    .first()
    .evaluate((e) => (e as HTMLElement).style.transform);
  const radius = Number(transform.match(/translateZ\(([-\d.]+)px\)/)?.[1]);
  expect(radius).toBeCloseTo(-645 / (2 * Math.sin(Math.PI / 14)), 2);
  const angle = () =>
    ring.evaluate((e) =>
      Number(
        (e as HTMLElement).style.transform.match(
          /rotateY\(([-\d.]+)deg\)/,
        )?.[1],
      ),
    );
  const initial = await angle();
  await page.mouse.move(200, 250);
  await page.mouse.down();
  await page.mouse.move(350, 250, { steps: 10 });
  expect(await angle()).toBeLessThan(initial - 40);
  await page.mouse.up();
  const released = await angle();
  await page.waitForTimeout(150);
  expect(await angle()).not.toBe(released);
});

test("FAQ expands and existing project opens", async ({ page }) => {
  await page.goto("/");
  const question = page.locator('[data-framer-name="Question"]').first();
  const item = question.locator("..");
  await question.scrollIntoViewIfNeeded();
  const before = await item.boundingBox();
  await question.click();
  await page.waitForTimeout(700);
  const after = await item.boundingBox();
  expect(after!.height).not.toBe(before!.height);
  const project = page.locator('a[href*="works/mandala"]').first();
  await project.click();
  await expect(page).toHaveURL(/\/works\/mandala/);
  await expect(page.locator("#main")).not.toBeEmpty();
});
