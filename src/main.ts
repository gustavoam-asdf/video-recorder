import { Page, chromium } from "playwright"
import { USER_NAME, USER_PASS, WEB_DOMAIN, WEB_TARGET } from "./config"

import { Context } from "vm"
import { sleep } from "./utils"
import storage from "./data/storage.json"

async function login({ context, page }: { context: Context, page: Page }) {
	await page.$eval("#user_login",
		(target: HTMLInputElement) => {
			target.value = USER_NAME
			return target.value
		}
	)
	await page.$eval("#user_pass",
		(target: HTMLInputElement) => {
			target.value = USER_PASS
			return target.value
		}
	)

	await page.click("#wp-submit")
	await context.storageState({ path: "./src/data/storage.json" })
}

async function main() {
	const browser = await chromium.launch({
		headless: false
	})
	const context = await browser.newContext()

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await context.addCookies(storage.cookies as unknown as any[])

	const page = await context.newPage()

	await page.goto(WEB_TARGET)


	await sleep(10000)
	await browser.close()
}

main()