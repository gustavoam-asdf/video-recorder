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

	page.on("requestfinished", async request => {
		if (!request.url().includes("player.vimeo.com/video")) return
		const videoFrame = page.frames().find(frame => frame.url().includes("player.vimeo.com/video"))
		if (!videoFrame) return
		videoFrame.$$eval("button", (buttons) => {
			console.log({ buttons })
		})
		await sleep(10000)
		await page.mouse.click(500, 500)
	})

	await page.$eval("div.post-content > div > div", (videoContainer: HTMLDivElement) => {
		const videoCards = videoContainer.querySelectorAll("div >  div > a")
		const videoCard = videoCards[0] as unknown as HTMLAnchorElement
		videoCard.click()
		return videoCards
	}).then((videoCards) => {
		// console.log({ videoCards })
		console.log("Video card clicked")
	})

	await sleep(50000)
	await browser.close()
}

main()