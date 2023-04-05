import React, {
  useEffect, lazy, Suspense, useState,
} from 'react'
import { Switch, Route } from 'react-router-dom'
import cx from 'clsx'

import Footer from './components/Footer'
import Loader from './ui/Loader'
import routes from './routes'

const Home = lazy(() => import('./pages/Home'))

// In case the route takes more than 1 second to load, we display a loader
const Fallback = () => {
  const [showLoader, setShowLoader]: [boolean, Function] = useState(false)

  useEffect(() => {
    let isMounted = true

    setTimeout(() => {
      if (isMounted) {
        setShowLoader(true)
      }
    }, 1000)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className={cx('bg-gray-800 min-h-page')}>
      {showLoader && (
        <Loader />
      )}
    </div>
  )
}

const App = () => {
  // I decided to use some kind of a loader to display it to the user while the React app is loading
  // It's based in the public/index.html and is removed on the first render of the App component
  useEffect(() => {
    const loaderEl = document.getElementById('loader')

    if (loaderEl) {
      loaderEl.classList.add('available')
      setTimeout(() => {
        loaderEl.outerHTML = ''
      }, 1000)
    }
  }, [])

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <Suspense fallback={<></>}>
      <Suspense fallback={<Fallback />}>
        <Switch>
          <Route path={routes.home} component={Home} exact />
        </Switch>
      </Suspense>
      <Footer />
    </Suspense>
  )
}

export default App
