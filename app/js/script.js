import Game from "./Game.js"
const Wordle = new Game().init()

// SETTING ANSWER

// ADDING LETTERS

function inputLetter(letter) {
	if (Wordle.gameOver) return
	if (/\b[a-z]\b/.test(letter)) {
		if (Wordle.currentGuess.length == 5) return
		const currentRow = Wordle.currentRow

		const tile = currentRow.children[Wordle.currentGuess.length]
		Wordle.currentGuess.push(letter)
		tile.textContent = letter
	}
}

// DELETING AND ENTERING LETTERS

function deleteOrEnter(key){
	if (Wordle.gameOver) return
	if (key == "Enter") {
		Wordle.guessWord(Wordle.currentGuess.join(""))
	} else if (key == "Backspace") {
		if (Wordle.currentGuess.length == 0) return

		const currentRow = Wordle.currentRow
		const tile = currentRow.children[Wordle.currentGuess.length - 1]
		tile.textContent = ""

		Wordle.currentGuess.pop()
	}
}

// PRESSING ON KEYBOARD
document.addEventListener("keypress", (e) => inputLetter(e.key))
document.addEventListener("keydown", (e) => deleteOrEnter(e.key))

// CLICKING ONSCREEN KEYBOARD

document.querySelectorAll(".key").forEach(key => {
	key.addEventListener("click", (e) => {
		const datasetValue = e.target.dataset.value
		if(datasetValue){
			deleteOrEnter(e.target.dataset.value)
		} else{
			inputLetter(e.target.textContent)
		}
	})
})