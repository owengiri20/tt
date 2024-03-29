import { useMutation, useQuery } from "@tanstack/react-query"
import { atom, useAtom } from "jotai"
import { useHistory } from "react-router-dom"
import { BASE_API_URL } from "../constants"
import { closeSnackbar, enqueueSnackbar } from "notistack"
import { useState } from "react"
import { Avatar } from "./player"

const userAtom = atom<User | null>(null)

export interface User {
    // auto gorm fields
    ID: string
    CreatedAt: string
    DeletedAt: string

    // actual fields
    id: string
    name: string
    username: string
    email: string
    joined: string
    is_admin: boolean
    avatar?: Avatar
}

export const useAuth = () => {
    // user state
    const [user, setUser] = useAtom(userAtom)
    const history = useHistory()

    // login func
    const loginFn = useMutation({
        mutationKey: ["login"],
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            const res = await fetch(BASE_API_URL + "/login", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        },
        onSuccess: (data) => {
            enqueueSnackbar("Login Successfully!", {
                variant: "success",
                autoHideDuration: 3000,
            })
            setUser(data)
            setTimeout(() => {
                closeSnackbar()
            }, 3000)
        },
        onError: (error: any) => {
            return error
        },
    })

    const logoutFn = useMutation({
        mutationKey: ["logout"],
        mutationFn: async () => {
            const res = await fetch(BASE_API_URL + "/logout", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        },
        onSuccess: (data) => {
            setUser(null)
            enqueueSnackbar("Logged out.", {
                variant: "info",
                autoHideDuration: 3000,
            })
            setTimeout(() => {
                window.location.reload()
            }, 300)
        },
        onError: (error) => {
            console.error("Error:", error)
        },
    })

    // Me func
    const meFn = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await fetch(BASE_API_URL + "/auth/me", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        },

        onSuccess: (data) => {
            setUser(data)
        },
        onError: (error) => {
            console.error("Error:", error)
        },
    })

    // signUp func
    const signUpFn = useMutation({
        mutationKey: ["signup"],
        mutationFn: async ({ email, password, confirmPassword }: { email: string; password: string; confirmPassword: string }) => {
            const res = await fetch(BASE_API_URL + "/signup", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    confirmPassword,
                }),
            })

            const data = await res.json()
            if (data.error) throw new Error(data.error)
            return data
        },
        onSuccess: (data) => {
            enqueueSnackbar("Signed Up Successfully!, Please check your email inbox/spam to verify your account.", {
                variant: "success",
                autoHideDuration: 60000,
            })
            history.push("/auth?page=login")
        },
        onError: (error) => {
            console.error("Error:", error)
        },
    })

    return { user, loginFn, logoutFn, meFn, signUpFn }
}
