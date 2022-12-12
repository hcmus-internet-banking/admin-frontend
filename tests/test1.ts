import { test } from '@playwright/test';

test('test', async ({ page }) => {
	await page.goto('http://localhost:5173/login');
	await page.getByPlaceholder('Email').click();
	await page.getByPlaceholder('Email').fill('hopthucuatin@gmail.com');
	await page.getByPlaceholder('Email').press('Tab');
	await page.getByPlaceholder('Password').fill('');
	await page.frameLocator('iframe').getByRole('checkbox', { name: "I'm not a robot" }).click();
	await page.getByRole('button', { name: 'Login' }).click();
});
