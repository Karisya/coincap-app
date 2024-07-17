// tests/coinTable.spec.ts
import { test, expect } from '@playwright/test';

test.describe('CoinTable Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('should display loading spinner initially', async ({ page }) => {
        await expect(page.locator('.ant-spin')).toBeVisible();
    });

    test('should display table with data', async ({ page }) => {
        await page.waitForSelector('.ant-table');
        await expect(page.locator('.ant-table')).toBeVisible();
    });

    test('should filter data based on search input', async ({ page }) => {
        await page.fill('input[placeholder="Поиск по названию монеты"]', 'bitcoin');
        await page.press('input[placeholder="Поиск по названию монеты"]', 'Enter');
        await page.waitForTimeout(500);
        const rows = page.locator('.ant-table-row');
        const firstRowText = await rows.first().innerText();
        expect(firstRowText.toLowerCase()).toContain('btc');
    });


    test('should sort data by price', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForSelector('.ant-table');
        await page.click('th:has-text("Цена (USD)")');
        await page.waitForTimeout(1000); 

        const rows = await page.locator('.ant-table-row');
        const firstRowPriceText = await rows.first().locator('td:nth-child(3)').innerText();
        const lastRowPriceText = await rows.last().locator('td:nth-child(3)').innerText();
        const firstRowPrice = parseFloat(firstRowPriceText.replace('$', ''));
        const lastRowPrice = parseFloat(lastRowPriceText.replace('$', ''));

        expect(firstRowPrice).toBeLessThanOrEqual(lastRowPrice);
    });
});
