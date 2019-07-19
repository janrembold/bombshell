import gql from 'graphql-tag'
import { settings } from './settings'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { HttpLink } from 'apollo-link-http'
import { getMainDefinition } from 'apollo-utilities'
import { RetryLink } from 'apollo-link-retry'

const cache = new InMemoryCache()

const httpLink = new HttpLink({
  uri: settings.serverUri,
})

const wsLink = new WebSocketLink({
  uri: settings.wsUri,
  options: {
    reconnect: true,
  },
})

// TODO
// https://www.apollographql.com/docs/link/composition/
// https://www.npmjs.com/package/apollo-link-error
// works - but without error handling
const link = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error,
  },
}).split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

export const client = new ApolloClient({
  cache,
  link,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})

// creates new user with given name
// returns id of newly created user
export const getUser = async () => {
  return await client.query({
    query: gql`
      query User($id: Int) {
        user(id: $id) {
          id
          x
          y
        }
      }
    `,
    variables: { id: parseInt(localStorage.getItem('id')) },
  })
}

export const initPlayer = async id => {
  return await client.query({
    query: gql`
      query Start($id: Int!) {
        start(id: $id) {
          id
          x
          y
        }
      }
    `,
    variables: { id },
  })
}

export const getEnemies = async id => {
  return await client.query({
    query: gql`
      query Enemies($id: Int!) {
        enemies(id: $id) {
          id
          x
          y
        }
      }
    `,
    variables: { id },
  })
}

export const usersChanged = () => {
  return client.subscribe({
    query: gql`
      subscription UserChanged {
        userChanged {
          id
          x
          y
          direction
        }
      }
    `,
  })
}

export const gameOver = id => {
  return client.subscribe({
    variables: { id },
    query: gql`
      subscription GameOver($id: Int!) {
        gameOver(id: $id) {
          id
        }
      }
    `,
  })
}

// returns x,y coordinates for given user id
export const persistPlayerMove = async (id, direction) => {
  return await client.mutate({
    variables: { id, direction },
    mutation: gql`
      mutation Move($id: Int!, $direction: Int!) {
        move(id: $id, direction: $direction) {
          id
          x
          y
          direction
        }
      }
    `,
  })
}
