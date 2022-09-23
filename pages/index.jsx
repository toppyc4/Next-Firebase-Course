// import Link from "next/link"
import toast from "react-hot-toast"
import PostsFeed from "../components/PostsFeed"
import { useState } from "react"
import {
  Timestamp,
  query,
  collectionGroup,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
  startAfter,
} from "firebase/firestore"

import Loader from "../components/Loader"
import { postToJSON } from "../lib/firebaseConfig"

// Max post to query per page
const LIMIT = 10

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), "posts")
  const postQuery = query(
    ref,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  )
  const posts = (await getDocs(postQuery)).docs.map(postToJSON)

  return {
    props: { posts },
  }
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts)
  const [loading, setLoading] = useState(false)

  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true)
    const last = posts[posts.length - 1]

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt

    const ref = collectionGroup(getFirestore(), "posts")
    const q = query(
      ref,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    )

    const newPosts = (await getDocs(q)).docs.map((doc) => doc.data())
    setPosts(posts.concat(newPosts))
    setLoading(false)

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }

  return (
    <main>
      <PostsFeed posts={posts} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "you have reach the end!"}
    </main>
  )
}
