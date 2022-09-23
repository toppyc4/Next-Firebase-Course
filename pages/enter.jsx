import { auth, googleAuthProvider } from "../lib/firebaseConfig"
import { signInWithPopup, signOut, signInAnonymously } from "firebase/auth"
import { doc, writeBatch, getFirestore, getDoc } from "firebase/firestore"

import { useCallback, useContext, useState, useEffect } from "react"
import { UserContext } from "../lib/context"

import debounce from "lodash.debounce"
import toast from "react-hot-toast"

export default function Enter(props) {
  const { user, username } = useContext(UserContext)

  // 1. user sign out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user sign in & have username <SignoutButton />
  console.log("user:", user)
  console.log("username:", username)

  return (
    <main>
      {/* <Matatags title='Enter' description='Sign up for this amazing app!' /> */}
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInBtn />}
    </main>
  )
}

// Sign in w/ Google button
function SignInBtn() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider).then(() => {
      toast.success("Successfully Sign In! (w/ Google acc)")
    })
  }

  return (
    <>
      <button className='btn-google' onClick={signInWithGoogle}>
        <img src={"/google.png"} /> Sign in with Google
      </button>
      <button
        onClick={() =>
          signInAnonymously(auth).then(() => {
            toast.success("Successfully Sign In! (anonymously)")
          })
        }
      >
        Sign In Anonymously
      </button>
    </>
  )
}

// Sign out btn
export const SignOutButton = () => {
  return (
    <button
      onClick={() =>
        signOut(auth).then(() => {
          toast.success("Successfully Sign Out!")
        })
      }
    >
      Sign Out
    </button>
  )
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [loading, setLoading] = useState(false)

  const { user, username } = useContext(UserContext)

  const onSubmit = async (e) => {
    e.preventDefault()

    // Create ref for both documents
    const userDoc = doc(getFirestore(), "users", user.uid)
    const usernameDoc = doc(getFirestore(), "usernames", formValue)

    // Commit both docs together as a batch write.
    const batch = writeBatch(getFirestore())
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    })
    batch.set(usernameDoc, { uid: user.uid })

    await batch
      .commit()
      .then(alert("username was writen to doc"))
      .catch((e) => console.log(e))
  }

  // Organize input
  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase()
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // Only set form value if length is < 3 OR it passses regex
    if (val.length < 3) {
      setFormValue(val)
      setLoading(false)
      setIsValid(false)
    }

    if (re.test(val)) {
      setFormValue(val)
      setLoading(true)
      setIsValid(false)
    }
  }

  useEffect(() => {
    checkUsername(formValue)
  }, [formValue])

  // Check username form database
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(getFirestore(), "usernames", username)
        const snap = await getDoc(ref)
        console.log("Firestore read executed! snap exist?:", snap.exists())
        setIsValid(!snap.exists())
        setLoading(false)
      }
    }, 420),
    []
  )

  return (
    !username && (
      <section>
        <h3>Choose your username</h3>
        <form onSubmit={onSubmit}>
          <input
            name='username'
            placeholder='myname'
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type='submit' className='btn-green' disabled={!isValid}>
            Choose
          </button>

          <h3>Debug state</h3>
          <div>
            Username: {formValue}
            <br />
            Username Valid: {isValid.toString()}
            <br />
            Loading: {loading.toString()}
          </div>
        </form>
      </section>
    )
  )
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>
  } else if (isValid) {
    return <p className='text-success'>{username} is available!</p>
  } else if (username && !isValid) {
    return <p className='text-danger'>That username is taken!</p>
  } else {
    return <p></p>
  }
}
