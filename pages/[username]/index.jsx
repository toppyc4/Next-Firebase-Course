import UserProfile from "../../components/UserProfile"
import PostsFeed from "../../components/PostsFeed"
import { getUserWithUsername, postToJSON, db } from "../../lib/firebaseConfig"
import {
  query,
  collection,
  where,
  getDocs,
  limit,
  orderBy,
  getFirestore,
} from "firebase/firestore"

export async function getServerSideProps({ query: urlQuery }) {
  const { username } = urlQuery

  const userDoc = await getUserWithUsername(username)

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return { notFound: true }
  }

  // JSON serializable data
  let user = null
  let posts = null

  if (userDoc) {
    console.log(userDoc)
    user = userDoc.data()
    // const postsQuery = userDoc.ref
    //   .collection("post")
    //   .where("published", "==", true)
    //   .orderBy("createAt", "desc")
    //   .limit(5)

    const postQuery = query(
      collection(getFirestore(), userDoc.ref.path, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    )
    posts = (await getDocs(postQuery)).docs.map(postToJSON)
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  }
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostsFeed posts={posts} />
    </main>
  )
}
