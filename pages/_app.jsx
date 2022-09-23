import "../styles/globals.css"
import Navbar from "../components/Navbar"
import { Toaster } from "react-hot-toast"
import { UserContext } from "../lib/context"
import { useUserData } from "../lib/hooks"
import { useState, useEffect } from "react"

function MyApp({ Component, pageProps }) {
  const userData = useUserData()
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  return (
    <>
      {showChild && (
        <UserContext.Provider value={userData}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
        </UserContext.Provider>
      )}
    </>
  )
}

export default MyApp
