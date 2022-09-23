import styles from "../../styles/Post.module.css"
import {
  collectionGroup,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  limit,
  query,
} from "firebase/firestore"
import { getUserWithUsername, postToJSON } from "../../lib/firebaseConfig"
import PostContent from "../../components/PostContent"
import HeartButton from "../../components/HeartButton"
import AuthCheck from "../../components/AuthCheck"
import { UserContext } from "../../lib/context"

import Link from "next/link"
import { useDocumentData } from "react-firebase-hooks/firestore"
import { useContext } from "react"

export async function getStaticProps({ params }) {
  const { username, slug } = params
  const userDoc = await getUserWithUsername(username)

  let post
  let path

  if (userDoc) {
    console.log(userDoc.ref)
    const postRef = doc(getFirestore(), userDoc.ref.path, "posts", slug)

    post = postToJSON(await getDoc(postRef))

    path = postRef.path
  }

  return {
    props: { post, path },
    revalidate: 420,
  }
}

export async function getStaticPaths() {
  // Improve by using Admin SDK to select empty docs
  const q = query(collectionGroup(getFirestore(), "posts"), limit(20))
  const snapshot = await getDocs(q)

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data()
    return {
      params: { username, slug },
    }
  })

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  }
}

export default function Post(props) {
  const postRef = doc(getFirestore(), props.path)
  const [realtimePost] = useDocumentData(postRef)

  const post = realtimePost || props.post

  const { user: currentUser } = useContext(UserContext)

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className='card'>
        <p>
          <strong>{post.heartCount || 0} 💗</strong>
        </p>

        <AuthCheck
          fallback={
            <Link href='/enter'>
              <button>💗 Sign Up</button>
            </Link>
          }
        >
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>
    </main>
  )
}
