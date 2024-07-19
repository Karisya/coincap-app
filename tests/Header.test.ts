import { test, expect } from '@playwright/test';

test.describe('Header Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('https://api.coincap.io/v2/assets', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: [
                        {
                            id: 'bitcoin',
                            name: 'Bitcoin',
                            symbol: 'BTC',
                            priceUsd: '20000',
                        },
                        {
                            id: 'ethereum',
                            name: 'Ethereum',
                            symbol: 'ETH',
                            priceUsd: '1500',
                        },
                        {
                            id: 'ripple',
                            name: 'Ripple',
                            symbol: 'XRP',
                            priceUsd: '0.5',
                        },
                    ],
                }),
            });
        });

        await page.route('https://api.your-api-endpoint.com/portfolio', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: [
                        {
                            coin: {
                                id: 'bitcoin',
                                name: 'Bitcoin',
                                symbol: 'BTC',
                                priceUsd: '20000',
                            },
                            quantity: 1,
                        },
                        {
                            coin: {
                                id: 'ethereum',
                                name: 'Ethereum',
                                symbol: 'ETH',
                                priceUsd: '1500',
                            },
                            quantity: 2,
                        },
                    ],
                }),
            });
        });

        await page.goto('/');
    });

    test('should open and close the modal correctly', async ({ page }) => {
        await expect(page.locator('text=Ваш Портфель')).not.toBeVisible();

        await expect(page.locator('text=Ваш Портфель')).toBeVisible();

        await expect(page.locator('text=Ваш Портфель')).not.toBeVisible();
    });
});
