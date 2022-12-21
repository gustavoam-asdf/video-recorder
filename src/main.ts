import { WEB_TARGET } from "./config"
import { chromium } from "playwright"
import { cookies } from "./data/storage.json"
import { sleep } from "./utils"

async function main() {
	const browser = await chromium.launch({
		headless: false,
		args: ["--start-maximized"],
	})
	const context = await browser.newContext({
		viewport: null,
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	await context.addCookies(cookies as unknown as any[])

	const page = await context.newPage()

	await page.goto(WEB_TARGET)

	await page.$eval("div.post-content > div > div", (videoContainer: HTMLDivElement) => {
		const videoCards = videoContainer.querySelectorAll("div >  div > a")
		console.log(videoCards)
	})

	await sleep(10000)
	await browser.close()
}

main()