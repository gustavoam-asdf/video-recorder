import { chromium } from "playwright"
import { TARGET_WEB } from "./config"

async function main() {
	const browser = await chromium.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(TARGET_WEB)
	const userLoginInput = await page.$("#user_login")
	console.log({ userLoginInput })
	await browser.close()
}

main()