import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import routes from '../../routes'

const Footer = () => {
  return (
    <footer className='bg-gray-900'>
      <div className='max-w-7xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8'>
        <nav className='-mx-5 -my-2 flex flex-wrap justify-center' aria-label='Footer'>
          <div className='px-5 py-2'>
            <Link to={routes.home} className='text-base text-gray-300 hover:text-white'>
              Home
            </Link>
          </div>
        </nav>
      </div>
    </footer>
  )
}

export default memo(Footer)
