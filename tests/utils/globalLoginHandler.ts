import { Page } from "@playwright/test";

export default async function globalLoginHandler(page: Page) {
  await page.goto("http://localhost:3000/login");
  await page.getByPlaceholder("m@example.com").click();
  await page.getByPlaceholder("m@example.com").fill("test@account.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("Passwordtest");
  await page.getByRole("button", { name: "Login", exact: true }).click();

  await page.waitForURL("http://localhost:3000/");
}
