import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByPlaceholder("m@example.com").click();
  await page.getByPlaceholder("m@example.com").fill("test@account.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("Passwordtest");
  await page.getByRole("button", { name: "Login", exact: true }).click();
});

test("should login into the app", async ({ page }) => {
  await page.getByRole("link", { name: "studio-mk" }).click();

  await page.goto("http://localhost:3000/login");
  await page.waitForURL("http://localhost:3000/");

  expect(page.url()).toBe("http://localhost:3000/");
});

test("should logout from the app and route guard should work", async ({
  page,
}) => {
  await page.locator("span").nth(1).click();
  await page.getByRole("menuitem", { name: "Log out" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.goto("http://localhost:3000/");
  await page.waitForURL("http://localhost:3000/login");

  expect(page.url()).toBe("http://localhost:3000/login");
});
