import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const ACCESS_TOKEN = process.env.REACT_APP_STOREFRONT_ACCESS_TOKEN
const SHOP_URL = process.env.REACT_APP_SHOP_URL

if (!ACCESS_TOKEN) {
  throw new Error('REACT_APP_STOREFRONT_ACCESS_TOKEN is not defined')
}

if (!SHOP_URL) {
  throw new Error('REACT_APP_SHOP_URL is not defined')
}

const client = new ApolloClient({
  uri: SHOP_URL,
  cache: new InMemoryCache(),
  headers: {
    'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN,
  },
})

const GET_PRODUCTS = gql`
  query getProducts {
    products(first: 50) {
      edges {
        node {
          id
          title
          description
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price
              }
            }
          }
        }
      }
    }
  }
`

export interface IProductNode {
  id: string
  title: string
  description: string
  images: {
    edges: Array<{
      node: {
        originalSrc: string
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        price: string
      }
    }>
  }
}

export interface IProductEdge {
  node: IProductNode
}

export interface IProducts {
  products: {
    edges: Array<IProductEdge>
  }
}

export const getProducts = async (): Promise<IProducts> => {
  const { data } = await client.query({
    query: GET_PRODUCTS,
  })

  return data
}
