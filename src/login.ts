import { USER_NAME, USER_PASS } from "./config"

import { Context } from "vm"
import { Page } from "playwright"

export async function login({ context, page }: { context: Context, page: Page }) {
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