import React from "react"
import { createContainer } from "unstated-next"
import { genWords } from "../data/_data"

const useWords = () => {
	const [words, setWords] = React.useState(genWords("words"))
	return {
		words,
		setWords,
	}
}

export let WordsContainer = createContainer(useWords)