import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import {
  getFirestore,
  collection,
  where,
  getDocs,
  query,
  limit,
} from "firebase/firestore"
import { getStorage } from "firebase/storage"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAc0Nx9ck60Wu7F-ocbxUxLhwhuTRWxJvw",
  authDomain: "nextfire-on-fireship-2.firebaseapp.com",
  projectId: "nextfire-on-fireship-2",
  storageBucket: "nextfire-on-fireship-2.appspot.com",
  messagingSenderId: "837175322360",
  appId: "1:837175322360:web:327f7fbcf7dd94a0b3bd0d",
  measurementId: "G-S3S43ZDQXF",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Auth exports
export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider(app)

// Firestore exports
export const db = getFirestore(app)

// Storage exports
export const storage = getStorage(app)
export const STATE_CHANGE = "state_changed"
// export const dbRef = ref(getDatabase())

// console.log("this is db:", db)
// console.log("this is dbRef:", dbRef)

// Helper function
/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  // userRef = collection("user")
  // const query = userRef.where("username", "==", username).limit(1)

  const q = query(
    collection(db, "users"),
    where("username", "==", username),
    limit(1)
  )

  const userDoc = (await getDocs(q)).docs[0]
  return userDoc
}

/**
 * Convert a fireStore document to JSON
 * @param {DocumentSnapShot} doc
 */
export function postToJSON(doc) {
  const data = doc.data()
  return {
    ...data,
    // firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}
