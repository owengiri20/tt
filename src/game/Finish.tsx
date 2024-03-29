import { Box, Button, Container, Tooltip, makeStyles } from "@material-ui/core"
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded"
import StarRoundedIcon from "@material-ui/icons/StarRounded"
import Typography from "@mui/material/Typography"
import React from "react"
import { useHistory } from "react-router-dom"
import { calculateCharAccuracy, calculateWPM } from "../calculations"
import TTButton from "../common/TTButton"
import { useAuth } from "../containers/auth"
import ninja from "../icons/png/ninja.png"
import good from "../icons/svg/002-grin.svg"
import pro from "../icons/svg/014-sunglasses.svg"
import avarage from "../icons/svg/026-smile.svg"
import meh from "../icons/svg/032-neutral.svg"
import { useGetDuration } from "../localstorage"
import { COLOURS } from "./CommonStyles"
import TestsTable from "./RecentTestsTable"

interface Result {
    rating: RatingType
    stars: number
    graphic: string
}
type RatingType = "meh" | "average" | "good" | "pro" | "ninja" | "too damn good"
export const getResult = (wpm: number): Result => {
    let stars = 0
    let rating: RatingType = "meh"
    let graphic = meh

    if (wpm < 30) {
        rating = "meh"
        stars = 1
        graphic = meh
    }
    if (wpm >= 30 && wpm < 50) {
        rating = "average"
        stars = 3
        graphic = avarage
    }
    if (wpm >= 50 && wpm < 70) {
        rating = "good"
        stars = 4
        graphic = good
    }
    if (wpm >= 70 && wpm < 90) {
        rating = "pro"
        stars = 5
        graphic = pro
    }

    if (wpm >= 90) {
        rating = "ninja"
        stars = 5
        graphic = ninja
    }

    return {
        stars,
        rating,
        graphic,
    }
}

interface FinishCardProps {
    correctWords: number
    incorrectWords: number
    correctCharsCount: number
    totalCharsCount: number
    handleRestart: () => void
}

export const finishStyles = makeStyles({
    finishCard: {
        height: "fit-content",
        overflowY: "auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    box: {
        width: "50%",
        background: "#21190f",
        borderRadius: "20px",
        margin: ".5rem",
    },
    wpm: {
        width: "50%",
        background: "#21190f",
        borderRadius: "20px",
        margin: ".5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    wpmText: {
        fontSize: "40px",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },

    correctIncorrectText: {
        fontSize: "20px",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    correctIncorrectTextBox: {
        background: "#21190f",
        borderRadius: "20px",
        margin: ".5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        marginRight: "1rem",
        height: "100%",
    },
    bottom: {
        display: "flex",
        justifyContent: "center",
    },

    statusText: {
        display: "block",
        marginLeft: "5px",
    },
    statusCard: {
        display: "flex",
    },
    StarRatingBox: {
        display: "flex",
        flexDirection: "column",
        padding: "15px",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    card: {
        display: "flex",
        margin: "10px",
        padding: "10px",
        transition: ".2s ease",
    },
    displayImage: {
        height: "80px",
        marginBottom: "1rem",
    },
})

export const Finish = (props: FinishCardProps) => {
    const { user } = useAuth()
    const history = useHistory()
    const { correctWords, incorrectWords, correctCharsCount, totalCharsCount, handleRestart } = props
    const classes = finishStyles()
    return (
        <div className={classes.finishCard}>
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Container className={classes.box}>
                    <StarRating result={getResult(calculateWPM(correctCharsCount, useGetDuration(), correctWords))} />
                </Container>
                <Container className={classes.wpm}>
                    <Tooltip placement="top" title={"WPM (Words Per Minute) = (Correct Characters / 5) / (Time in Seconds / 60)"}>
                        <Box className={classes.wpmText}>WPM</Box>
                    </Tooltip>
                    <Box className={classes.wpmText}>{calculateWPM(correctCharsCount, useGetDuration(), correctWords)}</Box>
                </Container>
                <Container className={classes.wpm}>
                    <Tooltip placement="top" title={"Correct Characters / Total Characters * 100"}>
                        <Box className={classes.wpmText}>Accuracy</Box>
                    </Tooltip>
                    <Box className={classes.wpmText}>{calculateCharAccuracy(correctCharsCount, totalCharsCount, correctWords)}%</Box>
                </Container>
            </Box>

            <Box sx={{ display: "flex", height: "100%" }}>
                <Box
                    sx={{
                        display: "flex",
                        height: "100%",
                        width: "100%",
                        flexDirection: "column",
                        marginRight: "1rem",
                    }}
                >
                    <Container className={classes.correctIncorrectTextBox} style={{ borderLeft: "10px solid green" }}>
                        <Box className={classes.correctIncorrectText}>Correct: {correctWords}</Box>
                    </Container>
                    <Container className={classes.correctIncorrectTextBox} style={{ borderLeft: "10px solid red" }}>
                        <Box className={classes.correctIncorrectText}>Incorrect: {incorrectWords}</Box>
                    </Container>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <Container
                        style={{
                            padding: 0,
                            margin: ".5rem",
                            borderRadius: "10px",
                            backgroundColor: COLOURS.darkishBrown,
                            overflowY: "auto",
                        }}
                    >
                        <Box>
                            {user?.ID ? (
                                <TestsTable limit={6} userID={user?.ID} />
                            ) : (
                                <Box
                                    sx={{
                                        px: "1rem",
                                        py: "2rem",
                                        textAlign: "center",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "1.4rem", marginBottom: "1rem" }}>
                                        Please log in or create an account to see your stats!
                                    </Typography>

                                    <TTButton onClick={() => history.push("/auth?page=login")} sx={{ p: ".5rem" }}>
                                        Login / Sign up
                                    </TTButton>
                                </Box>
                            )}
                        </Box>
                    </Container>
                </Box>
            </Box>

            {/* <Box style={{ marginBottom: "2rem", display: "flex", flexGrow: 1, justifyContent: "center", height: "8rem", width: "100%", marginTop: "2rem" }}>
                <Button
                    style={{
                        backgroundColor: COLOURS.darkishBrown,
                        color: "white",
                        borderRadius: "10px",
                        width: "30%",
                        height: "fit-content",
                        padding: "1rem",
                    }}
                    variant="contained"
                    onClick={handleRestart}
                >
                    Play Again
                </Button>
            </Box> */}
        </div>
    )
}

interface StarRatingProps {
    result: Result
}
export const StarRating = (props: StarRatingProps) => {
    const { result } = props
    const classes = finishStyles()

    return (
        <div className={classes.StarRatingBox}>
            <img src={result.graphic} alt="" className={classes.displayImage} />
            <div />
            <Box>
                {Array.from(Array(5).keys()).map((s, i) => {
                    if (i < result.stars) {
                        return <StarRoundedIcon style={{ color: COLOURS.lightBrown, fontSize: "50px" }} key={i} />
                    }
                    return <StarBorderRoundedIcon style={{ color: COLOURS.lightBrown, fontSize: "50px" }} key={i} />
                })}
            </Box>
        </div>
    )
}
