import { chromium } from "playwright"

async function main() {
	const browser = await chromium.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto("https://www.google.com")
	await page.screenshot({ path: "./screenshots/google.png" })
	await browser.close()
}

main()