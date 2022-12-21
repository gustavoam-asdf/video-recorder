import { TARGET_WEB, USER_NAME, USER_PASS } from "./config"

import { chromium } from "playwright"
import { sleep } from "./utils"

async function main() {
	const browser = await chromium.launch({
		headless: false
	})
	const context = await browser.newContext()
	const page = await context.newPage()

	await page.goto(TARGET_WEB)
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
	await sleep(10000)
	await browser.close()
}

main()