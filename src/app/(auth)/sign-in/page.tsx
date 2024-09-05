'use client'

import { useSession, signIn, signOut } from "next-auth/react"
export const runtime = 'edge'

export default function Signin() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button className="bg-red-600 rounded px-3 py-1" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-600 rounded px-3 py-1 m-4" onClick={() => signIn()}>Sign in</button>
    </>
  )
}
