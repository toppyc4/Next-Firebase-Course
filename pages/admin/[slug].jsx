import styles from "../../styles/Admin.module.css"
import AuthCheck from "../../components/AuthCheck"
import ImageUploader from "../../components/ImageUploader"
import { auth, db } from "../../lib/firebaseConfig"
import {
  getFirestore,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore"

import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"

import {
  useDocumentDataOnce,
  useDocumentData,
} from "react-firebase-hooks/firestore"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import toast from "react-hot-toast"

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}

function PostManager() {
  const [preview, setPreview] = useState(false)

  const router = useRouter()
  const { slug } = router.query
  const uid = auth?.currentUser?.uid

  const postRef = doc(getFirestore(), "users", uid, "posts", slug)
  const [post] = useDocumentData(postRef)

  console.log("postRef:", postRef)
  console.log("post:", post)

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <ImageUploader />
            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className='btn-blue'>Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  )
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  })

  const { isDirty, isValid } = formState

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    })

    reset({ content, published })
    toast.success("Post updated successfully!")
  }

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className='card'>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <textarea
          {...register("content", {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        ></textarea>

        {errors.content && (
          <p className='text-danger'>{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className={styles.checkbox}
            type='checkbox'
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>

        <button
          type='submit'
          className='btn-green'
          disabled={!isDirty || !isValid}
        >
          Save Change
        </button>
      </div>
    </form>
  )
}
