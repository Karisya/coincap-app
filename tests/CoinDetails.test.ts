import { test} from '@playwright/test';

test.describe('CoinDetails Component', () => {
    test.beforeEach(async ({ page }) => {
        await page.route('https://api.coincap.io/v2/assets/*', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    data: {
                        id: 'bitcoin',
                        rank: '1',
                        symbol: 'BTC',
                        name: 'Bitcoin',
                        supply: '18000000',
                        maxSupply: '21000000',
                        priceUsd: '20000',
                        marketCapUsd: '360000000000',
                    },
                }),
            });
        });
        await page.goto('/coin/bitcoin');
    });
})