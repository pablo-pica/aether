import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function verifyUI() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Save validation screenshot
  const screenshotPath = path.join(process.cwd(), 'test-results', 'screenshots', 'audit_mobile_390x844.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Saved screenshot to ${screenshotPath}`);

  // Inspect page content
  const content = await page.content();
  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Check header, navigation tabs (Send, Activity, Settings), and wallet connect buttons
  const hasHeader = await page.locator('header, h1, text=Aethyr').count() > 0;
  const hasSendTab = await page.locator('button:has-text("Send"), div:has-text("Send")').count() > 0;
  const hasActivityTab = await page.locator('button:has-text("Activity"), div:has-text("Activity")').count() > 0;
  const hasSettingsTab = await page.locator('button:has-text("Settings"), div:has-text("Settings")').count() > 0;
  const hasConnectWallet = await page.locator('button:has-text("Connect"), button:has-text("Wallet"), button:has-text("0x"), button:has-text("G")').count() > 0;

  console.log(`Header visible: ${hasHeader}`);
  console.log(`Send tab visible: ${hasSendTab}`);
  console.log(`Activity tab visible: ${hasActivityTab}`);
  console.log(`Settings tab visible: ${hasSettingsTab}`);
  console.log(`Connect Wallet visible: ${hasConnectWallet}`);

  await browser.close();
}

verifyUI().catch((err) => {
  console.error('UI verification error:', err);
  process.exit(1);
});
