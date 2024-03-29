import { Box, Button, ButtonGroup, makeStyles } from "@material-ui/core"
import React, { useEffect } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useAuth } from "../containers/auth"
import { COLOURS } from "../game/CommonStyles"
import { Layout } from "./Layout"
import { Login } from "./Login"
import { Signup } from "./Signup"

const useStyles = makeStyles({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
    },

    innerBox: {
        height: "90%",
        width: "60%",
        display: "flex",
        borderRadius: "10px",
        flexDirection: "column",
        alignContent: "center",
    },

    switchBtn: {
        background: "transparent",
        color: "white",
        border: "1px solid " + COLOURS.lightBrown,
        outline: "0",
        borderRadius: "10px",
        width: "8rem",
    },
    formGroup: {
        height: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    root: {
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
        },
        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
        },
        "& .MuiOutlinedInput-input": {
            color: "white",
        },
        "& .MuiInputLabel-outlined": {
            color: "white",
        },
    },
})
export const AuthPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const currentPage = queryParams.get("page")

    const togglePage = (page: string) => {
        if (page === "login" || page === "signup") {
            history.push(`/auth?page=${page}`)
        } else {
            console.error("Invalid page!")
        }
    }

    const { user } = useAuth()

    useEffect(() => {
        if (!user) return

        // if already authenticated
        history.push("/")
    }, [user])

    return (
        <Layout>
            <Box className={classes.container}>
                <Box className={classes.innerBox}>
                    {/* switch buttons */}
                    <ButtonGroup
                        style={{ height: "4rem", marginTop: "1rem", display: "flex", justifyContent: "center", marginBottom: "2rem" }}
                        variant="outlined"
                    >
                        <Button
                            style={{
                                fontWeight: currentPage === "login" ? "bold" : "",
                                fontSize: currentPage === "login" ? "20px" : "",
                                background: currentPage === "login" ? COLOURS.lightBrown : "",
                                color: currentPage === "login" ? COLOURS.darkBrown : "",
                            }}
                            className={classes.switchBtn}
                            onClick={() => togglePage("login")}
                        >
                            Login
                        </Button>
                        <Button
                            style={{
                                fontWeight: currentPage === "signup" ? "bold" : "",
                                fontSize: currentPage === "signup" ? "20px" : "",
                                background: currentPage === "signup" ? COLOURS.lightBrown : "",
                                color: currentPage === "signup" ? COLOURS.darkBrown : "",
                            }}
                            className={classes.switchBtn}
                            onClick={() => togglePage("signup")}
                        >
                            Sign up
                        </Button>
                    </ButtonGroup>

                    <Box className={classes.formGroup}>
                        {currentPage === "login" && <Login togglePage={togglePage} />}
                        {currentPage === "signup" && <Signup togglePage={togglePage} />}
                    </Box>
                </Box>
            </Box>
        </Layout>
    )
}
