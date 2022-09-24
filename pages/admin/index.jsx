import styles from "../../styles/Admin.module.css"

import Metatags from "../../components/Metatags"
import AuthCheck from "../../components/AuthCheck"
import PostsFeed from "../../components/PostsFeed"
import { UserContext } from "../../lib/context"
import { auth } from "../../lib/firebaseConfig"

import {
  getFirestore,
  orderBy,
  collection,
  query,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore"

import { useContext, useState } from "react"
import { useRouter } from "next/router"

import { useCollection } from "react-firebase-hooks/firestore"
import kebabCase from "lodash.kebabcase"
import toast from "react-hot-toast"

export default function AdminPostPage(props) {
  return (
    <main>
      <Metatags title='admin page' />
      <AuthCheck>
        <CreateNewPost />
        <PostList />
      </AuthCheck>
    </main>
  )
}

function PostList() {
  const ref = collection(getFirestore(), "users", auth.currentUser.uid, "posts")
  const postsQuery = query(ref, orderBy("createdAt", "desc"))
  const [querySnapshot] = useCollection(postsQuery)

  const posts = querySnapshot?.docs.map((doc) => doc.data())

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostsFeed posts={posts} admin />
    </>
  )
}

function CreateNewPost() {
  const router = useRouter()
  const { username } = useContext(UserContext)
  const [title, setTitle] = useState("")

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title))

  // Validate length
  const isValid = title.length > 3 && title.length < 100

  // Create new post in firestore
  const createPost = async (e) => {
    e.preventDefault()
    const uid = auth.currentUser.uid
    const ref = doc(getFirestore(), "users", uid, "posts", slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "#hello girls",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    await setDoc(ref, data)

    toast.success("Post Created!")

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`)
  }

  return (
    <div className={styles.createNewPostDiv}>
      <h1>Create new Post</h1>
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='My Awesome Article!'
          className={styles.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type='submit' disabled={!isValid} className='btn-green'>
          Create New Post
        </button>
      </form>
    </div>
  )
}
