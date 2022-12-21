import { WEB_TARGET } from "./config"
import { chromium } from "playwright"
import { cookies } from "./data/storage.json"
import { sleep } from "./utils"

async function main() {
	const browser = await chromium.launch({
		headless: false
	})
	const context = await browser.newContext()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await context.addCookies(cookies as unknown as any[])

	const page = await context.newPage()

	await page.goto(WEB_TARGET)


	await sleep(20000)
	await browser.close()
}

main()