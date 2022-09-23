import Link from "next/link"
import { useContext } from "react"
import { UserContext } from "../lib/context"

// Component's children only shown to logged-in user
export default function AuthCheck(props) {
  const { username } = useContext(UserContext)

  return username
    ? props.children
    : props.fallback || (
        <Link href='/enter'>
          &apos; Click me &apos; you gotta sign-in first
        </Link>
      )
}
