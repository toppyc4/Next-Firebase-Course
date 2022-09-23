import Link from "next/link"
import { useContext } from "react"
import { UserContext } from "../lib/context"
import { SignOutButton } from "../pages/enter"

export default function Navbar() {
  const { user, username } = useContext(UserContext)

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link href='/'>
            <button className='btn-logo'>FEED</button>
          </Link>
        </li>

        {/* user is sign in and has username */}
        {username && (
          <>
            <li className='push-left'>
              <SignOutButton />
            </li>
            <li>
              <Link href='/admin'>
                <button className='btn-blue'>Create post</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img
                  src={user?.photoURL || "/hacker.png"}
                  referrerPolicy='no-referrer'
                />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not create username */}
        {!username && (
          <li>
            <Link href='/enter'>
              <button className='btn-blue'>Sign In</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
