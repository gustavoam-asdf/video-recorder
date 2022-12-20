import { chromium } from "playwright"
import { TARGET_WEB } from "./config"

async function main() {
	const browser = await chromium.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(TARGET_WEB)

	await browser.close()
}

main()