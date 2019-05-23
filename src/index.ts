import "source-map-support/register"
import { ApolloClient, gql } from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'


const cache = new InMemoryCache()
const executableSchema = makeExecutableSchema({typeDefs})

addMockFunctionsToSchema({
    schema: executableSchema,
    mocks: resolvers
})

export const LocalGQL = new ApolloClient({
    link: new SchemaLink({ schema: executableSchema }),
    cache
})