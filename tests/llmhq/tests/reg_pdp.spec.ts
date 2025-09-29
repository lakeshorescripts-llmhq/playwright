import { test, expect } from '@playwright/test';
import { Tigrmail } from 'tigrmail';
import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();
const TIGRMAIL_TOKEN = process.env.TIGRMAIL_TOKEN;

test('user receives shared product email', async ({ page }) => {
  if (!TIGRMAIL_TOKEN) throw new Error('Missing Tigrmail token');

  const tigr = new Tigrmail({ token: TIGRMAIL_TOKEN });
  const emailAddress = await tigr.createEmailAddress();

  // Save inbox to .env file
  const envPath = path.resolve(__dirname, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const updatedEnv = envContent.replace(/TIGRMAIL_INBOX=.*/g, '') + `\nTIGRMAIL_INBOX=${emailAddress}`;
  fs.writeFileSync(envPath, updatedEnv.trim());

  console.log('Inbox saved to .env:', emailAddress);

  await page.goto('/products/sand-water/sand-water-play/big-bubbles/s/WD111/');
  await page.waitForTimeout(5000);
  await page.getByRole('img', { name: 'Share Via Email' }).click();

  await page.getByTestId('input-text').fill('test from');
  await page.getByTestId('input-email').fill('noreply@yourapp.com');
  await page.getByTestId('recipient-name').fill('test to');
  await page.getByTestId('recipient-email').fill(emailAddress);
  await page.getByTestId('submit-button').click();

  const message = await tigr.pollNextMessage({
    inbox: emailAddress,
    subject: { contains: 'Shared a Lakeshore Item with You' },
    timeout: 30000,
  });

  const $ = cheerio.load(message.body.html);
  const productLink = $('a').first().attr('href');

  await page.goto(productLink!);
  await expect(page.locator('#innerWrapper').getByRole('heading', { name: 'Big Bubbles' })).toBeVisible();
});
