import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '../components/nav'
import Login from '../components/login'
import axios from 'axios'

// This gets called on every request
export async function getServerSideProps() {
  const url = `https://lettera.api.ksfmedia.fi/v3/frontpage`
  const response = await axios.get(url)
  const data = response.data
  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: { data },
  }
}

async function getPremiumArticle(uuid, userId, authToken) {
  const url = `https://lettera.api.ksfmedia.fi/v3/article/${uuid}`
  const headers = {
    'Content-Type': 'application/json',
    AuthUser: userId,
    Authorization: `OAuth ${authToken}`,
  }
  const res = await fetch(url, { headers })
  let data = await res.json()
  console.log(data)
}

function IndexPage({ data }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [loginFormIsShown, setLoginFormIsShown] = useState(false)
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)
  const toggleLoginForm = () => setLoginFormIsShown(!loginFormIsShown)

  const showPremiumArticle = (uuid) => () => {
    if (userIsLoggedIn) {
      getPremiumArticle(uuid, userId, authToken)
    } else {
      alert('Log in to see this article.')
    }
  }

  useEffect(() => {
    if (userId && authToken) {
      setUserIsLoggedIn(true)
    } else {
      setUserIsLoggedIn(false)
    }
  })

  return (
    <div className="px-4 lg:px-10 mb-16">
      <Nav toggleLoginForm={toggleLoginForm} userIsLoggedIn={userIsLoggedIn} />
      {loginFormIsShown && !userIsLoggedIn && (
        <Login
          password={password}
          setAuthToken={setAuthToken}
          setPassword={setPassword}
          setUserId={setUserId}
          setUsername={setUsername}
          username={username}
        />
      )}
      {userId && authToken && (
        <div className="mb-8">
          <p>userId: {userId}</p>
          <p>authToken: {authToken}</p>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Front page</h1>
        <h2 className="text-2xl font-bold mb-4">Free articles</h2>
        <ul className="mb-12">
          {data
            .filter((article) => !article.premium)
            .map(({ title, uuid }) => (
              <li key={uuid} className="mb-3">
                <Link href={`./article/${uuid}`}>
                  <a className="underline text-blue-700">{title}</a>
                </Link>
              </li>
            ))}
        </ul>
        <h2 className="text-2xl font-bold mb-4">Premium articles</h2>
        <ul>
          {data
            .filter((article) => article.premium)
            .map(({ title, uuid }) => (
              <>
                <li key={uuid} className="mb-3">
                  <Link href={`./article/${uuid}`}>
                    <a className="underline text-blue-700">{title}</a>
                  </Link>
                </li>
                <button
                  className="btn-blue mb-4"
                  onClick={showPremiumArticle(uuid)}
                >
                  Show article
                </button>
              </>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default IndexPage
