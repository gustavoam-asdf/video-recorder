import { chromium } from "playwright"
import { sleep } from "./utils"
import { TARGET_WEB } from "./config"

async function main() {
	const browser = await chromium.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(TARGET_WEB)
	const userLoginInput = await page.$eval("#user_login",
		(target: HTMLInputElement) => {
			target.value = "test"
			return target.value
		}
	)
	console.log({ userLoginInput })
	await sleep(1000)
	await browser.close()
}

main()