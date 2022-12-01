export default class Game {
	constructor() {
		this.darkTheme = true
		this.hardMode = false
		this.attempts = 0
	}

	generateWord() {}

	validateWord(word) {
		//5 letters long
		//valid word
	}

	createGrid() {
		const grid = document.querySelector(".grid")
		for(let i = 0; i < 5 * 6; i++){
			const gridItem = document.createElement("div")
			gridItem.className = "gridItem"
			grid.append(gridItem)
		}
	}

	createKeys() {
		const keys = [
			["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
			["", "a", "s", "d", "f", "g", "h", "j", "k", "l", ""],
			[["enter"], "z", "x", "c", "v", "b", "n", "m", ["←"]],
		]
		const keyboard = document.querySelector(".keyboard")
		for (const row of keys) {
			const rowElement = document.createElement("div")
			rowElement.className="row"
			for (const text of row) {
				if (text == "") {
					const keyElement = document.createElement("div")
					keyElement.className = "spacer"
					rowElement.append(keyElement)
				} else {
					const keyElement = document.createElement("button")
					keyElement.className = "key" + (Array.isArray(text) ? " double" : "")
					keyElement.textContent = text[0]
					rowElement.append(keyElement)
				}
			}
			keyboard.append(rowElement)
		}
	}

	checkLetters(guess, answer) {
		let temp = [...answer]
		return guess.split("").reduce(
			(pv, cv, i) => {
				if (answer[i] == cv) {
					pv[i] = 2
				} else if (temp.includes(cv)) {
					pv[i] = 1
					temp.splice(answer.indexOf(cv), 1)
				}

				return pv
			},
			[...Array(5).fill(0)]
		)
	}

	colorTiles(word) {}

	displayModal(msg){

	}

	//enter -> get the guess ->
	guessWord(guess){
		if(this.validateWord(guess)){

		} else{

		}
	}
}
