import { USER_NAME, USER_PASS, WEB_DOMAIN, WEB_TARGET } from "./config"

import { chromium } from "playwright"
import { sleep } from "./utils"

async function main() {
	const browser = await chromium.launch({
		headless: false
	})
	const context = await browser.newContext()
	const expireTime = Math.ceil(new Date().getTime() / 1000 + 1000 * 60 * 60 * 24 * 365)

	context.addCookies([
		{
			name: "userName",
			value: USER_NAME,
			domain: WEB_DOMAIN,
			path: "/",
			expires: expireTime,
			httpOnly: true,
			secure: true,
			sameSite: "Lax"
		},
	])

	context.addCookies([
		{
			name: "password",
			value: USER_PASS,
			domain: WEB_DOMAIN,
			path: "/",
			expires: expireTime,
			httpOnly: true,
			secure: true,
			sameSite: "Lax"
		},
	])


	const page = await context.newPage()

	await page.goto(WEB_TARGET)

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

	await context.storageState({ path: "./data/storage.json" })
	await sleep(10000)
	await browser.close()
}

main()