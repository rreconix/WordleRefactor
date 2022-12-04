export default class Game {
	constructor() {
		this.darkTheme = true
		this.hardMode = false
		this.gameOver = false

		this.attempts = 0

		this.winMessages = [
			"Genius",
			"Magnificent",
			"Impressive",
			"Splendid",
			"Great",
			"Phew",
		]
		this.currentGuess = []
		this.modalQueue = []
	}

	init() {
		this.createGrid()
		return this
	}

	async generateWord() {
		if (this.validAnswers != null) {
			return this.validAnswers[
				Math.floor(Math.random() * this.validAnswers.length)
			]
		} else {
			const response = await fetch("../nytwordle_dictionary/valid_answers.txt")
			const res = (await response.text()).split("\r\n")
			this.validAnswers = res

			return this.generateWord()
		}
	}

	async validateWord(word) {
		if (word.length == 5) {
			if (this.dictionary != null) {
				if (this.dictionary.includes(word)) {
					return true
				} else {
					this.displayModal("Not in word list")
					return false
				}
			} else {
				const response = await fetch("../nytwordle_dictionary/dictionary.txt")
				const res = (await response.text()).split("\r\n")
				this.dictionary = res

				return this.validateWord(word)
			}
		} else {
			this.displayModal("Not enough letters")
			return false
		}
	}

	createGrid() {
		const grid = document.querySelector(".grid")
		for (let i = 0; i < 6; i++) {
			const row = document.createElement("div")
			for (let i = 0; i < 5; i++) {
				const gridItem = document.createElement("div")
				gridItem.className = "tile"
				gridItem.dataset.state = "empty"
				gridItem.style.animationDelay = `${i * 150}ms`
				row.append(gridItem)
			}
			grid.append(row)
		}
	}

	async checkLetters(guess, answer) {
		const amountOfGreens = (cv) =>
			answer.split("").filter((letter, i) => letter == cv && guess[i] == letter)
				.length

		const result = guess.split("").reduce(
			(pv, cv, i, arr) => {
				if (answer[i] == cv) {
					pv[i] = "correct"
				} else if (
					answer.includes(cv) &&
					answer.split("").filter((x) => x == cv).length - amountOfGreens(cv) >=
						arr.slice(0, i + 1).filter((x) => x == cv).length
				) {
					pv[i] = "present"
				}
				pv[i] = [pv[i], cv]
				return pv
			},
			[...Array(5).fill("absent")]
		)

		await this.colorTiles(result)
	}

	async colorTiles(colorStates) {
		const tiles = this.currentRow.children
		const keys = [...document.querySelectorAll(".key")].filter(
			(node) => !node.classList.contains("double")
		)

		// GRID ITEMS

		const gridFlip = new Promise((resolve, reject) => {
			colorStates.forEach(([state], index) => {
				const tile = tiles[index]
				tile.classList.add("flip")

				const animationTime = getComputedStyle(tile)
					.getPropertyValue("--flip-duration")
					.slice(0, -2)

				tile.addEventListener("animationstart", () => {
					setTimeout(() => {
						tile.dataset.state = state

						setTimeout(() => {
							tile.classList.remove("flip")
						}, animationTime / 2)
					}, animationTime / 2)
				})
			})
			;[...tiles].pop().addEventListener("animationend", resolve)
		})

		await gridFlip

		// KEYBOARD ITEMS

		colorStates.forEach(([state, letter], index) => {
			const key = keys.find((key) => key.textContent == letter)
			// green
			// yellow
			// black

			if (state == "correct") key.dataset.state = state
			else if (state == "present") key.dataset.state = state
			else key.dataset.state = state
		})
	}

	displayModal(message) {
		const queue = this.modalQueue
		if (
			queue.slice().pop() &&
			queue.slice().pop().getBoundingClientRect().bottom >
				document.body.clientHeight
		)
			return

		const modal = document.createElement("div")
		const modalContainer = document.querySelector(".modal-container")

		modal.textContent = message
		modal.className = "modal"

		modalContainer.append(modal)
		queue.push(modal)

		setTimeout(() => {
			const lastChild = queue.pop()
			lastChild.classList.add("fadingOut")
			lastChild.addEventListener("animationend", () => {
				lastChild.remove()
			})
		}, 1500)
	}

	async guessWord(guess) {
		const wordIsValid = await this.validateWord(guess)

		if (wordIsValid) {
			if (this.attempts == 0 && this.answer == null) {
				this.answer = await this.generateWord()
				console.log(this.answer)
			}

			await this.checkLetters(guess, this.answer)

			this.attempts++
			this.currentGuess = []

			if (guess == this.answer) {
				// GAME OVER
				this.gameOver = true
				this.displayModal(this.winMessages[this.attempts - 1])
			}
		} else {
			this.currentRow.classList.add("shake")
			setTimeout(() => {
				this.currentRow.classList.remove("shake")
			}, 600)
		}
	}

	get currentRow() {
		return [...document.querySelector(".grid").children][this.attempts]
	}
}