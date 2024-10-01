import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByPlaceholder("m@example.com").click();
  await page.getByPlaceholder("m@example.com").fill("test@account.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("Passwordtest");
  await page.getByRole("button", { name: "Login", exact: true }).click();
});

test("should navigate to the create contacts page and filter contacts table", async ({
  page,
}) => {
  // Expect a title "to contain" a substring.
  await page.getByRole("link", { name: "studio-mk" }).click();
});

test("should create a contact", async ({ page }) => {
  await page.getByRole("link", { name: "Create contact" }).click();
});
