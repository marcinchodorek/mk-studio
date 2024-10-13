import { test, expect } from "@playwright/test";
import globalLoginHandler from "./utils/globalLoginHandler";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await globalLoginHandler(page);
});

test("should create a contact", async ({ page }) => {
  await page.goto("http://localhost:3000/contacts");
  await page.getByTestId("add-contact").click();
  await page.getByRole("textbox", { name: "Name", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("contactsTest");
  await page.getByRole("textbox", { name: "Last Name" }).click();
  await page
    .getByRole("textbox", { name: "Last Name" })
    .fill("contactsTestLastName");
  await page.getByRole("textbox", { name: "Phone Number" }).click();
  await page.getByRole("textbox", { name: "Phone Number" }).fill("123456789");
  await page.getByTestId("create-contact").click();

  await page.waitForURL("http://localhost:3000/contacts");

  await expect(page.getByText("contactsTest", { exact: true })).toHaveCount(1);
});

test("should navigate to the create contacts page and filter contacts table", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/contacts");

  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("contactsTest");

  await expect(page.getByText("contactsTest", { exact: true })).toHaveCount(1);
});

test("should edit a contact", async ({ page }) => {
  await page.goto("http://localhost:3000/contacts");

  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("contactsTest");
  await page.getByTestId("contact-actions").click();
  await page.getByTestId("actions-edit").click();

  await page.waitForURL("http://localhost:3000/contacts/edit/*");

  await page.getByRole("textbox", { name: "Name", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("contactsTestChanged");
  await page.getByTestId("create-contact").click();

  await page.waitForURL("http://localhost:3000/contacts");

  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("contactsTestChanged");

  await expect(
    page.getByText("contactsTestChanged", { exact: true }),
  ).toHaveCount(1);
});

test("should delete a contact", async ({ page }) => {
  await page.goto("http://localhost:3000/contacts");

  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("contactsTestChanged");

  await page.getByTestId("contact-actions").click();
  await page.getByTestId("actions-delete").click();
  await page.getByTestId("actions-delete-confirm").click();

  await expect(
    page.getByText("contactsTestChanged", { exact: true }),
  ).toBeHidden();
});
