import axios from "axios"
import { useState, useEffect } from "react"

const server = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
})

const useAuth = (code) => {
    const [accessToken, setAccessToken] = useState()
    const [refreshToken, setRefreshToken] = useState()
    const [expiresIn, setExpiresIn] = useState()

    useEffect(()=> {
        const getAccessToken = async () => {
            const res = await server.post("/login", { code })
            const { accessToken, refreshToken, expiresIn } = res.data
            localStorage.setItem("refreshToken", refreshToken)
            localStorage.setItem("expiresIn", Date.now() + (expiresIn * 1000))
            setAccessToken(accessToken)
            setRefreshToken(refreshToken)
            setExpiresIn(expiresIn)
            window.history.pushState({}, null, "/")
        }
        
        // if(Date.now() >= expiresIn) {
        //     getAccessToken()
        // }
        getAccessToken()
    }, [])

    useEffect(() => {

        const refreshAccessToken = async () => {
            try {
                const res = await server.post("/refresh", { refreshToken })
                const { accessToken, expiresIn } = res.data
                localStorage.setItem("expiresIn", Date.now() + (expiresIn * 1000))
                setAccessToken(accessToken)
                setExpiresIn(expiresIn)
            }
            catch (err) {
                console.log(err)
                window.location = "/"
            }
        }

        if(!accessToken || !expiresIn) return 
        const interval = setInterval(() => {
            refreshAccessToken()
        }, (expiresIn - 60) * 1000)

        return () => clearInterval(interval)
    }, [refreshToken, expiresIn])

    return accessToken
}

export default useAuth