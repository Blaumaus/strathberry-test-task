import React, { useState, useEffect } from 'react'
import cx from 'clsx'
import _map from 'lodash/map'
import _filter from 'lodash/filter'
import _head from 'lodash/head'
import _toLower from 'lodash/toLower'
import _includes from 'lodash/includes'
import _orderBy from 'lodash/orderBy'
import _isEmpty from 'lodash/isEmpty'

import { getProducts, IProductNode } from 'api'
import Loader from 'ui/Loader'

interface ISearchProps {
  onSearch: (query: string) => void
}

const Search: React.FC<ISearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center w-96 mx-auto mt-2 mb-2'>
      <input
        type='text'
        value={query}
        onChange={handleChange}
        placeholder='Search for products'
        className='border border-gray-200 rounded-s-lg py-2 px-4 flex-1'
      />
      <button
        type='submit'
        className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-e-lg'
      >
        Search
      </button>
    </form>
  )
}

interface IProductList {
  products: IProductNode[]
}

const ProductList: React.FC<IProductList> = ({ products }) => (
  <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-2'>
    {_map(products, (product) => (
      <li key={product.id} className='border border-gray-200 p-4 rounded-lg'>
        <h2 className='text-lg font-medium mb-2'>{product.title}</h2>
        <img
          src={_head(product.images.edges)?.node?.originalSrc}
          alt=' '
          className='w-full h-48 object-contain mb-2'
        />
        <p className='text-gray-500 mb-2'>{product.description}</p>
        <p className='font-medium'>
          £
          {_head(product.variants.edges)?.node?.price}
        </p>
      </li>
    ))}
  </ul>
)

const DEFAULT_SORT_ORDER = 'asc'
const DEFAULT_SORT_BY = 'title'
const DEFAULT_SEATCH_QUERY = ''

const Home = () => {
  const [products, setProducts] = useState<IProductNode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(DEFAULT_SEATCH_QUERY)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(DEFAULT_SORT_ORDER)
  const [sortBy, setSortBy] = useState<'title' | 'price'>(DEFAULT_SORT_BY)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        if (data) {
          setProducts(_map(data.products.edges, ({ node }) => node))
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (by: 'title' | 'price') => {
    setSortBy(by)
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  // search
  let filteredProducts = _filter(products, product => _includes(_toLower(product.title), _toLower(searchQuery)))

  // sort
  filteredProducts = _orderBy(
    filteredProducts,
    [sortBy === 'price' ? (product) => Number(_head(product.variants.edges)?.node?.price) : 'title'],
    [sortOrder],
  )

  if (isLoading) {
    return (
      <div className='min-h-page'>
        <div className='flex justify-center my-2'>
          <Loader />
        </div>
      </div>
    )
  }

  if (_isEmpty(products)) {
    return (
      <div className='min-h-page'>
        <div className='flex justify-center my-2'>
          <p className='text-gray-900'>
            No products found, try again later.
          </p>
        </div>
      </div>
    )
  }

  if (searchQuery && _isEmpty(filteredProducts) && !_isEmpty(products)) {
    return (
      <div className='min-h-page'>
        <div className='flex justify-center my-2'>
          <p className='text-gray-900'>
            No products found, maybe try to
            {' '}
            <span className='text-blue-600 cursor-pointer' onClick={() => setSearchQuery(DEFAULT_SEATCH_QUERY)}>
              reset
            </span>
            {' '}
            your search filter.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-page'>
      <Search onSearch={handleSearch} />
      <div className='flex justify-center mb-2'>
        <button
          type='button'
          onClick={() => handleSort('title')}
          className={cx('mx-2', {
            underline: sortBy === 'title',
          })}
        >
          Sort by Title
        </button>
        <button
          type='button'
          onClick={() => handleSort('price')}
          className={cx('mx-2', {
            underline: sortBy === 'price',
          })}
        >
          Sort by Price
        </button>
      </div>
      <ProductList products={filteredProducts} />
    </div>
  )
}

export default Home
