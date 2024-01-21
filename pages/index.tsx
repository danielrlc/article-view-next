import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '../components/nav'
import Login from '../components/login'
import axios from 'axios'
import Cookies from 'js-cookie'

// This gets called on every request
export async function getServerSideProps() {
  const url = `https://lettera.api.ksfmedia.fi/v3/frontpage`
  const response = await axios.get(url)
  const data = response.data
  return {
    props: { data },
  }
}

function IndexPage({ data }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userId, setUserId] = useState('')
  const [authToken, setAuthToken] = useState('')
  const [loginFormIsShown, setLoginFormIsShown] = useState(false)
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false)

  const toggleLoginForm = () => setLoginFormIsShown(!loginFormIsShown)

  const logOut = () => {
    const url = `https://persona.api.ksfmedia.fi/v1/login/${userId}`
    const headers = {
      Authorization: `OAuth ${authToken}`,
    }
    axios.delete(url, { headers }).then((response) => {
      if (response.status === 200) {
        Cookies.remove('userId')
        Cookies.remove('authToken')
        setUserId('')
        setAuthToken('')
        setUserIsLoggedIn(false)
        console.log('Cookies', Cookies.get())
      }
    })
  }

  useEffect(() => {
    const userIdCookie = Cookies.get('userId')
    const authTokenCookie = Cookies.get('authToken')
    if (userId && authToken) {
      setUserIsLoggedIn(true)
      Cookies.set('userId', userId)
      Cookies.set('authToken', authToken)
      console.log('Cookies', Cookies.get())
    } else if (userIdCookie && authTokenCookie) {
      setUserId(userIdCookie)
      setAuthToken(authTokenCookie)
    } else {
      setUserIsLoggedIn(false)
    }
  }, [userId, authToken])

  return (
    <div className="px-4 lg:px-10 mb-16">
      <Nav
        toggleLoginForm={toggleLoginForm}
        loginFormIsShown={loginFormIsShown}
        userIsLoggedIn={userIsLoggedIn}
        logOut={logOut}
      />
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
        <div className="mb-8 text-sm border border-2 rounded p-4">
          <p className="font-bold mb-3">Login details</p>
          <p className="mb-3">
            (I left this authentication information visible to show that logging in works. I also left cookie information visible in the console when you log in and log out.)</p>
          <p>userId: {userId}</p>
          <p>authToken: {authToken}</p>
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Front page</h1>
        <h2 className="text-2xl font-bold mb-4">Premium articles</h2>
        {userIsLoggedIn ? (
          <ul className="mb-12">
            {data
              .filter((article) => article.premium)
              .map(({ title, uuid }) => (
                <li key={uuid} className="mb-3">
                  <Link href={`./article/${uuid}`}>
                    <a className="underline text-blue-700">{title}</a>
                  </Link>
                </li>
              ))}
          </ul>
        ) : (
          <p className="mb-8">Log in above to read premium articles.</p>
        )}
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
      </div>
    </div>
  )
}

export default IndexPage
