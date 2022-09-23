import { PostManager } from "../admin/[slug]"
import { auth } from "../../lib/firebaseConfig"
import AuthCheck from "../../components/AuthCheck"

export default function Test() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  )
}
