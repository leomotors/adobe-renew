import { expect, test } from "@playwright/test";

import { sendImage, sendMessage } from "./discord";
import { env } from "./env";
import { addZero } from "./utils";

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const failure = await page.screenshot({ timeout: 5000 });

    await sendImage(
      "# :warning: FAILURE <:__mafuyuspook:1175812481373962331>",
      "failure.png",
      failure,
    );
  }
});

test("Automation", async ({ page }) => {
  await page.goto("https://licenseportal.it.chula.ac.th/");

  await page.locator("#UserName").fill(env.USERNAME);
  await page.locator("#Password").fill(env.PASSWORD);
  await page.getByRole("button", { name: " Sign in" }).click();

  await sendMessage(`# RUN ${new Date().toLocaleString("th-TH")}`);

  // Check Login Success
  await expect(page.getByRole("heading", { name: env.USERNAME })).toBeVisible();

  // Login Success
  const afterLogin = await page.screenshot();
  await sendImage(
    "## Login Success :white_check_mark:",
    "login-success.png",
    afterLogin,
  );

  // Borrow
  await page.getByRole("link", { name: "Borrow" }).click();

  await expect(page.getByRole("heading", { name: "Borrow" })).toBeInViewport();

  await page.locator("#ProgramLicenseID").selectOption("5");

  // Select End Date
  await page.locator("#ExpiryDateStr").click();

  const today = new Date();
  const next7days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const targetDay = addZero(next7days.getDate());
  const isSameMonth = next7days.getMonth() === today.getMonth();

  if (!isSameMonth) {
    await page.getByRole("link", { name: "" }).first().click();
  }

  await page.getByRole("link", { name: targetDay }).click();
  await page.getByRole("button", { name: "OK" }).click();

  const beforeBorrow = await page.screenshot();
  await sendImage(
    "## Before Borrow <:trollface:1107361263824142366>",
    "before-borrow.png",
    beforeBorrow,
  );

  await page.getByRole("button", { name: "Save" }).click();

  const afterBorrow = await page.screenshot();
  await sendImage("## After Borrow :tada:", "after-borrow.png", afterBorrow);

  expect(page.getByRole("heading", { name: "History" })).toBeInViewport();
});
