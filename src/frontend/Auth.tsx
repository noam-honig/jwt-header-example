import { FormEvent, useCallback, useEffect, useState } from 'react'
import { remult, UserInfo } from 'remult'
import App from './App'
import { jwtDecode } from 'jwt-decode'

const AUTH_TOKEN_KEY = 'authToken'
let authToken: string | null = null

remult.apiClient.httpClient = (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  return fetch(input, {
    ...init,
    headers: authToken
      ? {
          ...init?.headers,
          authorization: 'Bearer ' + authToken,
        }
      : init?.headers,

    cache: 'no-store',
  })
}

export default function Auth() {
  const [currentUser, setCurrentUser] = useState<UserInfo>()
  const [showSignIn, setShowSignIn] = useState(false)

  function setAuthToken(token: string | null) {
    authToken = token
    if (token) {
      remult.user = jwtDecode(token)
      sessionStorage.setItem(AUTH_TOKEN_KEY, token)
    } else {
      remult.user = undefined
      sessionStorage.removeItem(AUTH_TOKEN_KEY)
    }
    setCurrentUser(remult.user)
  }

  async function signIn(f: FormEvent<HTMLFormElement>) {
    f.preventDefault()
    const result = await fetch('/api/signIn', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(new FormData(f.currentTarget))),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.ok) {
      setAuthToken(await result.json())
      setShowSignIn(false)
    } else alert(await result.json())
  }
  async function signOut() {
    setAuthToken(null)
    setShowSignIn(true)
  }
  useEffect(() => {
    setAuthToken(sessionStorage.getItem(AUTH_TOKEN_KEY))
  }, [])

  if (showSignIn)
    return (
      <>
        <main className="sign-in">
          <h2>Sign In</h2>
          <form onSubmit={signIn}>
            <label>Name</label>
            <input name="username" placeholder="Try Steve or Jane" />
            <button>Sign in</button>
          </form>
        </main>
      </>
    )

  return (
    <>
      <div>
        Hello {currentUser?.name}{' '}
        {!currentUser ? (
          <button onClick={() => setShowSignIn(true)}>Sign In</button>
        ) : (
          <button onClick={signOut}>Sign Out</button>
        )}
      </div>

      <App />
    </>
  )
}
