import { useEffect, useState } from "react"

import { useAuthState } from "react-firebase-hooks/auth"

import { auth } from "./firebaseConfig"
import { doc, onSnapshot, getFirestore } from "firebase/firestore"

export const useUserData = () => {
  const [user] = useAuthState(auth)
  const [username, setUsername] = useState(null)

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe

    if (user) {
      const ref = doc(getFirestore(), "users", user.uid)
      unsubscribe = onSnapshot(ref, (snapshot) => {
        setUsername(snapshot.data()?.username)
      })
    } else {
      setUsername(null)
    }
    return unsubscribe
  }, [user])

  return { user, username }
}
