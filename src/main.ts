import {
	ENABLE_RECORD,
	OBS_WEB_SOCKET_URL,
	WEB_TARGET
} from "./config"

import OBSWebSocket from "obs-websocket-js"
import { chromium } from "playwright"
import { cookies } from "./data/storage.json"
import { sleep } from "./utils"

async function main() {
	const obsWS = new OBSWebSocket()
	await obsWS.connect(OBS_WEB_SOCKET_URL).then(() => {
		console.log("Connected to OBS")
	})

	const browser = await chromium.launch({
		headless: false,
		executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
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
		await page.waitForSelector("div.ilightbox-holder.dark")

		const videoFrame = page.frames().find(frame => frame.url().includes("player.vimeo.com/video"))
		if (!videoFrame) return

		const { x, y } = await page.evaluate(() => {
			const viewPortWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
			const viewPortHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
			return {
				x: viewPortWidth / 2,
				y: viewPortHeight / 2,
			}
		})
		await videoFrame.waitForSelector("video")
		await page.mouse.click(x, y)
		await sleep(1000)
		if (ENABLE_RECORD) {
			await obsWS.call("StartRecord")
			const videoDuration = await videoFrame.evaluate(() => {
				const video = document.querySelector("video")
				if (!video) return 0
				return Math.ceil(video.duration * 1000)
			})
			await sleep(videoDuration)
			await obsWS.call("StopRecord")
		}
		await page.mouse.click(0, 0)
	})

	await page.$eval("div.post-content > div > div", (videoContainer: HTMLDivElement) => {
		const videoCards = videoContainer.querySelectorAll("div >  div > a")
		const videoCard = videoCards[0] as unknown as HTMLAnchorElement
		videoCard.click()
		return videoCards
	}).then(() => {
		console.log("Started video card clicked")
	})

	page.on("requestfinished", async request => {
		if (!request.url().includes("player.vimeo.com/video")) return
		console.log("Request finished")
	})

	let ignoreDivs = 2

	obsWS.addListener("RecordStateChanged", async recordStatus => {
		if (recordStatus.outputActive) return
		await page.dispatchEvent(
			`div.post-content > div > div div:nth-child(${ignoreDivs}) > div > a`,
			"click"
		)
		await page.mouse.click(0, 0)
		ignoreDivs++
	})

}

main()