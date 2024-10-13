import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/login");
  await page.getByPlaceholder("m@example.com").click();
  await page.getByPlaceholder("m@example.com").fill("test@account.com");
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill("Passwordtest");
  await page.getByRole("button", { name: "Login", exact: true }).click();

  await page.waitForURL("http://localhost:3000/");
});

test("should create a contact for scheduler", async ({ page }) => {
  await page.goto("http://localhost:3000/contacts");
  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("schedulerTestName");

  const schedulerContact = page.locator("data-testid=contact-actions");

  if (await schedulerContact.isVisible()) {
    return;
  }

  await page.getByTestId("add-contact").click();
  await page.getByRole("textbox", { name: "Name", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("schedulerTestName");
  await page.getByRole("textbox", { name: "Last Name" }).click();
  await page
    .getByRole("textbox", { name: "Last Name" })
    .fill("schedulerTestLastName");
  await page.getByRole("textbox", { name: "Phone Number" }).click();
  await page.getByRole("textbox", { name: "Phone Number" }).fill("123456789");
  await page.getByTestId("create-contact").click();

  await page.waitForURL("http://localhost:3000/contacts");

  await expect(page.getByText("schedulerTestName")).toHaveCount(1);
});

test("should create a schedule", async ({ page }) => {
  await page.goto("http://localhost:3000/scheduler");
  await page.getByTestId("scheduler-user-combobox").click();
  await page.getByText("schedulerTestName").click();
  await page.getByTestId("select-trigger").click();
  await page.getByText("12:00").nth(1).click();
  await page.getByTestId("scheduler-save-button").click();

  await page.waitForURL("http://localhost:3000/scheduler");

  await expect(page.getByText("12:00")).toHaveCount(1);
});

test("should delete a schedule", async ({ page }) => {
  await page.goto("http://localhost:3000/scheduler");

  await page.getByTestId("scheduler-action-button").click();
  await page.getByTestId("actions-delete").click();
  await page.getByTestId("actions-delete-confirm").click();

  await expect(page.getByText("schedulerTestName")).toBeHidden();
  await expect(page.getByText("No schedules found")).toBeVisible();
});

test("should schedule a contact", async ({ page }) => {
  await page.goto("http://localhost:3000/contacts");
  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("schedulerTestName");

  await page.getByTestId("contact-actions").click();
  await page.getByTestId("actions-schedule").click();

  await page.waitForURL("http://localhost:3000/scheduler/*");

  await page.getByTestId("select-trigger").click();
  await page.getByText("12:00").nth(1).click();
  await page.getByTestId("scheduler-save-button").click();

  await expect(page.getByText("12:00")).toHaveCount(1);
  await expect(page.getByText("No schedules found")).toBeHidden();

  await page.getByTestId("scheduler-action-button").click();
  await page.getByTestId("actions-delete").click();
  await page.getByTestId("actions-delete-confirm").click();

  await expect(page.getByText("schedulerTestName")).toBeHidden();
  await expect(page.getByText("No schedules found")).toBeVisible();
});
