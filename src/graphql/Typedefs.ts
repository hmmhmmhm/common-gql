import { gql } from 'apollo-boost'
export default gql`

type Query {
    test(text: String): Boolean
}

type Mutation {
    test(text: String): Boolean
}
`