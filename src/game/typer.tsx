import { Button, Container, Typography } from "@material-ui/core"
import React from "react"
import { NotImplementedModal } from "../common/notImplemented"
import { ModesModal } from "../components/modes"
import { genWords, TestWord } from "../data/_data"
import { ModesContainer } from "../state/modes"
import { WordsContainer } from "../state/words"
import { FinishCard } from "./finish"
import { useStyles } from "./style"

// disable scroll wheel
window.addEventListener(
	"wheel",
	function (e) {
		e.preventDefault()
	},
	{ passive: false },
)

export type Character = "correct" | "incorrect"

// id of text display
const DISPLAY_ID = "textDisplay"

export const Typer = (props: Props) => {
	// containers
	const { modesModalOpen, setModesModalOpen } = ModesContainer.useContainer()

	// styles
	const classes = useStyles()

	// word count
	const [count, setCount] = React.useState(0)

	// current word index
	const [wordIdx, setWordIdx] = React.useState(0)
	const [charIdx, setCharIdx] = React.useState(0)

	const [chars, setChars] = React.useState<Character[]>([])

	// word being typed in the text area
	const [word, setWord] = React.useState<string>("")

	// finish/start game states
	const [finish, setFinish] = React.useState(false)
	const [start, setStart] = React.useState(false)

	// timer seconds state
	const [seconds, setSeconds] = React.useState(60)

	// correct/incorrect words count
	const [correctWords, setCorrectWords] = React.useState(0)
	const [incorrectWords, setIncorrectWords] = React.useState(0)

	// background colour of word
	const [c, setC] = React.useState<string>("black")

	// modal states
	const [isOpen, setIsOpen] = React.useState(false)

	// update ticker seconds
	React.useEffect(() => {
		if (!start) return
		if (seconds > 0) {
			setTimeout(() => setSeconds(seconds - 1), 1000)
		} else {
			setFinish(true)
		}
	})

	// sets words status "incorrect" or "correct"
	const handleStatus = (correct: boolean) => {
		// correct ...
		if (correct) {
			setCorrectWords(correctWords + 1)
			props.setWords(
				props.words.map((w, i) => {
					if (i === wordIdx) {
						return {
							...w,
							status: "correct",
						}
					}
					return w
				}),
			)
		} else {
			// incorrect ...
			setIncorrectWords(incorrectWords + 1)
			props.setWords(
				props.words.map((w, i) => {
					if (i === wordIdx) {
						return {
							...w,
							status: "incorrect",
						}
					}
					return w
				}),
			)
		}
	}

	// handles restart
	const handleRestart = () => {
		window.location.reload()
		// history.action.
		// props.setWords(genWords())
		// setStart(false)
		// setFinish(false)
		// setWord("")
		// setIdx(0)
		// setCharIdx(0)
		// setWrongWords(0)
		// setCorrectWords(0)
		// setSeconds(60)
	}

	// handles restart
	const handleNotImplemented = () => {
		setIsOpen(true)
	}

	// checks partial word is correct/incorrect
	const checkSubWord = () => {
		const currWord = props.words[wordIdx]
		const subWord = currWord.word.substr(0, charIdx)
		const subWord2 = word.substr(0, charIdx + 1)

		if (word === "") {
			setC("#d7d9ff")
			return
		}

		// correct
		if (subWord === subWord2) {
			setC("#9be6ab")
			setChars([...chars, "correct"])
			return
		} else {
			// incorrect
			setChars([...chars, "incorrect"])
			setC("#f26262")
		}
	}

	// checks sub/partial word on word change
	React.useEffect(() => {
		checkSubWord()
		console.log("log index", wordIdx)

		if (wordIdx === props.words.length - 30) {
			const newWords = genWords("words") || []
			props.setWords([...props.words, ...newWords])
		}

		console.log("logger", props.words.length)
	}, [word])

	const handleKeyPress = (key: any) => {
		// hit space && word empty
		if (key.code === "Space" && word === "") {
			return
		}

		// get current word
		const currWord = props.words[wordIdx]

		// set start
		if (!start) {
			setStart(true)
		}

		// increment char idx
		setCharIdx(charIdx + 1)

		// hit space
		if (key.code === "Space") {
			// last word in json file
			if (wordIdx === props.words.length) {
				return
			}

			// word empty
			if (word === "") return

			// empties text area
			setWord("")

			// increment wordIdx
			setWordIdx(wordIdx + 1)

			// set charIdx to 0
			setCharIdx(0)

			// spelled correctly
			if (currWord.word === word) {
				handleStatus(true)
			} else {
				// spelled incorrectly
				handleStatus(false)
			}

			// increment count
			setCount(count + 1)
			return
		}
	}

	const handleBackSpace = (key: any) => {
		if (word.length === 0) return
		if (key.code && key.code === "Backspace") {
			if (charIdx === 0) return
			setCharIdx(charIdx - 1)
		}
	}

	const getColour = (status: "correct" | "incorrect" | "eh") => {
		if (status === "correct") return "green"
		if (status === "incorrect") return "red"
		if (status === "eh") return "#373737"
	}

	const onCurrWord = (currIdx: number) => {
		return wordIdx === currIdx
	}

	// useffect to handle scroll height of text display
	React.useEffect(() => {
		// if first word
		if (wordIdx === 0) return

		// get prevous word
		const prevWord = props.words[wordIdx - 1]

		// get textDisplay div
		let textDisplay = document.getElementById(DISPLAY_ID)

		// handle scroll
		if (textDisplay && prevWord.cut) {
			textDisplay.scrollTop = props.scrollHeight
			props.setScrollHeight(props.scrollHeight + 61)
		}
	}, [wordIdx])

	// render
	return (
		<React.Fragment>
			<Container>
				{!finish ? (
					<>
						<div className={classes.timer}>
							<Typography className={classes.timerText} variant="h3">
								{seconds}
							</Typography>
						</div>

						<div className={classes.typingArea} id={DISPLAY_ID}>
							<Typography variant="subtitle1">
								{props.words.map((w, i) => (
									<React.Fragment key={i}>
										<span
											style={{
												padding: "5px",
												backgroundColor: onCurrWord(i) ? c : "",
												color: getColour(w.status),
												fontSize: "35px",
												fontWeight: onCurrWord(i) ? "bold" : "unset",
											}}
											key={i}
										>
											{w.word.split("").map((l, idx) => {
												return (
													<span key={l + idx}>
														<span>{l}</span>
													</span>
												)
											})}
										</span>
										{w.cut && <br />}
									</React.Fragment>
								))}
							</Typography>
						</div>
						<div className={classes.line}></div>
						<textarea
							className={classes.textAreaStyles}
							autoFocus
							onKeyPress={handleKeyPress}
							onKeyDown={handleBackSpace}
							value={word}
							onChange={(e) => setWord(e.target.value.trim())}
							placeholder={wordIdx === 0 ? "Start Typing!" : ""}
						></textarea>
						<Button onClick={handleRestart}>Reset</Button>
						<Button onClick={() => setModesModalOpen(true)}>Modes</Button>
						<Button onClick={handleNotImplemented}>Settings</Button>
					</>
				) : (
					<FinishCard chars={chars} wordCount={count} correctWords={correctWords} incorrectWords={incorrectWords} handleRestart={handleRestart} />
				)}
			</Container>
			{isOpen && <NotImplementedModal isOpen={isOpen} setIsOpen={setIsOpen} />}
			{modesModalOpen && <ModesModal />}
		</React.Fragment>
	)
}

interface Props {
	words: TestWord[]
	setWords: (t: TestWord[]) => void
	theme: "dark" | "light"
	setTheme: (s: "dark" | "light") => void
	scrollHeight: number
	setScrollHeight: (h: number) => void
}
export const TyperWrapper = (props: Props) => {
	const {} = props
	const { words, setWords } = WordsContainer.useContainer()
	const [scrollHeight, setScrollHeight] = React.useState(0)
	const [theme, setTheme] = React.useState<"dark" | "light">("light")

	if (words == null) {
		return <Typography variant="h3">uh oh something went wrong</Typography>
	}
	return <Typer setTheme={setTheme} theme={theme} scrollHeight={scrollHeight} setScrollHeight={setScrollHeight} words={words} setWords={setWords} />
}
