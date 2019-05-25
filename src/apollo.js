import gql from 'graphql-tag'
import { settings } from './settings'

import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'

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

const link = ApolloLink.split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

export const client = new ApolloClient({ cache, link })

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

export const userChanged = id => {
  return client.subscribe({
    variables: { id },
    query: gql`
      subscription UserChanged($id: Int!) {
        userChanged(id: $id) {
          id
          x
          y
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
        }
      }
    `,
  })
}
