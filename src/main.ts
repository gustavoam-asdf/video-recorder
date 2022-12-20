async function main() {
	await new Promise(resolve => setTimeout(() => {
		console.log("Hello, world!")
	}, 1000))
}

main()