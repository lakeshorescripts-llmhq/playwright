import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdDir = path.join(__dirname, '../test-cases');
const outputPath = path.join(__dirname, '../tests/generated.spec.ts');

let testFileContent = `import { test, expect } from '@playwright/test';\n\n`;

try {
  const files = fs.readdirSync(mdDir).filter((f: string) => f.endsWith('.md'));

  console.log(`📁 Found ${files.length} markdown file(s) in test-cases`);

  for (const file of files) {
    const filePath = path.join(mdDir, file);

    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch (readErr) {
      console.error(`❌ Failed to read file ${file}:`, (readErr as Error).message);
      continue;
    }

    console.log(`🔍 Parsing file: ${file}`);

    const testName = content.match(/# Test: (.+)/)?.[1]?.trim() ?? file;
    const stepsMatch = content.match(/## Steps\n([\s\S]+?)\n##/);
    const expectedMatch = content.match(/## Expected\n(.+)/);

    const steps = stepsMatch?.[1]?.trim().split('\n') ?? [];
    const expected = expectedMatch?.[1]?.trim();

    console.log(`✅ Test name: ${testName}`);
    console.log(`📋 Steps (${steps.length}):`, steps);
    console.log(`🎯 Expected: ${expected}`);

    if (steps.length === 0) {
      console.warn(`⚠️ No steps found in ${file}, skipping...`);
      continue;
    }

    testFileContent += `test('${testName}', async ({ page }) => {\n`;

    for (const line of steps) {
      const trimmed = line.trim();

      try {
        if (/Go to (.+)/i.test(trimmed)) {
          const url = trimmed.match(/Go to (.+)/i)?.[1]?.trim();
          if (url) {
            testFileContent += `  await page.goto('https://example.com${url}');\n`;
          }
        } else if (/Hover over (.+)/i.test(trimmed)) {
          const target = trimmed.match(/Hover over (.+)/i)?.[1]?.trim();
          if (target) {
            testFileContent += `  // Hovering over: ${target}\n`;
            testFileContent += `  await page.hover('selector-for-${target.replace(/\s+/g, '-').toLowerCase()}');\n`;
          }
        } else if (/Fill email: (.+)/i.test(trimmed)) {
          const value = trimmed.match(/Fill email: (.+)/i)?.[1]?.trim();
          if (value) {
            testFileContent += `  await page.fill('#email', '${value}');\n`;
          }
        } else if (/Fill password: (.+)/i.test(trimmed)) {
          const value = trimmed.match(/Fill password: (.+)/i)?.[1]?.trim();
          if (value) {
            testFileContent += `  await page.fill('#password', '${value}');\n`;
          }
        } else if (/Click (.+)/i.test(trimmed)) {
          const button = trimmed.match(/Click (.+)/i)?.[1]?.trim();
          if (button) {
            const inModal = /modal|popup/i.test(button);
            testFileContent += `  // Clicking: ${button}${inModal ? ' (within modal/popup)' : ''}\n`;
            testFileContent += `  await page.click('selector-for-${button.replace(/\s+/g, '-').toLowerCase()}');\n`;
          }
        } else {
          testFileContent += `  // Unrecognized step: ${trimmed}\n`;
        }
      } catch (stepErr) {
        console.error(`❌ Error processing step "${trimmed}" in ${file}:`, (stepErr as Error).message);
        testFileContent += `  // ⚠️ Error processing step: ${trimmed}\n`;
      }
    }

    if (expected) {
      testFileContent += `  await expect(page).toHaveURL(/${expected}/);\n`;
    }

    testFileContent += `});\n\n`;
  }

  try {
    fs.writeFileSync(outputPath, testFileContent);
    console.log(`✅ Generated tests written to ${outputPath}`);
    console.log('🚀 You can now run the tests with: npx playwright test tests/generated.spec.ts');
  } catch (writeErr) {
    console.error(`❌ Failed to write test file:`, (writeErr as Error).message);
  }

} catch (err) {
  console.error(`❌ Unexpected error during test generation:`, (err as Error).message);
}
