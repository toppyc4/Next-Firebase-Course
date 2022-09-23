import { auth } from "../lib/firebaseConfig"
import { increment, writeBatch, doc, getFirestore } from "firebase/firestore"
import { useDocument } from "react-firebase-hooks/firestore"

// Allows user to Heart(like) post
export default function Heart({ postRef }) {
  // Listen to heart document for currently logged in user
  const heartRef = doc(
    getFirestore(),
    postRef.path,
    "hearts",
    auth.currentUser.uid
  )
  const [heartDoc] = useDocument(heartRef)

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid
    const batch = writeBatch(getFirestore())

    batch.update(postRef, { heartCount: increment(1) })
    batch.set(heartRef, { uid })

    await batch.commit()
  }

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = writeBatch(getFirestore())

    batch.update(postRef, { heartCount: increment(-1) })
    batch.delete(heartRef)

    await batch.commit()
  }

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  )
}
